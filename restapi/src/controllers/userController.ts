import User from '../models/user';
import { Request, Response } from 'express';


// Crear nuevo usuario en la base de datos
const createUser = async (req: Request, res: Response) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).send('Debe de introducir un nombre de usuario y una contraseña.');
    }

    const user = new User({
        username: req.body.username,
        birthday: req.body.birthday,
        password: req.body.password 
    });
    
    try {
        const savedUser = await user.save();
        res.send(savedUser);
    }
    catch (error) {
        console.error(error);
        res.status(400).send('En estos momentos no se puede crear el usuario, lamentamos las molestias.');
    }
};


export {
  createUser,
};
