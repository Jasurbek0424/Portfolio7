import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './config';
import { errorHandler } from './middlewares/errorHandler';
import { apiRoutes } from './routes';

const app = express();

// Security
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: config.isDev ? true : process.env.CORS_ORIGIN?.split(',') || [],
    credentials: true,
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: config.isDev ? 500 : 200,
    message: { success: false, error: 'Too many requests' },
  })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(
  morgan(config.isDev ? 'dev' : 'combined', {
    skip: (req) => req.path === '/health',
  })
);

// Swagger
const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Portfolio API',
      version: '1.0.0',
      description: 'REST API for portfolio website - blogs, projects, resume',
    },
    servers: [
      { url: `http://localhost:${config.PORT}`, description: 'Development' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/modules/**/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api', apiRoutes);

// 404
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Not found' });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;
