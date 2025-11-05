const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const routes = require('./routes'); 
const setupSwagger = require('./config/swagger');
const prisma = require('./config/prisma');

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:3000',
  `http://localhost:${PORT}`,
  'http://10.241.10.170:3000',
  `http://10.241.10.170:${PORT}`
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Tidak diizinkan oleh CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setupSwagger(app);

app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Selamat Datang di Aplikasi KidConnect!',
    version: '1.0.0',
    database: 'Prisma + MongoDB',
    endpoints: {
      health: '/health',
      docs: '/api/docs',
      api: '/api'
    }
  });
});

app.get('/health', async (req, res) => {
  try {
    await prisma.$connect();
    res.json({ 
      status: 'Baik',
      database: 'Terhubung',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'Error',
      database: 'Terputus',
      pesan: error.message
    });
  }
});

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({ 
    success: false,
    pesan: err.message || 'Kesalahan Server Internal',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    pesan: 'Rute tidak ditemukan'
  });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on: http://localhost:${PORT}`);
});

process.on('SIGTERM', async () => {
  console.log('🔴 SIGTERM received. Closing server...');
  server.close(async () => {
    console.log('🔌 Server closed');
    await prisma.$disconnect();
    console.log('🔌 Database disconnected');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('\n🔴 SIGINT received. Closing server...');
  server.close(async () => {
    console.log('🔌 Server closed');
    await prisma.$disconnect();
    console.log('🔌 Database disconnected');
    process.exit(0);
  });
});

module.exports = app;