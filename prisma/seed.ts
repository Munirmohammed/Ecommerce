import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // create admin user
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ecommerce.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@ecommerce.com',
      password: adminPassword,
      role: 'admin',
    },
  });
  console.log('Admin user created:', admin.email);

  // create regular user
  const userPassword = await bcrypt.hash('User@123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@ecommerce.com' },
    update: {},
    create: {
      username: 'testuser',
      email: 'user@ecommerce.com',
      password: userPassword,
      role: 'user',
    },
  });
  console.log('Regular user created:', user.email);

  // create sample products
  const products = [
    {
      name: 'Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      price: 99.99,
      stock: 50,
      category: 'Electronics',
    },
    {
      name: 'Smart Watch',
      description: 'Fitness tracker with heart rate monitor and GPS',
      price: 199.99,
      stock: 30,
      category: 'Electronics',
    },
    {
      name: 'Running Shoes',
      description: 'Comfortable running shoes with excellent cushioning',
      price: 79.99,
      stock: 100,
      category: 'Sports',
    },
    {
      name: 'Coffee Maker',
      description: 'Programmable coffee maker with thermal carafe',
      price: 49.99,
      stock: 25,
      category: 'Home',
    },
    {
      name: 'Yoga Mat',
      description: 'Non-slip yoga mat with carrying strap',
      price: 29.99,
      stock: 75,
      category: 'Sports',
    },
  ];

  for (const product of products) {
    const existing = await prisma.product.findFirst({
      where: { name: product.name },
    });

    if (!existing) {
      await prisma.product.create({
        data: product,
      });
    }
  }
  console.log(`Created ${products.length} sample products`);

  console.log('Database seeding completed!');
  console.log('\nTest Credentials:');
  console.log('Admin - Email: admin@ecommerce.com, Password: Admin@123');
  console.log('User  - Email: user@ecommerce.com, Password: User@123');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
