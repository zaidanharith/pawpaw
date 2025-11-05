const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['error', 'warn']
    : ['error']
});

prisma.$connect()
  .then(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ MongoDB Connected');
    }
  })
  .catch((error) => {
    console.error('❌ MongoDB Connection Error:', error.message);
  });

module.exports = prisma;