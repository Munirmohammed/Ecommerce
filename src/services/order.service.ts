import { prisma } from '@/config/database';
import { Prisma } from '@prisma/client';

interface OrderItem {
  productId: string;
  quantity: number;
}

export class OrderService {
  async createOrder(userId: string, items: OrderItem[]) {
    // used transaction to ensure atomicity
    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // fetch all products and validate stock in one query
      const productIds = items.map((item) => item.productId);
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
      });

      // check if all products exist
      if (products.length !== items.length) {
        const foundIds = products.map((p: { id: string }) => p.id);
        const missingIds = productIds.filter((id) => !foundIds.includes(id));
        throw new Error(`Products not found: ${missingIds.join(', ')}`);
      }

      // validate stock and calculate total price
      let totalPrice = 0;
      const orderItems: Array<{ productId: string; quantity: number; price: number }> = [];

      for (const item of items) {
        const product = products.find((p: { id: string }) => p.id === item.productId);
        if (!product) continue;

        // check if enough stock available
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product: ${product.name}`);
        }

        // calculate price from database, I will never trust client
        const itemPrice = product.price * item.quantity;
        totalPrice += itemPrice;

        orderItems.push({
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
        });

        // update stock
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // create order with items
      const order = await tx.order.create({
        data: {
          userId,
          totalPrice,
          status: 'pending',
          orderItems: {
            create: orderItems,
          },
        },
        include: {
          orderItems: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                },
              },
            },
          },
        },
      });

      return order;
    });
  }

  async getUserOrders(userId: string) {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders;
  }
}
