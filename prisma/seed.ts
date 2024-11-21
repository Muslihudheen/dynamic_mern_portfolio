import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'admin',
    },
  });

  // Create categories
  const categories = ['Web Design', 'iPhone App Design', 'Video Projects', 'Side Projects'];
  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // Create initial location
  await prisma.location.upsert({
    where: { id: 1 },
    update: {},
    create: {
      city: 'Nashville, TN',
      officeHours: 'in office till 6',
    },
  });

  console.log('✅ Database seeded successfully');
}

seed()
  .catch((error) => {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });