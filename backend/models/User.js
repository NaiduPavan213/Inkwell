const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true,
        trim : true, // Removes whitespace from both ends
    },
    email : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true, // Saves email in lowercase
    },
    password : {
        type : String,
        required : true,
    }
},{
    timestamps : true // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('User',UserSchema);