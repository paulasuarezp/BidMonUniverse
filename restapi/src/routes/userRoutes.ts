import express, { Request, Response, Router } from 'express';
import { check, param, validationResult } from 'express-validator';
import auth from '../middlewares/authMiddleware';

const userRouter: Router = express.Router()

import {
    createUser,
    getUser,
    loginUser,
    updateUserAvatar,
    updateUserPassword
} from '../controllers/userController';

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

userRouter.patch('/update/avatar', auth, [
    check('username').notEmpty().withMessage('El nombre de usuario es obligatorio.'),
    check('username').isString().withMessage('El nombre de usuario debe ser una cadena de texto.'),
    check('username').isLength({ max: 12 }).withMessage('El nombre de usuario debe tener como máximo 12 caracteres.'),
    check('profileImg').isString().withMessage('La imagen de perfil debe ser una cadena de texto.'),
    (req: Request, res: Response, next: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], updateUserAvatar);

userRouter.patch('/update/pass', auth, [
    check('username').notEmpty().withMessage('El nombre de usuario es obligatorio.'),
    check('username').isString().withMessage('El nombre de usuario debe ser una cadena de texto.'),
    check('username').isLength({ max: 12 }).withMessage('El nombre de usuario debe tener como máximo 12 caracteres.'),
    check('password').isString().withMessage('La contraseña debe ser una cadena de texto.'),
    (req: Request, res: Response, next: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], updateUserPassword);



export default userRouter;