import jwt from 'jsonwebtoken';

export const authorize = async (req, res, next)=>{
    try{
        const authHeader = req.headers['authorization']
        if(!authHeader) return res
        .status(401)
        .json({
            success: false, 
            msg:'Access denied! Sign in' 
        });

        // verify token
        const token =authHeader.split(' ')[1];
        const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = verified;
        next();
    }catch(error){
        if(error instanceof Error){
            res.status(401).json({
                success: false,
                msg: `${error.message}`
            });
        }
    }
}