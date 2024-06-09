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
import * as dotenv from 'dotenv';
import mongoose from 'mongoose'; 

dotenv.config();

const app: Application = express();
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 5001;
const mongoURI: string = process.env.MONGO_URI!;

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


// Arrancar servidor
const server = app.listen(port, (): void => {
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