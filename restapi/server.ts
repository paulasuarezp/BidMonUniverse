import express, { Application, RequestHandler } from "express";
import cors from 'cors';
import bp from 'body-parser';

const app: Application = express();
const port: number = 5000;


app.use(cors({
    origin: 'http://localhost:5173' // Vite
  }));
app.use(bp.json());


app.listen(port, ():void => {
    console.log('Restapi listening on '+ port);
}).on("error",(error:Error)=>{
    console.error('Error occured: ' + error.message);
});
