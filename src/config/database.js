import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config();

const PORT = process.env.PORT  || 6000;

// setup Database
const connectDatabase = async (app)=>{
    try{
        await mongoose.connect(
            process.env.DB_URI,
            ()=>{
                console.log('Connected to database...');
                app.listen(PORT, ()=>console.log(`Server listening on localhost:${PORT}...`));
            }
        );
    }catch(error){
        console.log(error);
    }
}

export default connectDatabase
