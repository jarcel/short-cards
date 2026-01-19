import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env from project root
const __dirname_local = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname_local, '../../.env') });
import { initializeDatabase, closeDatabase } from './db/index.js';
import cardsRouter from './routes/cards.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5001;

// Initialize database
initializeDatabase();

// Middleware
app.use(express.json());

// API routes
app.use(cardsRouter);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientDist));

  // Handle client-side routing
  app.get('*', (req, res, next) => {
    // Skip API routes and vCard downloads
    if (req.path.startsWith('/api/') || req.path.startsWith('/c/')) {
      return next();
    }
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    closeDatabase();
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    closeDatabase();
    process.exit(0);
  });
});
