import joi from 'joi';
import joiPasswordComplexity from 'joi-password-complexity';

const complexityOptions = {
  min: 8,
  max: 50,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 4,
}

export function userValidation(user){
    const schema = joi.object({
        firstname : joi.string().min(2).max(50).required() ,
        lastname : joi.string().min(2).max(50),
        email :joi.string().min(2).max(100).required().email(),
        password :joiPasswordComplexity(complexityOptions).required(),
        confirmpassword : joi.string().min(8).max(128).required().valid(joi.ref('password')),
    }).unknown();
    return schema.validate(user)
}
export function validateLogin(user){
    const schema = joi.object({
        email :joi.string().min(2).max(100).required().email(),
        password :joi.string().min(8).max(100).required()
    }).unknown();
    return schema.validate(user)
}

