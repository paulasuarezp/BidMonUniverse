import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import * as yup from 'yup';
import User from '../models/user';
import { passwordConstraints, signupValidationSchema } from '../models/utils/validations';

/**
 * Función para crear un usuario
 * @param req Request, con los datos del usuario
 * @param res Response, con la respuesta de la petición
 * @returns {User} - 200 OK, Usuario creado con éxito
 * @throws {400} - 400 Bad Request, Debe de introducir un nombre de usuario y una contraseña
 * @throws {400} - 400 Bad Request, El nombre de usuario ya existe. Por favor, elija otro.
 * @throws {500} - 500 Internal Server Error, Se ha producido un error al crear el usuario. Por favor, inténtelo de nuevo.
 * 
 */
const createUser = async (req: Request, res: Response) => {
    const { username, password, birthday } = req.body;

    try {
        // Validar la entrada del usuario
        await signupValidationSchema.validate({ username, password, birthday });

        const usernameLower = username.toLowerCase();

        const userExists = await User.findOne({ username_lower: usernameLower });
        if (userExists) {
            return res.status(400).json({
                message: 'El nombre de usuario ya existe. Por favor, elija otro.',
                auth: false
            });
        }

        // Generar un salt y hacer hash de la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            username,
            username_lower: usernameLower,
            birthday,
            password: hashedPassword,
            role: 'standard',
            balance: 100,
            profileImg: ''
        });

        const savedUser = await user.save();

        res.status(201).json({
            message: 'Usuario creado con éxito.',
            user: {
                username: savedUser.username,
                role: savedUser.role,
            }
        });
    }
    catch (error: any) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: error.errors[0],
                auth: false
            });
        }

        if (error.code === 11000) { // Código de error de MongoDB para violaciones de la restricción de unicidad
            return res.status(400).json({
                message: 'El nombre de usuario ya existe. Por favor, elija otro.',
                auth: false
            });
        }

        return res.status(500).json({
            message: 'Se ha producido un error al crear el usuario. Por favor, inténtelo de nuevo.',
            auth: false
        });
    }
};


/**
 * Función para iniciar sesión
 * @param req Request, con los datos del usuario
 * @param res Response, con la respuesta de la petición
 * @returns {User} - 200 OK, Inicio de sesión exitoso
 * @throws {401} - 401 Unauthorized, Usuario o contraseña incorrectos.
 * @throws {500} - 500 Internal Server Error, Se ha producido un error al verificar credenciales. Por favor, inténtelo de nuevo.
 */
const loginUser = async (req: Request, res: Response) => {
    try {
        const username = req.body.username.toLowerCase();

        const user = await User.findOne({ username_lower: username });
        if (!user) {
            return res.status(401).json({
                message: 'Usuario o contraseña incorrectos.',
                auth: false
            });
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(401).json({
                message: 'Usuario o contraseña incorrectos.',
                auth: false
            });
        }

        const token = jwt.sign(
            { username: user.username, role: user.role, time: Date.now() / 1000 },
            process.env.TOKEN_SECRET!
        );

        res.header('Authorization', 'Bearer ' + token);
        return res.status(200).json({
            message: 'Inicio de sesión exitoso.',
            auth: true,
            user: {
                username: user.username,
                role: user.role,
                balance: user.balance,
                birthday: user.birthday,
                profileImg: user.profileImg
            },
            token: token
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Se ha producido un error al verificar credenciales. Por favor, inténtelo de nuevo.',
            message2: error,

            auth: false
        });
    }
};


/**
 * Función para obtener un usuario
 * @param req Request, con el nombre de usuario
 * @param res Response, con la respuesta de la petición
 * @returns {User} - 200 OK, Usuario encontrado
 * @throws {404} - 404 Not Found, Usuario no encontrado.
 * @throws {500} - 500 Internal Server Error, Se ha producido un error al buscar el usuario. Por favor, inténtelo de nuevo.
 */
async function getUser(req: Request, res: Response) {
    try {
        const username = req.params.username.toLowerCase();
        const user = await User.findOne({ username_lower: username });
        if (!user) {
            return res.status(404).json({
                message: 'Usuario no encontrado.'
            });
        }

        return res.status(200).json({
            user: {
                username: user.username,
                role: user.role,
                balance: user.balance,
                birthday: user.birthday,
                profileImg: user.profileImg
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Se ha producido un error al buscar el usuario. Por favor, inténtelo de nuevo.'
        });
    }
};


/**
 * Función para editar la imagen de perfil 
 * @param req Request, con los datos del usuario a editar
 * @param res Response, con la respuesta de la petición
 * @returns {User} - 200 OK, Usuario editado con éxito
 * @throws {400} - 400 Bad Request, Debe proporcionar al menos un campo para editar
 * @throws {404} - 404 Not Found, Usuario no encontrado
 * @throws {500} - 500 Internal Server Error, Se ha producido un error al editar el usuario. Por favor, inténtelo de nuevo.
 */
const updateUserAvatar = async (req: Request, res: Response) => {
    try {
        const { username, profileImg } = req.body;

        console.log(req.body);
        if (!profileImg) {
            return res.status(400).json({
                message: 'Debe proporcionar al menos un campo para editar.'
            });
        }

        const userBD = await User.findOne({ username_lower: username.toLowerCase() });

        if (!userBD) {
            return res.status(404).json({
                message: 'Usuario no encontrado.'
            });
        }

        if (profileImg) {
            userBD.profileImg = profileImg;
        }

        const updatedUser = await userBD.save();
        return res.status(200).json({
            message: 'Usuario editado con éxito.',
            user: {
                username: updatedUser.username,
                role: updatedUser.role,
                balance: updatedUser.balance,
                birthday: updatedUser.birthday,
                profileImg: updatedUser.profileImg
            }
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: error.errors[0]
            });
        }
        return res.status(500).json({
            message: 'Se ha producido un error al editar el usuario. Por favor, inténtelo de nuevo.'
        });
    }
};



/**
 * Función para editar la contraseña de un usuario
 * @param req Request, con los datos del usuario a editar
 * @param res Response, con la respuesta de la petición
 * @returns {User} - 200 OK, Usuario editado con éxito
 * @throws {400} - 400 Bad Request, Debe proporcionar al menos un campo para editar
 * @throws {404} - 404 Not Found, Usuario no encontrado
 * @throws {500} - 500 Internal Server Error, Se ha producido un error al editar el usuario. Por favor, inténtelo de nuevo.
 */
const updateUserPassword = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        if (!password) {
            return res.status(400).json({
                message: 'Debe proporcionar al menos un campo para editar.'
            });
        }

        // Validar la entrada del usuario
        const validationSchema = yup.object().shape({
            password: password ? passwordConstraints : yup.string().notRequired(),
        });

        await validationSchema.validate({ password });

        const userBD = await User.findOne({ username_lower: username.toLowerCase() });

        if (!userBD) {
            return res.status(404).json({
                message: 'Usuario no encontrado.'
            });
        }

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            userBD.password = hashedPassword;
        }

        const updatedUser = await userBD.save();
        return res.status(200).json({
            message: 'Usuario editado con éxito.',
            user: {
                username: updatedUser.username,
                role: updatedUser.role,
                balance: updatedUser.balance,
                birthday: updatedUser.birthday,
                profileImg: updatedUser.profileImg
            }
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: error.errors[0]
            });
        }
        return res.status(500).json({
            message: 'Se ha producido un error al editar el usuario. Por favor, inténtelo de nuevo.'
        });
    }
};

export {
    createUser, getUser, loginUser, updateUserAvatar, updateUserPassword
};

