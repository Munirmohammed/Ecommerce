import { z } from 'zod';

// password must be strong - at least 8 chars, uppercase, lowercase, number, special char
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character');

export const registerSchema = z.object({
  body: z.object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .regex(/^[a-zA-Z0-9]+$/, 'Username must be alphanumeric only'),
    email: z.email({ message: 'Invalid email format' }),
    password: passwordSchema,
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email({ message: 'Invalid email format' }),
    password: z.string().min(1, 'Password is required'),
  }),
});
