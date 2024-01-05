import express, { Application, RequestHandler } from "express";
import cors from 'cors';
import bp from 'body-parser';

const app: Application = express();
const port: number = 5000;


const mongoose = require('mongoose');

mongoose.connect('mongodb://mongo:27017/dbtfg', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err: any) => console.error('MongoDB connection error:', err));


app.use(cors({
    origin: 'http://localhost:5173' // Vite
  }));
app.use(bp.json());


app.listen(port, ():void => {
    console.log('Restapi listening on '+ port);
}).on("error",(error:Error)=>{
    console.error('Error occured: ' + error.message);
});


