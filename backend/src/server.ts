import app from './app';
import { connectDB } from './config/db';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
    process.on('unhandledRejection', (err: Error) => {
      console.error(`Unhandled Rejection Error: ${err.message}`);
      server.close(() => process.exit(1));
    });

    // Graceful Shutdown
    const shutdown = () => {
      console.log('Shutting down server gracefully...');
      server.close(() => {
        console.log('Server process terminated.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error(`Failed to start server: ${(error as Error).message}`);
    process.exit(1);
  }
};

startServer();
