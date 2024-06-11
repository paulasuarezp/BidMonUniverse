import bcrypt from 'bcryptjs'
import { app } from '../../app'
import jwt from 'jsonwebtoken'

const supertest = require('supertest')
require('dotenv').config()

const api = supertest(app)

const hashPassword = (password) => {
    const rounds = 10
    const salt = bcrypt.genSaltSync(rounds)
    const hash = bcrypt.hashSync(password, salt)
    return hash
}

const checkPassword = (password, hash) => {
    return bcrypt.compareSync(password, hash)
}

const getToken = (username, role) => {
    let token = jwt.sign(
        { username: username, role: role, time: Date.now() / 1000 },
        process.env.TOKEN_SECRET!
    );
    return token
}


export {
    api,
    hashPassword,
    checkPassword,
    getToken
}