const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Post = require('../models/Post');
const User = require('../models/User');

// Create a new post
// @route   POST /api/posts
// @desc    Create a new blog post
// @access  Private (requires token)
router.post('/', authMiddleware , async (req, res) => {
    try{
        // Get the user from the database using the ID from the auth middleware
        const user = await User.findById(req.user.id).select('-password');

        //create a new post instance
        const newPost = new Post({
            title : req.body.title,
            content : req.body.content,
            author : req.user.id,
        });

        const post = await newPost.save();
        res.status(201).json(post);
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- GET ALL POSTS ---
// @route   GET /api/posts
// @desc    Get all blog posts
// @access  Public
router.get('/', async (req,res) => {
    try{
        // Find all posts and sort them by date in descending order (newest first)
        const posts = await Post.find().sort({ createdAt: -1});
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- GET A SINGLE POST BY ID ---
// @route   GET /api/posts/:id
// @desc    Get a single blog post
// @access  Public
router.get('/:id', async (req , res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({ msg : 'Post not found'});
        }
        res.json(post);
    } catch(err){
        console.error(err.message);
        if(err.kind === 'ObjectId'){
            return res.status(404).json({ msg :  'post not found.'});
        }
        res.status(500).send('Server error');
    }
});

// --- UPDATE A POST ---
// @route   PUT /api/posts/:id
// @desc    Update a user's blog post
// @access  Private
router.put('/:id' , authMiddleware , async(req , res) => {
    try{
        let post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({ msg : 'post not found'});
        }
        // check if the user is the author of the post
        if(post.author.toString() !== req.user.id){
            return res.status(401).json({ msg : 'User not authorised to update the post'});
        }
        // Update the post with the new data
        post = await Post.findByIdAndUpdate(
            req.params.id,
            { $set : req.body},
            {new : true}
        );
        res.json(post);
    } catch(err){
        console.error(err.message);
        res.status(500).send('server error');
    }
});

// --- DELETE A POST ---
// @route   DELETE /api/posts/:id
// @desc    Delete a user's blog post
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        // Check if the user trying to delete the post is the original author
        if (post.author.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await post.deleteOne();

        res.json({ msg: 'Post removed successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;