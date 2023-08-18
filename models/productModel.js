const mongoose= require("mongoose");

const productSchema =new mongoose.Schema({
name:{type:String, required: true},
size:[String],
prices:[Object],
category: { type: String, required: true },
image: { type: String, required: true },
description: { type: String, required: true }

},{
    timestamps:true,
})

const productModel=mongoose.model('products',productSchema);
module.exports = productModel;