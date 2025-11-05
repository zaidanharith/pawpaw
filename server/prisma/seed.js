const { PrismaClient } = require('../src/generated/prisma');
const bcrypt = require('bcrypt');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  const existingAdmin = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  });

  if (existingAdmin) {
    console.log('Admin user already exists');
    return;
  }

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminName = process.env.ADMIN_NAME;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminPhone = process.env.ADMIN_PHONE;

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.user.create({
    data: {
      username: adminUsername,
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: 'ADMIN',
      phoneNumber: adminPhone
    }
  });
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });