import jwt from 'jsonwebtoken';

export const authorize = async (req, res, next)=>{
    try{
        const token = req.cookies.auth_token;
    
        if(!token) return res
        .status(400)
        .json({
            success: false, 
            msg:'Access denied! Sign in' 
        });
    
        const verified = jwt.verify(token, process.env.USER_JWT_SECRET);
        req.user = verified;
        next();
    }catch(error){
        if(error instanceof Error){
            res.status(500).json({
                success: false,
                msg: `${error.message}`
            });
        }
    }

}