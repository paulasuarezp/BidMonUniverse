export interface User {
    username: string;
    password: string;
    birthday: string;
    profileImg: string;
    role: string;
}

export interface SessionUser {
    username: string;
    token: string;
}