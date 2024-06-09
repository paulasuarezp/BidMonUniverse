// User define los datos que se comparten entre componentes y servicios
export interface User {
    username: string;
    password: string;
    birthday: string;
    profileImg: string;
    role: AccessLevel;
    balance?: number;
}

// Estado del usuario
export interface UserState {
    username: string;
    role: AccessLevel;
    birthday: string;
    balance: number;
    profileImg: string;
    socketConnected: boolean;
}

// Enumeración de niveles de acceso
export enum AccessLevel {
    Guest = 'guest',
    Standard = 'standard',
    Admin = 'admin'
  }
