export type Rol = 'admin' | 'client';

export interface IUser {
    email: string;
    password?: string;
    rol: Rol;
}
