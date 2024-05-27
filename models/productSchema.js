const mongoose = require('mongoose')


const productSchema = mongoose.Schema({

    imageUrl: { type: String, required: false },
    userId : {type:String},
    price: { type: Number, required: true },
    area: { type: String, required: true },
    place:{type: String  , required:true},
    bedrooms : {type:Number , required:true},
    bathrooms : {type:Number , required:true},
    nearBy:{type:String , required:true},
    
})

const Product = mongoose.model("Product" , productSchema);
module.exports = Product;




