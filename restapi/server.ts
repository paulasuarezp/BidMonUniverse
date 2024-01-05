import express, { Application } from "express";
import cors from 'cors';
import bp from 'body-parser';
import userRouter from './src/routes/userRoutes';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose'; 

dotenv.config();

const app: Application = express();
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 5000;
const mongoURI: string = process.env.MONGO_URI!;

// Conexión a la base de datos
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Permitir peticiones de webapp y parsear el body a JSON
app.use(cors({
    origin: 'http://localhost:5173' // Vite
}));
app.use(bp.json());

// Manejo de peticiones
app.use("/users", userRouter);

// Arrancar servidor
app.listen(port, (): void => {
    console.log('Restapi listening on ' + port);
}).on("error",(error: Error) => {
    console.error('Error occurred: ' + error.message);
});
