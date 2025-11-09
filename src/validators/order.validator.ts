import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.array(
    z.object({
      productId: z.uuid('Invalid product ID'),
      quantity: z.number().int().positive('Quantity must be at least 1'),
    })
  ).min(1, 'Order must contain at least one product'),
});
