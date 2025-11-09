import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from '@/config/env';
import { errorHandler } from '@/middleware/errorHandler';
import routes from '@/routes';

const app = express();

// security and parsing middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// api routes
app.use('/api', routes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    errors: ['The requested endpoint does not exist'],
  });
});

// global error handler
app.use(errorHandler);

const PORT = parseInt(env.PORT, 10);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${env.NODE_ENV}`);
});

// graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});
