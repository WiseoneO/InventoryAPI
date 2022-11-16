import joi from 'joi';
export function itemValidation(item){
    const schema = joi.object({
        name : joi.string().min(2).max(50).required() ,
        description : joi.string().min(2).max(255),
        category :joi.string().min(2).max(50).required(),
        // price : joi.number().required()
    }).unknown();
    return schema.validate(item)
}