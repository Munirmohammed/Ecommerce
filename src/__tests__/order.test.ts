import './setup';
import request from 'supertest';
import express from 'express';
import orderRoutes from '@/routes/order.routes';
import { errorHandler } from '@/middleware/errorHandler';
import { prisma } from '@/config/database';
import { generateToken } from '@/utils/jwt';

const app = express();
app.use(express.json());
app.use('/orders', orderRoutes);
app.use(errorHandler);

describe('Order Endpoints', () => {
  let userToken: string;

  beforeAll(() => {
    userToken = generateToken({
      userId: 'user-id',
      username: 'user',
      role: 'user',
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /orders', () => {
    it('should create order successfully', async () => {
      const mockProducts = [
        {
          id: 'product-1',
          name: 'Product 1',
          price: 99.99,
          stock: 10,
        },
      ];

      const mockOrder = {
        id: 'order-1',
        userId: 'user-id',
        totalPrice: 199.98,
        status: 'pending',
        orderItems: [
          {
            id: 'item-1',
            productId: 'product-1',
            quantity: 2,
            price: 99.99,
            product: mockProducts[0],
          },
        ],
      };

      // mock transaction
      (prisma.$transaction as jest.Mock).mockImplementation(async (callback) => {
        const tx = {
          product: {
            findMany: jest.fn().mockResolvedValue(mockProducts),
            update: jest.fn(),
          },
          order: {
            create: jest.fn().mockResolvedValue(mockOrder),
          },
        };
        return callback(tx);
      });

      const response = await request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send([
          {
            productId: 'product-1',
            quantity: 2,
          },
        ]);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.totalPrice).toBe(199.98);
    });

    it('should fail without authentication', async () => {
      const response = await request(app).post('/orders').send([
        {
          productId: 'product-1',
          quantity: 2,
        },
      ]);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should fail with empty order', async () => {
      const response = await request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send([]);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should fail with invalid quantity', async () => {
      const response = await request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send([
          {
            productId: 'product-1',
            quantity: 0, // invalid
          },
        ]);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should fail when product not found', async () => {
      (prisma.$transaction as jest.Mock).mockImplementation(async (callback) => {
        const tx = {
          product: {
            findMany: jest.fn().mockResolvedValue([]), // no products found
          },
        };
        return callback(tx);
      });

      const response = await request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send([
          {
            productId: 'non-existent',
            quantity: 1,
          },
        ]);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('should fail when insufficient stock', async () => {
      const mockProducts = [
        {
          id: 'product-1',
          name: 'Product 1',
          price: 99.99,
          stock: 1, // only 1 in stock
        },
      ];

      (prisma.$transaction as jest.Mock).mockImplementation(async (callback) => {
        const tx = {
          product: {
            findMany: jest.fn().mockResolvedValue(mockProducts),
          },
        };
        return callback(tx);
      });

      const response = await request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send([
          {
            productId: 'product-1',
            quantity: 5, // requesting more than available
          },
        ]);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /orders', () => {
    it('should get user order history', async () => {
      const mockOrders = [
        {
          id: 'order-1',
          userId: 'user-id',
          totalPrice: 199.98,
          status: 'pending',
          createdAt: new Date(),
          orderItems: [],
        },
      ];

      (prisma.order.findMany as jest.Mock).mockResolvedValue(mockOrders);

      const response = await request(app)
        .get('/orders')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
    });

    it('should return empty array when no orders', async () => {
      (prisma.order.findMany as jest.Mock).mockResolvedValue([]);

      const response = await request(app)
        .get('/orders')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(0);
    });

    it('should fail without authentication', async () => {
      const response = await request(app).get('/orders');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
