import bp from 'body-parser';
import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from "express";
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
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true
}));
app.use(bp.json());


// Manejo de peticiones
app.use("/api/users", userRouter);
app.use("/api/cardpacks", cardPackRouter);
app.use("/api/decks", deckRouter);
app.use("/api/cards", cardRouter);
app.use("/api/usercards", userCardRouter);
app.use("/api/purchases", purchasesRouter);
app.use("/api/transactions", transactionRouter);
app.use("/api/auctions", auctionRouter);
app.use("/api/bids", bidRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/paypal", paypalRouter);

// Middleware para manejar errores
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Error en el middleware de manejo de errores:', err.stack);
    res.status(500).send('Something broke!');
});

export { app };
