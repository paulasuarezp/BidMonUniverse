import express, { Application } from "express";
import cors from 'cors';
import bp from 'body-parser';
import userRouter from './src/routes/userRoutes';
import cardPackRouter from "./src/routes/cardPackRoutes";
import cardRouter from "./src/routes/cardRoutes";
import userCardRouter from "./src/routes/userCardRoutes";
import purchasesRouter from "./src/routes/purchasesRoutes";
import transactionRouter from "./src/routes/transactionRoutes";
import auctionRouter from "./src/routes/auctionRoutes";
import bidRouter from "./src/routes/bidRoutes";
import deckRouter from "./src/routes/deckRoutes";
import notificationRouter from "./src/routes/notificationRoutes";
import * as dotenv from 'dotenv';
import mongoose from 'mongoose'; 

import http from 'http';
import { Server, Socket } from "socket.io";
import authSocket from './src/middlewares/authSocket';

dotenv.config();

const app: Application = express();
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 5001;
const mongoURI: string =  process.env.NODE_ENV === 'test' ? process.env.TEST_MONGO_URI : process.env.MONGO_URI;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
      origin: "*", // Permitir cualquier origen
      methods: ["GET", "POST"]
  }
});

export { io };

// Middleware para autenticar sockets
io.use(authSocket);

// Manejo de conexiones de sockets
io.on('connection', (socket) => {
  const username = socket.handshake.query.username; // username enviado como parte del handshake

  if (username) {
      socket.join(username); // Unir el socket a una sala con el nombre de usuario
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

// Permitir peticiones de webapp y parsear el body a JSON
app.use(cors());


app.use(bp.json());

// Manejo de peticiones
app.use("/users", userRouter);
app.use("/cardpacks", cardPackRouter);
app.use("/decks", deckRouter);
app.use("/cards", cardRouter);
app.use("/usercards", userCardRouter);
app.use("/purchases", purchasesRouter);
app.use("/transactions", transactionRouter);
app.use("/auctions", auctionRouter);
app.use("/bids", bidRouter);
app.use("/notifications", notificationRouter);


// Arrancar servidor
server.listen(port, (): void => {
    console.log('Restapi listening on ' + port);
}).on("error",(error: Error) => {
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