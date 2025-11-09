const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes'); 
const setupSwagger = require('./config/swagger');
const prisma = require('./config/prisma');

dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

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

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

setupSwagger(app);

app.use('/api', routes);

app.get('/health', async (req, res) => {
  try {
    await prisma.$connect();
    res.json({
      status: 'Baik',
      database: 'Terhubung',
      timestamp: new Date().toISOString(),
      helmet: 'Enabled'
    });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      database: 'Tidak terhubung',
      error: error.message
    });
  }
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rute tidak ditemukan'
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Terjadi kesalahan pada server',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api/docs`);
  console.log(`🔒 Helmet: Enabled`);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM signal diterima, menutup server...');
  await prisma.$disconnect();
  process.exit(0);
});