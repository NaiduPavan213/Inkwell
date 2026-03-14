import request from 'supertest';
import app from '../app';
import * as dbHandler from './db-handler';
import User from '../models/User';

beforeAll(async () => await dbHandler.connect());
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());

describe('Auth Endpoints', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            });
        
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
        
        const user = await User.findOne({ email: 'test@example.com' });
        expect(user).toBeTruthy();
        expect(user?.username).toBe('testuser');
    });

    it('should not register a user with an existing email', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({
                username: 'user1',
                email: 'duplicate@example.com',
                password: 'password123'
            });

        const res = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'user2',
                email: 'duplicate@example.com',
                password: 'password123'
            });
        
        expect(res.statusCode).toEqual(400);
        expect(res.body.msg).toBe('User with this email already exists.');
    });

    it('should login an existing user', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({
                username: 'loginuser',
                email: 'login@example.com',
                password: 'password123'
            });

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'login@example.com',
                password: 'password123'
            });
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });
});
