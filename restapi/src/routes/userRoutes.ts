import express, { Request, Response, Router } from 'express';
import  auth  from '../middlewares/authMiddleware';

const userRouter: Router = express.Router()

const { createUser, loginUser, getUser } = require('../controllers/userController');


userRouter.post("/signup", async (req: Request, res: Response): Promise<Response> => {
    return createUser(req, res);
 });

userRouter.post("/login", async (req: Request, res: Response): Promise<Response> => {
    return loginUser(req, res);
});

userRouter.get("/:username", auth, getUser);


export default userRouter;