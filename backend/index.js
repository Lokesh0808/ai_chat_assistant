////////////////////////////////////////////////////////////////////////////////////
// CRITICAL: Load environment variables IMMEDIATELY
////////////////////////////////////////////////////////////////////////////////////

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '.env');

// Load .env SYNCHRONOUSLY before anything else
const envConfig = dotenv.config({ path: envPath });

console.log('\n═══════════════════════════════════════');
console.log('🚀 Backend Initialization');
console.log('═══════════════════════════════════════');
console.log('Environment variables loaded from:', envPath);
console.log('Status:', envConfig.error ? '✗ ' + envConfig.error.message : '✓ Loaded');
console.log('\n📋 Configuration:');
console.log('  PORT:', process.env.PORT);
console.log('  NODE_ENV:', process.env.NODE_ENV);
console.log('  GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? `✓ Loaded (${process.env.GEMINI_API_KEY.length} chars)` : '✗ NOT SET');
console.log('  CORS_ORIGIN:', process.env.CORS_ORIGIN);
console.log('═══════════════════════════════════════\n');

////////////////////////////////////////////////////////////////////////////////////
// Initialize app asynchronously after environment is loaded
////////////////////////////////////////////////////////////////////////////////////

async function startServer() {
  // NOW import routes and other dependencies
  const { default: express } = await import('express');
  const { default: cors } = await import('cors');
  const { default: helmet } = await import('helmet');
  const { default: morgan } = await import('morgan');
  const { default: aiRoutes } = await import('./routes/aiRoutes.js');
  const { errorHandler } = await import('./middleware/errorHandler.js');
  const { rateLimiter } = await import('./middleware/rateLimiter.js');

  const app = express();
  const PORT = process.env.PORT || 5000;

  // Set trust proxy for rate limiting to work correctly
  app.set('trust proxy', 1);

  // Middleware
  app.use(helmet());
  app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
  }));
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(rateLimiter);

  // Routes
  app.use('/api', aiRoutes);

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  // Error handling
  app.use(errorHandler);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  app.listen(PORT, () => {
    console.log(`✓ Server running on port ${PORT}`);
    console.log(`✓ Environment: ${process.env.NODE_ENV}`);
  });
}

// Start the server
startServer().catch(err => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});
