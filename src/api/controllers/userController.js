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

        if(!userExist) res.status(400).json({
            success : false,
            msg: `Invalid credentials`
        });
        
        // compare password with the encrypted password
        let hashedPassword = await bcrypt.compare(password, userExist.password)
        if(!hashedPassword) res.status(400).json({
            success : false,
            msg: `Invalid credentials`
        });

        // create a JWT token
        const token =jwt.sign({id: userExist._id}, process.env.USER_JWT_SECRET)
        res.cookie('auth_token', token).status(200).json({
            success: true,
            msg: 'Logged in successfully',
            token : token
        })
    }catch(error){
        if(error instanceof Error){
            res.status(500).json({
                success : false,
                msg: error.message
            })
        }
    }
}

export const logout = async (req, res)=>{
    try{
        return res.clearCookie('auth_token').status(200).json({
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