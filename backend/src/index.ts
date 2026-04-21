import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
// import { supabase } from './config/supabase.js';

import listingRoutes from './routes/listingRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';
import impactRoutes from './routes/impactRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/listings', listingRoutes);
app.use('/categories', categoryRoutes);
app.use('/recipes', recipeRoutes);
app.use('/impact', impactRoutes);
app.use('/ai', aiRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to ScrapSwap API',
    endpoints: {
      listings: '/api/listings',
      categories: '/api/categories',
      recipes: '/api/recipes',
      impact: '/api/impact'
    }
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use(errorHandler);

// Only listen if not running as a vercel serverless function
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default app;
