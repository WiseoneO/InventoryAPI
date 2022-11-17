import mongoose, { Schema } from "mongoose";
const {schema, model} = mongoose;

const userSchema = new Schema({
    firstname: {
        type : String,
        required: true,
        max: 50,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        max: 50,
        trim: true
    },
    email: {
        type: String,
        required:true,
        lowercase:true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 128,
    },
    refreshToken: {
        type: String,
        default: '',
        select: false
    }
},{
    timestamp: true
}
);

export default model('User', userSchema);