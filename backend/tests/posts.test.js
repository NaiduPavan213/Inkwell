const request = require('supertest');
const app = require('../app');
const dbHandler = require('./db-handler');
const Post = require('../models/Post');
const User = require('../models/User');

let token;
let userId;

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => {
    await dbHandler.connect();
    
    // Register and login to get a token
    await request(app)
        .post('/api/auth/register')
        .send({
            username: 'postauthor',
            email: 'author@example.com',
            password: 'password123'
        });

    const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
            email: 'author@example.com',
            password: 'password123'
        });
    
    token = loginRes.body.token;
    
    const user = await User.findOne({ email: 'author@example.com' });
    userId = user._id;
});

/**
 * Clear all test data after every test.
 */
afterEach(async () => await dbHandler.clearDatabase());

/**
 * Remove and close the db and server.
 */
afterAll(async () => await dbHandler.closeDatabase());

describe('Post Endpoints', () => {
    it('should create a new post', async () => {
        const res = await request(app)
            .post('/api/posts')
            .set('x-auth-token', token)
            .send({
                title: 'Test Post Title',
                content: 'Test Post Content'
            });
        
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.title).toBe('Test Post Title');
    });

    it('should get all posts', async () => {
        // First create a post
        const newPost = new Post({
            title: 'Existing Post',
            content: 'Existing Content',
            author: userId
        });
        await newPost.save();

        const res = await request(app).get('/api/posts');
        
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBe(1);
        expect(res.body[0].title).toBe('Existing Post');
    });

    it('should get a single post by id', async () => {
        const newPost = new Post({
            title: 'Unique Post',
            content: 'Unique Content',
            author: userId
        });
        await newPost.save();

        const res = await request(app).get(`/api/posts/${newPost._id}`);
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.title).toBe('Unique Post');
    });

    it('should not create a post without a title', async () => {
        const res = await request(app)
            .post('/api/posts')
            .set('x-auth-token', token)
            .send({
                content: 'Content only'
            });
        
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('errors');
    });
});
