const User=require('../../model/User')
const request = require("supertest");
const app = require('../../server');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

describe('login', () => {
 
    test('login with valid credentials', async () => {
        // create a new user with hashed password
        const password = 'password123';
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username: 'testuser', password: hashedPassword });
        await user.save();
    
        // send a login request with the user's credentials
        const response = await request(app)
            .post('/api/user/login')
            .send({ username: 'testuser', password:'password123' });
    
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'login successful!');
        expect(response.body).toHaveProperty('token');
    
        // verify the token
        const decoded = jwt.verify(response.body.token, 'verySecretValue');
        expect(decoded).toHaveProperty('username', 'testuser');
    });
    
    test('login with invalid credentials', async () => {
        // send a login request with invalid credentials
        const response = await request(app)
            .post('/api/user/login')
            .send({ username: 'testuser', password: 'wrongpassword' });
    
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Invalid username or password');
    });
    });




        describe('add new user', () => {
            beforeEach(() => {
                User.prototype.save = jest.fn().mockResolvedValue(true);
                bcrypt.hash = jest.fn((password, salt, cb) => cb(null, 'hashedpassword'));
            });
        
            it('should add a new user', async () => {
                const user = {
                    username: 'testuser',
                    email: 'test@email.com',
                    password: 'testpassword'
                };
        
                const res = await request(app)
                    .post('/api/user/adduser')
                    .send(user);
        
                expect(bcrypt.hash).toHaveBeenCalledWith(user.password, 10, expect.any(Function));
                expect(User.prototype.save).toHaveBeenCalled();
                expect(res.status).toBe(200);
                expect(res.body.message).toBe('user added successfully');
            });
        
            it('should return an error if bcrypt hash fails', async () => {
                bcrypt.hash = jest.fn((password, salt, cb) => cb('error', null));
        
                const user = {
                    username: 'testuser',
                    email: 'test@email.com',
                    password: 'testpassword'
                };
        
                const res = await request(app)
                    .post('/api/user/adduser')
                    .send(user);
        
                expect(res.status).toBe(200);
                expect(res.body.error).toBe('error');
            });
        
            it('should return an error if user save fails', async () => {
                User.prototype.save = jest.fn().mockRejectedValue(new Error('error'));
        
                const user = {
                    username: 'testuser',
                    email: 'test@email.com',
                    password: 'testpassword'
                };
        
                const res = await request(app)
                    .post('/api/user/adduser')
                    .send(user);
        
                expect(res.status).toBe(500);
                expect(res.body.message).toBe('An error occured');
            });
        });
        