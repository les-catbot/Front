export interface User{
    id: string;
    nome: string;
    userName: string;
    email: string;
}

export interface UserCreate{
    nome: string;
    userName: string;
    email: string;
}

export interface UserUpdate{
    id: string;
}

export type UsersArray = Array<User>