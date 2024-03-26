import express, { Request, Response, Router } from 'express';
const userRouter: Router = express.Router()

const { createUser, loginUser } = require('../controllers/userController');


userRouter.post("/signup", async (req: Request, res: Response): Promise<Response> => {
    return createUser(req, res);
 });

userRouter.post("/login", async (req: Request, res: Response): Promise<Response> => {
    return loginUser(req, res);
});
 
export default userRouter;