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

const app: Application = express();

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

export { app };
