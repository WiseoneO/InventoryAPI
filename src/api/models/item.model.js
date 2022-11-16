import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const itemSchema = new Schema({
    user: {
        type : Schema.Types.ObjectId,
        ref:'User'
    },
    name: {
        type : String,
        required : true,
        max : 50,
        trim : true
    },
    description : {
        type : String,
        default : 'No description yet.',
        max : 255,
        trim : true
    },
    category : {
        type : String,
        required : true,
        max : 30,
        trim : true
    },
    initialPrice : {
        type : Number,
        required : true,
        trim : true
    },
    currentValue : {
        type : Number,
        required : true,
        trim : true
    },
    noInStock : {
        type : Number,
        default : 0,
        trim : true
    },
},
    {
        timestamps: true
    }
);

const itemModel = model('Item', itemSchema);
export default itemModel;