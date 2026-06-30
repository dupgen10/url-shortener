import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { rateLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import shortenRoutes from './routes/shorten';
import redirectRoutes from './routes/redirect';

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Request logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Body parsing
app.use(express.json());

// Rate limiting
app.use(rateLimiter);

// API routes (must be mounted BEFORE the redirect catch-all)
app.use('/api/shorten', shortenRoutes);

// Redirect route (mounted AFTER /api routes to avoid conflicts)
app.use('/', redirectRoutes);

// Global error handler
app.use(errorHandler);

export default app;
