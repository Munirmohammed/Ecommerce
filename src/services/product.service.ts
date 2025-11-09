import { prisma } from '@/config/database';
import { getRedisClient } from '@/config/redis';

interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
}

interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: string;
  imageUrl?: string;
}

interface GetProductsQuery {
  page: number;
  limit: number;
  search?: string;
}

export class ProductService {
  private readonly CACHE_TTL = 300; // 5 minutes
  private readonly CACHE_KEY_PREFIX = 'products:';

  async createProduct(data: CreateProductInput) {
    const product = await prisma.product.create({
      data,
    });

    // invalidate cache when new product is created
    await this.invalidateCache();

    return product;
  }

  async updateProduct(id: string, data: UpdateProductInput) {
    // check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new Error('Product not found');
    }

    const product = await prisma.product.update({
      where: { id },
      data,
    });

    // invalidate cache after update
    await this.invalidateCache();

    return product;
  }

  async getProducts(query: GetProductsQuery) {
    const { page, limit, search } = query;
    const skip = (page - 1) * limit;

    // try to get from cache first
    const cacheKey = `${this.CACHE_KEY_PREFIX}list:${page}:${limit}:${search || 'all'}`;
    const cached = await this.getFromCache(cacheKey);

    if (cached) {
      return cached;
    }

    // build where clause for search
    const where = search
      ? {
          name: {
            contains: search,
            mode: 'insensitive' as const,
          },
        }
      : {};

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    const result = {
      products,
      total,
      page,
      limit,
    };

    // cache the result
    await this.setCache(cacheKey, result);

    return result;
  }

  async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  async deleteProduct(id: string) {
    // check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new Error('Product not found');
    }

    await prisma.product.delete({
      where: { id },
    });

    // invalidate cache after deletion
    await this.invalidateCache();

    return { message: 'Product deleted successfully' };
  }

  private async getFromCache(key: string) {
    try {
      const redis = await getRedisClient();
      if (!redis) return null;

      const cached = await redis.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  private async setCache(key: string, data: unknown) {
    try {
      const redis = await getRedisClient();
      if (!redis) return;

      await redis.setEx(key, this.CACHE_TTL, JSON.stringify(data));
    } catch (error) {
      console.error('Redis set error:', error);
    }
  }

  private async invalidateCache() {
    try {
      const redis = await getRedisClient();
      if (!redis) return;

      // delete all product list cache keys
      const keys = await redis.keys(`${this.CACHE_KEY_PREFIX}*`);
      if (keys.length > 0) {
        await redis.del(keys);
      }
    } catch (error) {
      console.error('Redis invalidate error:', error);
    }
  }
}
