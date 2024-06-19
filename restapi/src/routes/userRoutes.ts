import express, { Request, Response, Router } from 'express';
import auth from '../middlewares/authMiddleware';
import { param, validationResult } from 'express-validator';

const userRouter: Router = express.Router()

const { createUser, loginUser, getUser } = require('../controllers/userController');


userRouter.post("/signup", async (req: Request, res: Response): Promise<Response> => {
    return createUser(req, res);
});

userRouter.post("/login", async (req: Request, res: Response): Promise<Response> => {
    return loginUser(req, res);
});

userRouter.get('/:username', auth, [
    param('username').notEmpty().withMessage('Username is required'),
    param('username').isString().withMessage('Username must be a string'),
    param('username').isLength({ max: 12 }).withMessage('Username must be at most 12 characters long'),
    (req: Request, res: Response, next: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], getUser);



export default userRouter;