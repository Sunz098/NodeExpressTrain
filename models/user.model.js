const mongoose = require('mongoose');
const {Schema } = mongoose;


const userSchema  = new Schema({
    name: {
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    status :{
        type: String,
        enum:['approve' , 'not_approve'],
        default: 'not_approve'
    }
    
  
}, {timestamps:true});

module.exports = mongoose.model('users', userSchema);