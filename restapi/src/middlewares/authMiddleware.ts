const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Extraer el token del header
    if (!token) return res.status(401).send('Acceso denegado.');

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send('Token inválido. Acceso denegado.');
    }
};

module.exports = auth;
