import './setup';
import request from 'supertest';
import express from 'express';
import productRoutes from '@/routes/product.routes';
import { errorHandler } from '@/middleware/errorHandler';
import { prisma } from '@/config/database';
import { generateToken } from '@/utils/jwt';

const app = express();
app.use(express.json());
app.use('/products', productRoutes);
app.use(errorHandler);

describe('Product Endpoints', () => {
  let adminToken: string;
  let userToken: string;

  beforeAll(() => {
    adminToken = generateToken({
      userId: 'admin-id',
      username: 'admin',
      role: 'admin',
    });

    userToken = generateToken({
      userId: 'user-id',
      username: 'user',
      role: 'user',
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /products', () => {
    it('should get all products with pagination', async () => {
      const mockProducts = [
        {
          id: '1',
          name: 'Product 1',
          description: 'Description 1',
          price: 99.99,
          stock: 10,
          category: 'Electronics',
        },
      ];

      (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);
      (prisma.product.count as jest.Mock).mockResolvedValue(1);

      const response = await request(app).get('/products?page=1&limit=10');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.pageNumber).toBe(1);
      expect(response.body.totalSize).toBe(1);
    });

    it('should search products by name', async () => {
      const mockProducts = [
        {
          id: '1',
          name: 'Laptop',
          description: 'Gaming laptop',
          price: 999.99,
          stock: 5,
          category: 'Electronics',
        },
      ];

      (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);
      (prisma.product.count as jest.Mock).mockResolvedValue(1);

      const response = await request(app).get('/products?search=laptop');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
    });
  });

  describe('GET /products/:id', () => {
    it('should get product by id', async () => {
      const mockProduct = {
        id: '1',
        name: 'Product 1',
        description: 'Description 1',
        price: 99.99,
        stock: 10,
        category: 'Electronics',
      };

      (prisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);

      const response = await request(app).get('/products/1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Product 1');
    });

    it('should return 404 for non-existent product', async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/products/999');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /products', () => {
    it('should create product as admin', async () => {
      const mockProduct = {
        id: '1',
        name: 'New Product',
        description: 'New Description',
        price: 49.99,
        stock: 20,
        category: 'Electronics',
      };

      (prisma.product.create as jest.Mock).mockResolvedValue(mockProduct);

      const response = await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'New Product',
          description: 'New Description',
          price: 49.99,
          stock: 20,
          category: 'Electronics',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('New Product');
    });

    it('should fail without authentication', async () => {
      const response = await request(app).post('/products').send({
        name: 'New Product',
        description: 'New Description',
        price: 49.99,
        stock: 20,
        category: 'Electronics',
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should fail as regular user', async () => {
      const response = await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'New Product',
          description: 'New Description',
          price: 49.99,
          stock: 20,
          category: 'Electronics',
        });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it('should fail with invalid data', async () => {
      const response = await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'AB', // too short
          description: 'Short',
          price: -10, // negative
          stock: -5, // negative
          category: 'Electronics',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /products/:id', () => {
    it('should update product as admin', async () => {
      const mockProduct = {
        id: '1',
        name: 'Updated Product',
        description: 'Updated Description',
        price: 59.99,
        stock: 15,
        category: 'Electronics',
      };

      (prisma.product.findUnique as jest.Mock).mockResolvedValue({ id: '1' });
      (prisma.product.update as jest.Mock).mockResolvedValue(mockProduct);

      const response = await request(app)
        .put('/products/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Updated Product',
          price: 59.99,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Updated Product');
    });

    it('should return 404 for non-existent product', async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .put('/products/999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Updated Product',
        });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /products/:id', () => {
    it('should delete product as admin', async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue({ id: '1' });
      (prisma.product.delete as jest.Mock).mockResolvedValue({ id: '1' });

      const response = await request(app)
        .delete('/products/1')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should return 404 for non-existent product', async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .delete('/products/999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('should fail as regular user', async () => {
      const response = await request(app)
        .delete('/products/1')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });
});
