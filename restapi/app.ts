import bp from 'body-parser';
import cors from 'cors';
import express, { Application } from "express";
import auctionRouter from "./src/routes/auctionRoutes";
import bidRouter from "./src/routes/bidRoutes";
import cardPackRouter from "./src/routes/cardPackRoutes";
import cardRouter from "./src/routes/cardRoutes";
import deckRouter from "./src/routes/deckRoutes";
import notificationRouter from "./src/routes/notificationRoutes";
import paypalRouter from "./src/routes/paypalRoutes";
import purchasesRouter from "./src/routes/purchasesRoutes";
import transactionRouter from "./src/routes/transactionRoutes";
import userCardRouter from "./src/routes/userCardRoutes";
import userRouter from './src/routes/userRoutes';

const app: Application = express();

// Permitir peticiones de webapp y parsear el body a JSON
app.use(cors({
    origin: "https://bidmonuniverse.eastus.cloudapp.azure.com",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true
}));
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
app.use("/paypal", paypalRouter);

export { app };
