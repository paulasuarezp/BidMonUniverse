import * as dotenv from 'dotenv';
import http from 'http';
import mongoose from 'mongoose';
import { Server } from "socket.io";
import { app } from './app';
import authSocket from './src/middlewares/authSocket';

dotenv.config();

const port: number = 5001;
const mongoURI: string = process.env.NODE_ENV === 'test' ? process.env.TEST_MONGO_URI : process.env.MONGO_URI;

const server = http.createServer(app);

const io = new Server(server, {
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
  .catch((err) => console.error('MongoDB connection error:', err));

// Arrancar servidor
server.listen(port, (): void => {
  console.log('Restapi listening on ' + port);
}).on("error", (error: Error) => {
  console.error('Error occurred: ' + error.message);
});

// Cerrar servidor y conexión a la base de datos
const closeServer = async () => {
  server.close(() => {
    console.log('HTTP server closed');
  });
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
};

// Escuchar señales de terminación para cerrar la aplicación correctamente
process.on('SIGINT', closeServer);
process.on('SIGTERM', closeServer);
process.on('SIGUSR2', closeServer);  // Para nodemon restart

export { closeServer, io, server };
