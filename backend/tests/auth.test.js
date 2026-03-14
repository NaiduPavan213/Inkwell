const request = require('supertest');
const app = require('../app');
const dbHandler = require('./db-handler');
const User = require('../models/User');

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => await dbHandler.connect());

/**
 * Clear all test data after every test.
 */
afterEach(async () => await dbHandler.clearDatabase());

/**
 * Remove and close the db and server.
 */
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
        expect(user.username).toBe('testuser');
    });

    it('should not register a user with an existing email', async () => {
        // Register first user
        await request(app)
            .post('/api/auth/register')
            .send({
                username: 'user1',
                email: 'duplicate@example.com',
                password: 'password123'
            });

        // Try to register with same email
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
        // Register a user
        await request(app)
            .post('/api/auth/register')
            .send({
                username: 'loginuser',
                email: 'login@example.com',
                password: 'password123'
            });

        // Login
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'login@example.com',
                password: 'password123'
            });
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should not login with wrong credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'nonexistent@example.com',
                password: 'wrongpassword'
            });
        
        expect(res.statusCode).toEqual(400);
        expect(res.body.msg).toBe('Invalid credentials.');
    });
});
