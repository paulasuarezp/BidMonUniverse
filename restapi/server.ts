import * as dotenv from 'dotenv';
import fs from 'fs';
import http from 'http';
import https from 'https';
import mongoose from 'mongoose';
import { Server } from "socket.io";
import { app } from './app';
import authSocket from './src/middlewares/authSocket';

dotenv.config();

const httpPort: number = 5001;
const httpsPort: number = 5002;
const mongoURI: string = process.env.NODE_ENV === 'test' ? process.env.TEST_MONGO_URI : process.env.MONGO_URI;


// Opciones para HTTPS
let httpsOptions = {};
if (process.env.NODE_ENV === 'production') {
  httpsOptions = {
    key: process.env.SSL_PRIVKEY ? fs.readFileSync('./certs/privkey.pem') : null,
    cert: process.env.SSL_CERT ? fs.readFileSync('./certs/fullchain.pem') : null,
  };
}

const httpServer = http.createServer(app);
const httpsServer = https.createServer(httpsOptions, app);

const io = new Server(httpsServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  }
});

// Middleware para autenticar sockets
io.use(authSocket);

// Manejo de conexiones de sockets
io.on('connection', (socket) => {
  const username = socket.handshake.query.username;

  if (username) {
    socket.join(username);
    console.log(`User ${username} connected with socket id ${socket.id}`);
  }

  socket.on('disconnect', () => {
    console.log(`User ${username} disconnected`);
  });
});

// Conexión a la base de datos
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the application if there is a connection error
  });

// Arrancar servidores
httpServer.listen(httpPort, (): void => {
  console.log(`HTTP server listening on port ${httpPort}`);
}).on("error", (error: Error) => {
  console.error('Error occurred: ' + error.message);
});

httpsServer.listen(httpsPort, (): void => {
  console.log(`HTTPS server listening on port ${httpsPort}`);
}).on("error", (error: Error) => {
  console.error('Error occurred: ' + error.message);
});

// Cerrar servidores y conexión a la base de datos
const closeServer = async () => {
  httpServer.close(() => {
    console.log('HTTP server closed');
  });
  httpsServer.close(() => {
    console.log('HTTPS server closed');
  });
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
};

// Escuchar señales de terminación para cerrar la aplicación correctamente
process.on('SIGINT', closeServer);
process.on('SIGTERM', closeServer);
process.on('SIGUSR2', closeServer);  // Para nodemon restart

export { closeServer, io, httpsServer as server };
