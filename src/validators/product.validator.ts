import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Name must be at least 3 characters').max(100),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    price: z.number().positive('Price must be greater than 0'),
    stock: z.number().int().nonnegative('Stock must be 0 or greater'),
    category: z.string().min(1, 'Category is required'),
    imageUrl: z.url().optional(),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.uuid('Invalid product ID'),
  }),
  body: z.object({
    name: z.string().min(3).max(100).optional(),
    description: z.string().min(10).optional(),
    price: z.number().positive().optional(),
    stock: z.number().int().nonnegative().optional(),
    category: z.string().min(1).optional(),
    imageUrl: z.url().optional(),
  }),
});

export const getProductSchema = z.object({
  params: z.object({
    id: z.uuid('Invalid product ID'),
  }),
});

export const deleteProductSchema = z.object({
  params: z.object({
    id: z.uuid('Invalid product ID'),
  }),
});

export const getProductsSchema = z.object({
  query: z.object({
    page: z.string().optional().default('1'),
    limit: z.string().optional().default('10'),
    search: z.string().optional(),
  }),
});
