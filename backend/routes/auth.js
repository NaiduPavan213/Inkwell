const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

//Registration route
//path : /api/auth/register
router.post('/register', async (req,res) => {
    try {
        //destructure the request body
        const { username , email , password } = req.body;
        //check if user already exists
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({ msg : 'User with this email already exists.'});
        }
        //check if the username already exists
        let existingUsername = await User.findOne({username});
        if(existingUsername){
            return res.status(400).json({ msg : 'Username already taken. '});
        }
        //create a new user
        user = new User({
            username,
            email,
            password,
        });
        // hash the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password , salt);
        //save the user to the database
        await user.save();
        //create and return a jwt token
        const payload = {
            user : {
                id : user.id,
            },
        };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn : '5h'},
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ token }); // Send token back to client
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

//Login route
//path : /api/auth/login
router.post('/login' , async (req , res) => {
    try{
        const { email , password } = req.body;
        //check if user exists
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({ msg : 'Invalid credentials.' });
        } 
        //check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ msg: 'Invalid credentials.'});
        }
        //if credentials are valid , create and return a jwt token
        const payload = {
            user : {
                id : user.id,
            },
        };
        
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn : '5h'},
            (err , token ) => {
                if( err) throw err;
                res.json({ token }); // Send token back to client
            }
        )

    } catch (err){
        if(err){
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
});

module.exports = router;