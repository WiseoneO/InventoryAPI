import User from '../models/user.model.js';
import {userValidation, validateLogin} from '../validations/user.validdation.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const signUp = async (req, res)=>{
    try{
        // validating our new user
        const {error} = userValidation(req.body);
        if(error) return res.status(400).json({
            msg : error.details[0].message,
        });

        let {firstname, lastname, email, password, confirmPassword} = req.body;

        // check for existing user in the database
        const emailExist = await User.findOne({email});
            if(emailExist){ 
                return res.status(400).json({
                success: false,
                msg: 'Email already esist'
            });
        }
        // Encryptingsh the password
         password = await bcrypt.hash(password,12);
        //  create new user account
        const user = new User({
            firstname, 
            lastname, 
            email, 
            password
        });

        await user.save();
        delete user._doc.password;

        res.status(200).json({
            success: true,
            msg: `User account created`,
            data: user
        })
    }catch(error){
        if(error instanceof Error){
            res.status(500).json({
                success : false,
                msg: `error.message`
            })
        }
    }
}

export const login = async (req, res)=>{
    try{
        // validating our new user
        const {error} = validateLogin(req.body);
        if(error) return res.status(400).json({
            msg : error.details[0].message,
        });

        let {email, password} = req.body;
        const userExist = await User.findOne({email});

        if(!userExist) res.status(401).json({
            success : false,
            msg: `Invalid credentials`
        });
        
        // compare password with the encrypted password
        let hashedPassword = await bcrypt.compare(password, userExist.password)
        if(!hashedPassword) res.status(400).json({
            success : false,
            msg: `Invalid credentials`
        });

        // Issue access token
        const accessToken = jwt.sign(
            {id: userExist._id},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '30m'});

        // issue refresh token
        const refreshToken = jwt.sign(
            {id: userExist._id},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '1d'});

        // store refresh token as a field in the user document in database
        userExist.refreshToken = refreshToken;
        await userExist.save();

        // send refresh token in cookiesas httpOnly
        res.cookie('jwt', refreshToken,{
            httpOnly:true, 
            // sameSite:'None',
            // secure: true,
            maxAge:24 * 60 * 60 * 1000,
        });
        return res.status(200).json({
            success: 'true',
            msg: 'Log in successful',
            accessToken
        });
    }catch(error){
        if(error instanceof Error){
            res.status(500).json({
                success : false,
                msg: error.message
            });
        }
    }
}

export const logout = async (req, res)=>{
    try{
        return res.clearCookie('jwt').status(200).json({
            success: true,
            msg: `Log out successful`
        })
    }catch(error){
        if(error instanceof Error){
            res.status(500).json({
                success : false,
                msg: `${error.message}`
            })
        }
    }
    
}
export const tokenRefresh = async (req, res)=>{
    try{
        const cookies = req.cookies;
        console.log(cookies);

        if(!cookies?.jwt) return res
        .status(401)
        .json({
            success: false, 
            msg:'Access denied! Sign in' 
        });

        const refreshToken = cookies.jwt
        // console.log(refreshToken)

        // check if user account exists in database
        const user = await User.findOne({refreshToken});

        if(!user) res.status(401).json({
            success : false,
            msg: `Access denied! Sign in`
        });

        // Evaluate refresh token
        jwt.verify(refreshToken, 
            process.env.REFRESH_TOKEN_SECRET, 
            (err, decoded)=>{
                if(err || user.id !== decoded.id) return res.status(403).json({
                    success: false,
                    msg: 'Forbidden'
                });

                // Issue access token
                const accessToken = jwt.sign(
                {id: user._id},
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '30s'});

                // send access Token
                return res.status(200).json({
                success: 'true',
                msg: 'Log in successful',
                accessToken
                });
            }
        )

        
        
        
    }catch(error){
        if(error instanceof Error){
            res.status(500).json({
                success : false,
                msg: error.message
            });
        }
    }
}