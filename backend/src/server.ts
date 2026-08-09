import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { logger } from './utils/logger';
import apiRoutes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();
const server = http.createServer(app);

// Socket.IO server initialization
const io = new SocketIOServer(server, {
  cors: {
    origin: env.CLIENT_URL,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  },
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Socket connection handling
io.on('connection', (socket) => {
  logger.info(`Client connected to WebSocket: ${socket.id}`);

  socket.on('join-room', (roomId: string) => {
    socket.join(roomId);
    logger.info(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Attach socket server instance to req
app.use((req: any, res, next) => {
  req.io = io;
  next();
});

// Mount Routes
app.use('/api', apiRoutes);

// Catch 404 & Global Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = env.PORT;
if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    logger.info(`🚀 HostelHub Server running in ${env.NODE_ENV} mode on port ${PORT}`);
    logger.info(`Health check available at http://localhost:${PORT}/api/health`);
  });
}

export { app, server, io };
