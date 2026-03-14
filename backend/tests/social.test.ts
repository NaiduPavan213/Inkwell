import request from 'supertest';
import app from '../app';
import * as dbHandler from './db-handler';
import Post from '../models/Post';
import User from '../models/User';
import Comment from '../models/Comment';

let token: string;
let userId: any;
let postId: string;

beforeAll(async () => {
    await dbHandler.connect();
    
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
    userId = user?._id;

    const postRes = await request(app)
        .post('/api/posts')
        .set('x-auth-token', token)
        .send({
            title: 'Social Test Post',
            content: 'Content'
        });
    postId = postRes.body._id;
});

afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());

describe('Social Endpoints', () => {
    it('should add a comment to a post', async () => {
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
    });

    it('should get comments for a post', async () => {
        const postRes = await request(app)
            .post('/api/posts')
            .set('x-auth-token', token)
            .send({ title: 'T', content: 'C' });
        const pid = postRes.body._id;

        await new Comment({
            text: 'Manual Comment',
            author: userId,
            post: pid,
            authorUsername: 'socialuser'
        }).save();

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

        const likeRes = await request(app)
            .post(`/api/posts/${pid}/like`)
            .set('x-auth-token', token);
        expect(likeRes.statusCode).toEqual(201);

        const unlikeRes = await request(app)
            .post(`/api/posts/${pid}/like`)
            .set('x-auth-token', token);
        expect(unlikeRes.statusCode).toEqual(200);
    });
});
