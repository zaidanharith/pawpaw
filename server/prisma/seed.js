const { PrismaClient } = require('../src/generated/prisma');
require('dotenv').config();

const prisma = new PrismaClient();

const adminTeam = [
  {
    username: 'agathahusnaamalia',
    name: 'Agatha Husna Amalia',
    email: 'agathahusnaamalia2004@mail.ugm.ac.id'
  },
  {
    username: 'amirasyafikapohan',
    name: 'Amira Syafika Pohan',
    email: 'amirasyafikapohan@mail.ugm.ac.id'
  },
  {
    username: 'joecelynauroramajesty',
    name: 'Joecelyn Aurora Majesty',
    email: 'joecelynauroramajesty@mail.ugm.ac.id'
  },
  {
    username: 'zaidanharith',
    name: 'Zaidan Harith',
    email: 'zaidanharith@mail.ugm.ac.id'
  },
  {
    username: 'zakifadhilarahman',
    name: 'Zaki Fadhila Rahman',
    email: 'zakifadhilarahman@mail.ugm.ac.id'
  }
];

async function main() {
  for (const admin of adminTeam) {
    try {
      const existing = await prisma.user.findUnique({
        where: { email: admin.email }
      });

      if (!existing) {
        await prisma.user.create({
          data: {
            username: admin.username,
            name: admin.name,
            email: admin.email,
            role: 'ADMIN',
            provider: 'GOOGLE',
            emailVerified: new Date(),
            isActive: true,
            isLogin: false
          }
        });
      } else {
        console.log(`   ⏭️  ${admin.name} (already exists)`);
      }
    } catch (error) {
      console.error(`   ❌ Error creating ${admin.name}:`, error.message);
    }
  }
}

main()
  .catch((e) => {
    console.error('\n❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });