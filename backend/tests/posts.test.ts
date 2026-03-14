import request from 'supertest';
import app from '../app';
import * as dbHandler from './db-handler';
import Post from '../models/Post';
import User from '../models/User';

let token: string;
let userId: any;

beforeAll(async () => {
    await dbHandler.connect();
    
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
    userId = user?._id;
});

afterEach(async () => await dbHandler.clearDatabase());
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

    it('should update a post', async () => {
        const newPost = new Post({
            title: 'Old Title',
            content: 'Old Content',
            author: userId
        });
        await newPost.save();

        const res = await request(app)
            .put(`/api/posts/${newPost._id}`)
            .set('x-auth-token', token)
            .send({
                title: 'Updated Title',
                content: 'Updated Content'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body.title).toBe('Updated Title');
    });

    it('should delete a post', async () => {
        const newPost = new Post({
            title: 'To Be Deleted',
            content: 'Content',
            author: userId
        });
        await newPost.save();

        const res = await request(app)
            .delete(`/api/posts/${newPost._id}`)
            .set('x-auth-token', token);

        expect(res.statusCode).toEqual(200);
        expect(res.body.msg).toBe('Post removed successfully');
    });
});
