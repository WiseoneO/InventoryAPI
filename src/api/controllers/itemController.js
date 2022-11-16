import itemModel from "../models/item.model.js";
import {itemValidation}  from "../validations/item.validation.js";

// create Item
export async function createItem(req, res){
    try{
        const {error} = itemValidation(req.body);
            if(error) return res.status(400).json({
                msg : error.details[0].message,
            });
        
        const itemExist = await itemModel.findOne({name : req.body.name});
        if(itemExist){
            itemExist.noInStock += Number(req.body.noInStock);
            await itemExist.save();
            return res.status(201).json({
                success : true,
                msg : 'Number in stock Updated',
                data : itemExist
            });
        }

        const item = new itemModel({...req.body, user: req.user.id});
        const saveitem = await item.save();
        return res.status(201).json({
            success : true,
            msg : 'Item created successfully.',
            data : saveitem
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

// Getting all existing items
export async function getItem(req, res){
    try{
        const items = await itemModel.find();
        if(items.length ===0) return res.status(200).json({
            status: 'true', 
            msg : 'No item found!'
        });
        res.status(200).json({
            total : items.length,
            status: true,
            msg : items,
        });
    }catch(error){
        if(error instanceof Error){
            res.status(500).json({
                success : false,
                msg: error.message
            })
        }
    }
}

// Getting a specific item
export async function getSpecificItem(req, res){
    try{
        const item = await itemModel.findOne({_id : req.params.id});
        if(!item) throw new Error(`ID ${req.params.id} does not exist!`)
        res.status(200).json({
            success : true,
            msg : item
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

// sort,filter,Query
export async function filterItem(req, res){
    try{
        // .sort({category : 1, price: -1})
        // .limit(2) Only returns a set of documents
        // .skip(2) skips the first 2 items in the beginning

        // const items = await itemModel.find().limit(2);
        // const items = await itemModel.find().sort({category:1, price: -1});
        // const items = await itemModel.find().sort({price: -1}).limit(3);
        // const items = await itemModel.find().sort({price: 1}).skip(5);

        // query conditions
        // $eq - check for equality equality
        // $ne - check for not equal
        // $gt - greater than
        // $gte - greater than or equal
        // $lt/$lte - less than or equal to
        // $in - ckeck if a value is one of many
        // $nin - check if value is none of many
        // $and - check that multiple conditions are all true
        // $not - Negate the filter inside of $not
        // $exists - checks if a field exists
        // $expr - Do a comparison between different fields

        // const query = { };
        // const query = {$not : [{category : 'House hold'}, {price : {$lte : 1000}}]};
        const query = { $expr : {$lt: ['$currentValue', '$initialPrice']}};

        const items = await itemModel.find(query);
        if(items.length === 0) return res.status(200).json({
            status: 'true', 
            msg : 'No item found!'
        });
        res.status(200).json({
            total : items.length,
            status: true,
            msg : items
        });
    }catch(error){
        if(error instanceof Error){
            res.status(500).json({
                success : false,
                msg: error.message
            })
        }
    }
}

export async function regex(req, res){
    try{
        // case-insensitive => /ABC/i
        // const query = {name: /Mercedees /i};

        // starts with => /^abc/
        // const query = {name : {$regex: /^Me/i}}

        // combining starts with with case-sensitive/^ABC/
        // const query = {name : {$regex: /^Ip/i}}

        // Ends with => /abc$/
        // const query = {name : {$regex: /rt$/i}};


        // Turn case insensitive on and off
        // const query = {name : {$regex: '(?i)Ip(?-i)hone'}};

        // case1 : Word Boundary => \b start with
        // const query = {name : {$regex: /\bMa/i}}
        // case2 : endswith
        // const query = {name : {$regex: /t\b/i}}

        // Lookahead Assertion=> x(?-y)
        // checks for where x is followed by y
        // const query = {name : {$regex: /iphone (?=13)/i}}

        // Negative lookahead Assertion
        // const query = {name : {$regex: /Iphone (?!13)/i}}
        
        // Look behind Assertion =>(?<=y)x
        // const query = {name : {$regex: /(?<=Mercedees )Gwagon/i }}

        // Negative Look behind Assertion =>(?<!y)x ***this example has space hence revomeve space
        const query = {name : {$regex: /(?<!iphone )3/i }}

        const items = await itemModel.find(query).sort({currentValue : -1});
        if(items.length === 0) throw Error('No item found!')
            res.status(200).json({
                success : true,
                data : items
            })
        
    }catch(error){
        if(error instanceof Error){
            res.status(500).json({
                success : false,
                msg : `${error.message}`
            })
        }
    }
}