// User define los datos que se comparten entre componentes y servicios
export interface User {
    username: string;
    password: string;
    birthday: string;
    profileImg: string;
    role: string;
}

// SessionUser es el tipo de dato que se almacena en el contexto de autenticación
export interface SessionUser {
    username: string;
    token: string;
}