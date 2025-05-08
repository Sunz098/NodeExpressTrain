const mongoose = require('mongoose');
const {Schema } = mongoose; 


const productSchema  = new Schema({
    name : {type : String , required : true},
    price : {type : Number , required : true},
    stock : {type : Number , required : true ,default : 0},
    userId : {
        type : Schema.Types.ObjectId,
        ref: 'user' 
    },
}, {timestamps:true});


module.exports = mongoose.model('products', productSchema);
