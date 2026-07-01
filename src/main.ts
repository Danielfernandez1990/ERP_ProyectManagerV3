import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { initDatabase, closeDatabase } from './config/database';
import { initRedis, closeRedis } from './config/redis';
import { config } from './config/env';
import { errorHandler, asyncHandler } from './middleware/errorHandler';
import { morganMiddleware, requestIdMiddleware } from './middleware/logging';
import logger from './utils/logger';

// Routes
import authRoutes from './routes/auth.routes';
import usuariosRoutes from './routes/usuarios.routes';
import clientesRoutes from './routes/clientes.routes';
import productosRoutes from './routes/productos.routes';
import proyectosRoutes from './routes/proyectos.routes';
import licenciasRoutes from './routes/licencias.routes';
import adminRoutes from './routes/admin.routes';
import paymentsRoutes from './routes/payments.routes';
import smtpRoutes from './routes/smtp.routes';

const app = express();
const httpServer = createServer(app);

// Configure CORS Options
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = config.cors.origin;
    
    // Allow requests without origin (mobile apps, curl requests, etc)
    if (!origin) {
      callback(null, true);
      return;
    }
    
    // Check if origin is in whitelist
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn('CORS request blocked:', { origin, allowedOrigins });
      callback(null, true); // Allow anyway for development
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200,
};

const io = new SocketIOServer(httpServer, {
  cors: corsOptions,
  transports: ['websocket', 'polling'],
});

/**
 * Middleware - ORDER MATTERS!
 */

// CORS FIRST
app.use(cors(corsOptions));

// Helmet after CORS
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginOpenerPolicy: false,
  crossOriginResourcePolicy: false,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(requestIdMiddleware);
app.use(morganMiddleware);

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

/**
 * Health check
 */
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '3.0.0',
  });
});

/**
 * API Routes
 */
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/proyectos', proyectosRoutes);
app.use('/api/licencias', licenciasRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/smtp', smtpRoutes);

/**
 * WebSocket events (Chat en tiempo real)
 */
io.on('connection', (socket) => {
  logger.info('Client connected:', { socketId: socket.id });

  socket.on('join_project', (projectId) => {
    socket.join(`proyecto:${projectId}`);
    logger.info('User joined project:', { projectId, socketId: socket.id });
  });

  socket.on('send_message', (data) => {
    io.to(`proyecto:${data.projectId}`).emit('new_message', data);
    logger.info('Message sent:', { projectId: data.projectId });
  });

  socket.on('task_update', (data) => {
    io.to(`proyecto:${data.projectId}`).emit('task_updated', data);
  });

  socket.on('disconnect', () => {
    logger.info('Client disconnected:', { socketId: socket.id });
  });
});

/**
 * 404 handler
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    code: 'NOT_FOUND',
    message: 'Endpoint not found',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Error handler
 */
app.use(errorHandler);

/**
 * Start server
 */
export const startServer = async () => {
  try {
    // Initialize database and redis
    await initDatabase();
    await initRedis();

    // Start listening
    httpServer.listen(config.port, '0.0.0.0', () => {
      logger.info(`🚀 Server running on http://localhost:${config.port}`);
      logger.info(`🌐 CORS origins allowed:`, config.cors.origin);
      logger.info(`🔌 WebSocket available at ws://localhost:${config.port}`);
      logger.info(`💳 Stripe payments enabled`);
      logger.info(`📚 API Documentation available at http://localhost:${config.port}/api/health`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

/**
 * Graceful shutdown
 */
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Closing connections...');
  await closeDatabase();
  await closeRedis();
  httpServer.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received. Closing connections...');
  await closeDatabase();
  await closeRedis();
  httpServer.close();
  process.exit(0);
});

// Start server if running directly
if (require.main === module) {
  startServer();
}

export default app;
