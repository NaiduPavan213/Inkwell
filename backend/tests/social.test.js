const request = require('supertest');
const app = require('../app');
const dbHandler = require('./db-handler');
const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');

let token;
let userId;
let postId;

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => {
    await dbHandler.connect();
    
    // Setup: Create user and post
    await request(app)
        .post('/api/auth/register')
        .send({
            username: 'socialuser',
            email: 'social@example.com',
            password: 'password123'
        });

    const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
            email: 'social@example.com',
            password: 'password123'
        });
    
    token = loginRes.body.token;
    const user = await User.findOne({ email: 'social@example.com' });
    userId = user._id;

    const postRes = await request(app)
        .post('/api/posts')
        .set('x-auth-token', token)
        .send({
            title: 'Social Test Post',
            content: 'Content'
        });
    postId = postRes.body._id;
});

/**
 * Clear all test data after every test.
 */
afterEach(async () => await dbHandler.clearDatabase());

/**
 * Remove and close the db and server.
 */
afterAll(async () => await dbHandler.closeDatabase());

describe('Social Endpoints', () => {
    it('should add a comment to a post', async () => {
        // Redo setup in each test because of clearDatabase afterEach
        const postRes = await request(app)
            .post('/api/posts')
            .set('x-auth-token', token)
            .send({ title: 'T', content: 'C' });
        const pid = postRes.body._id;

        const res = await request(app)
            .post(`/api/posts/${pid}/comments`)
            .set('x-auth-token', token)
            .send({ text: 'This is a test comment' });
        
        expect(res.statusCode).toEqual(201);
        expect(res.body.text).toBe('This is a test comment');
        expect(res.body.authorUsername).toBe('socialuser');
    });

    it('should get comments for a post', async () => {
        const postRes = await request(app)
            .post('/api/posts')
            .set('x-auth-token', token)
            .send({ title: 'T', content: 'C' });
        const pid = postRes.body._id;

        const newComment = new Comment({
            text: 'Manual Comment',
            author: userId,
            post: pid,
            authorUsername: 'socialuser'
        });
        await newComment.save();

        const res = await request(app).get(`/api/posts/${pid}/comments`);
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].text).toBe('Manual Comment');
    });

    it('should like and then unlike a post', async () => {
        const postRes = await request(app)
            .post('/api/posts')
            .set('x-auth-token', token)
            .send({ title: 'T', content: 'C' });
        const pid = postRes.body._id;

        // Like
        const likeRes = await request(app)
            .post(`/api/posts/${pid}/like`)
            .set('x-auth-token', token);
        expect(likeRes.statusCode).toEqual(201);
        expect(likeRes.body.msg).toBe('Post liked');

        // Unlike
        const unlikeRes = await request(app)
            .post(`/api/posts/${pid}/like`)
            .set('x-auth-token', token);
        expect(unlikeRes.statusCode).toEqual(200);
        expect(unlikeRes.body.msg).toBe('Post unliked');
    });
});
