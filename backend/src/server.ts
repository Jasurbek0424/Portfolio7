import app from './app';
import { config } from './config';

const server = app.listen(config.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${config.PORT}`);
  console.log(`📚 API docs: http://localhost:${config.PORT}/api-docs`);
  console.log(`🏥 Health: http://localhost:${config.PORT}/health`);
});

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
