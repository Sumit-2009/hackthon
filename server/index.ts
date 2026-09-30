import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import routes from './routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing: 10MB body limit to accommodate high-resolution plant imagery
app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (!req.path.startsWith('/assets')) {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} ${res.statusCode} - ${duration}ms`);
    }
  });
  next();
});

// API Routes
app.use('/api', routes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'AgriSmart AI Precision Backend'
  });
});

// Serve built frontend assets if present
const distPath = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[SERVER ERROR]', err);
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      message: 'Payload too large. Plant foliage image exceeds maximum 10MB upload limit.'
    });
  }
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error occurred.',
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🌱 AgriSmart AI: Precision Agriculture Assistant`);
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log(`⚙️ Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`====================================================`);
});

export default app;
