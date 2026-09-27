import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import complaintsRoutes from './routes/complaints.js';
import universitiesRoutes from './routes/universities.js';
import projectsRoutes from './routes/projects.js';
import industryRoutes from './routes/industry.js';
import analyticsRoutes from './routes/analytics.js';
import notificationsRoutes from './routes/notifications.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB().catch((err) => {
  console.error('[Database] Initial connection failure:', err.message);
});

// Middleware Stack
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Root endpoint - informational message pointing to frontend
app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: `Samadhan Setu Backend API is running on port ${PORT}`,
    frontendUrl: 'http://localhost:5173',
    healthCheck: '/api/health'
  });
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintsRoutes);
app.use('/api/grievances', complaintsRoutes);
app.use('/api/universities', universitiesRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/industry', industryRoutes);
app.use('/api/industry-partners', industryRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationsRoutes);

// Catch-all 404 handler for undefined routes
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('[Error Handler]', err);
  const statusCode = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`[Server] Server running on port ${PORT}`);
});

export default app;
