import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app';

process.on("uncaughtException", (err) => {
    console.log(err.name, err.message);
    console.log("Uncaught Exception 💥 Shutting down...");
    process.exit(1);
});


const DB_URL = process.env.DATABASE_URL;
const DB_PASSWORD = process.env.DATABASE_PASSWORD;

if (!DB_URL || !DB_PASSWORD) {
  throw new Error('Database URL or password is missing in environment variables');
}

const DB = DB_URL.replace('<db_password>', DB_PASSWORD);

mongoose
  .connect(DB) // Cast options to ConnectOptions for TypeScript
  .then((connection) => {
    console.log('Database connection successful');
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });

const port = process.env.PORT || 3000;


const server = app.listen(port, () => {
    console.log("listening");
  });

process.on("unhandledRejection", (err: {name: string, message: string}) => {
    console.log(err.name, err.message);
    console.log("Unhandled Promise Rejection 💥 Shutting down...");
    server.close(() => {
      process.exit(1);
    });
  });
  