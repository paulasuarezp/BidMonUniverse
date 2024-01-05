import express, { Request, Response, Router } from 'express';
const userRouter: Router = express.Router()

const { createUser } = require('../controllers/userController');


userRouter.post("/signup", async (req: Request, res: Response): Promise<Response> => {
    return createUser(req, res);
 });

 
export default userRouter;