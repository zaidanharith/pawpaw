const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes'); 
const setupSwagger = require('./config/swagger');
const prisma = require('./config/prisma');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

const allowedOrigins = [
  'https://kidconnect.vercel.app',
  'https://api-kidconnect.vercel.app',
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

// For Vercel serverless deployment
if (process.env.VERCEL) {
  module.exports = app;
} else {
  // For local development or non-serverless deployment
  const http = require('http');
  const { Server } = require('socket.io');
  const jwt = require('jsonwebtoken');

  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000
  });

  app.set('io', io);

  io.use((socket, next) => {
    const token = socket.handshake.auth && socket.handshake.auth.token;
    if (!token) {
      console.log('Socket connection rejected: No token');
      return next(new Error('Unauthorized'));
    }
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = payload;
      console.log('Socket authenticated for user:', payload.id);
      return next();
    } catch (err) {
      console.error('Socket auth error:', err.message || err);
      return next(new Error('Invalid token'));
    }
  });

  const userSockets = new Map();

  io.on('connection', (socket) => {
    const userId = socket.user?.id;
    console.log('✅ User connected:', socket.id, 'userId:', userId);

    if (!userId) {
      console.log('❌ No userId found, disconnecting socket');
      socket.disconnect();
      return;
    }

    socket.join(`user:${userId}`);
    console.log(`📍 Socket ${socket.id} joined room: user:${userId}`);

    if (!userSockets.has(userId)) {
      userSockets.set(userId, new Set());
    }
    userSockets.get(userId).add(socket.id);

    socket.on('join', (data) => {
      const { otherId, userId: clientUserId } = data;
      console.log(`🔗 Join event: userId=${clientUserId}, otherId=${otherId}`);
      
      if (otherId && clientUserId) {
        const roomId = [clientUserId, otherId].sort().join('-');
        socket.join(roomId);
        console.log(`📍 Socket ${socket.id} joined conversation room: ${roomId}`);
      }
    });

    socket.on('chat message', async (msg) => {
      console.log('📨 Chat message received:', msg);
      io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
      console.log('❌ User disconnected:', socket.id);
      
      if (userSockets.has(userId)) {
        userSockets.get(userId).delete(socket.id);
        if (userSockets.get(userId).size === 0) {
          userSockets.delete(userId);
        }
      }
    });

    socket.on('error', (err) => {
      console.error('Socket error:', err);
    });
  });

  server.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
    console.log(`📚 API Docs: http://localhost:${PORT}/api/docs`);
    console.log(`🔒 Helmet: Enabled`);
    console.log(`🔌 Socket.IO: Ready`);
  });

  process.on('SIGTERM', async () => {
    console.log('SIGTERM signal diterima, menutup server...');
    await prisma.$disconnect();
    process.exit(0);
  });
}