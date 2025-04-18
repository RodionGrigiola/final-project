require("dotenv/config");
import Email from '../src/services/Email'; // Import for TypeScript usage
import request from 'supertest';
import app from '../src/app'; 
import User from '../src/model/userModel';
import { setupTestDB, testUser, testPhotoPath } from './setup';
import { IUser } from '../src/types';

setupTestDB();

jest.mock('../src/services/Email', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation((user: IUser, url: string) => ({
      sendWelcome: jest.fn().mockResolvedValue(true)
    }))
  }));

describe('Authentication Routes', () => {
  describe('POST /signup', () => {
    it('should create a new user and return a token', async () => {
      const res = await request(app)
        .post('/users/signup')
        .send(testUser)
        .expect(201);

      expect(res.body.status).toBe('success');
      expect(res.body.token).toBeDefined();
      expect(res.body.data.user.email).toBe(testUser.email);
      expect(res.body.data.user.password).toBeUndefined();

      // Verify user was saved to DB
      const users = await User.find();
      expect(users.length).toBe(1);
      expect(users[0].email).toBe(testUser.email);
    });

    it('should send welcome email after successful signup', async () => {
      const res = await request(app)
        .post('/users/signup')
        .send(testUser)
        .expect(201);
  
          // Verify email was sent
      expect(Email).toHaveBeenCalledTimes(1);
    
      // Verify constructor was called with correct arguments
      expect(Email).toHaveBeenCalledWith(
        expect.objectContaining({
          email: testUser.email,
          name: testUser.name
        }),
        expect.stringContaining('http://')
      );
    })

    it('should create a user with photo and return photo URL', async () => {
      const res = await request(app)
        .post('/users/signup')
        .field('name', testUser.name)
        .field('email', testUser.email)
        .field('password', testUser.password)
        .field('passwordConfirmation', testUser.passwordConfirmation)
        .attach('photo', testPhotoPath)
        .expect(201);

      expect(res.body.data.user.photo).toBeDefined();
      expect(res.body.data.user.photo).toContain('data:image');
    });

    it('should fail with 400 if passwords do not match', async () => {
      const res = await request(app)
        .post('/users/signup')
        .send({
          ...testUser,
          passwordConfirmation: 'wrongpassword'
        })
        .expect(400);

      expect(res.body.status).toBe('fail');
    });

    it('should fail with 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/users/signup')
        .send({
          name: 'Test User',
          password: 'test1234'
          // Missing email and passwordConfirmation
        })
        .expect(400);

      expect(res.body.status).toBe('fail');
    });
  });

  describe('POST /login', () => {
    beforeEach(async () => {
      // Create a user to test login
      await request(app).post('/users/signup').send(testUser);
    });

    it('should login user and return token', async () => {
      const res = await request(app)
        .post('/users/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);

      expect(res.body.status).toBe('success');
      expect(res.body.token).toBeDefined();
      expect(res.body.data.user.email).toBe(testUser.email);
    });

    it('should fail with 400 if email or password is missing', async () => {
      await request(app)
        .post('/users/login')
        .send({ email: testUser.email })
        .expect(400);

      await request(app)
        .post('/users/login')
        .send({ password: testUser.password })
        .expect(400);
    });

    it('should fail with 401 if password is incorrect', async () => {
      const res = await request(app)
        .post('/users/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        })
        .expect(401);

      expect(res.body.error_message).toBe('Incorrect email or password');
    });

    it('should fail with 401 if email does not exist', async () => {
      const res = await request(app)
        .post('/users/login')
        .send({
          email: 'nonexistent@example.com',
          password: testUser.password
        })
        .expect(401);

      expect(res.body.error_message).toBe('Incorrect email or password');
    });
  });

  describe('GET /logout', () => {
    it('should clear the JWT cookie', async () => {
      // First login to get a token
      await request(app).post('/users/signup').send(testUser); // auto login

      // Now test logout
      const res = await request(app)
        .get('/users/logout')
        .expect(200);

      expect(res.body.status).toBe('success');
      
      // Check if cookie was cleared
      const cookie = res.headers['set-cookie'][0];
      expect(cookie).toContain('jwt=userloggedout');
      expect(cookie).toContain('Expires=');
    });
  });
});