require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
	.then(() => console.log('MongoDB is connected successfully'))
	.catch( err => console.error('MongoDB connection error',err));

app.get('/',(req,res) => {
	res.send('Inkwell blogging platform API is running successfully');
});

// Importing the auth routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api', require('./routes/social'));



const PORT = process.env.PORT || 5000;
app.listen( PORT , () => {
	console.log(`server running successfully on ${PORT}`);
});