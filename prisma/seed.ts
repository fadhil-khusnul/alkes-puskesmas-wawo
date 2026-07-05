import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@wawo.com' },
    update: {},
    create: {
      email: 'admin@wawo.com',
      nama: 'Admin User',
      role: 'admin',
      password: 'password123',
    },
  });

  const staf = await prisma.user.upsert({
    where: { email: 'staf@wawo.com' },
    update: {},
    create: {
      email: 'staf@wawo.com',
      nama: 'Staf User',
      role: 'staf',
      password: 'password123',
    },
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
