const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userTable = new Schema({
    username:{
        type: String,
        required: true,
    },
    firstname: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    role:{
        type: Number,
    }

})

// const roleTable = new Schema({
//    role 
// })
module.exports = mongoose.model('User', userTable)