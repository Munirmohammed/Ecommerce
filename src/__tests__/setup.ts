// mock prisma client before any imports
jest.mock('@/config/database', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    product: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    order: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

// mock redis
jest.mock('@/config/redis', () => ({
  getRedisClient: jest.fn().mockResolvedValue(null),
  closeRedis: jest.fn(),
}));

// mock cloudinary
jest.mock('@/config/cloudinary', () => ({
  cloudinary: {
    config: jest.fn(),
    uploader: {
      upload_stream: jest.fn(),
      destroy: jest.fn(),
    },
  },
}));
