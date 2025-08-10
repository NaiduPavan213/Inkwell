const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title : {
        type : String, 
        required : true,
        trim : true, //removes whitespace from both ends
    },
    content : {
        type : String,
        required : true,
    },
    author : {
        //This field (author) is used to link a blog post to the user who created it.
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User', // Reference to the User model
        required : true,
    }
},{
    timestamps : true // Auomatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Post',PostSchema);