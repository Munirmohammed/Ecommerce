import './setup';
import request from 'supertest';
import express from 'express';
import authRoutes from '@/routes/auth.routes';
import { errorHandler } from '@/middleware/errorHandler';
import { prisma } from '@/config/database';
import bcrypt from 'bcrypt';

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);
app.use(errorHandler);

describe('Auth Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        id: '123',
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
        createdAt: new Date(),
      };

      (prisma.user.findUnique as jest.Mock)
        .mockResolvedValueOnce(null) // email check
        .mockResolvedValueOnce(null); // username check
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app).post('/auth/register').send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test@123',
      });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe('test@example.com');
    });

    it('should fail with invalid email format', async () => {
      const response = await request(app).post('/auth/register').send({
        username: 'testuser',
        email: 'invalid-email',
        password: 'Test@123',
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should fail with weak password', async () => {
      const response = await request(app).post('/auth/register').send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'weak',
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should fail with non-alphanumeric username', async () => {
      const response = await request(app).post('/auth/register').send({
        username: 'test user!',
        email: 'test@example.com',
        password: 'Test@123',
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should fail when email already exists', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
        id: '123',
        email: 'test@example.com',
      });

      const response = await request(app).post('/auth/register').send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test@123',
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const hashedPassword = await bcrypt.hash('Test@123', 10);
      const mockUser = {
        id: '123',
        username: 'testuser',
        email: 'test@example.com',
        password: hashedPassword,
        role: 'user',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app).post('/auth/login').send({
        email: 'test@example.com',
        password: 'Test@123',
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.email).toBe('test@example.com');
    });

    it('should fail with invalid credentials', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app).post('/auth/login').send({
        email: 'test@example.com',
        password: 'WrongPassword@123',
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should fail with wrong password', async () => {
      const hashedPassword = await bcrypt.hash('Test@123', 10);
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        password: hashedPassword,
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app).post('/auth/login').send({
        email: 'test@example.com',
        password: 'WrongPassword@123',
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
