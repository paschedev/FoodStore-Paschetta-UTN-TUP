export type Rol = 'admin' | 'client';

export interface IUser {
    email: string;
    nombre?: string;
    apellido?: string;
    password?: string;
    rol: Rol;
}
export * from './category';
export * from './product';
export * from './order';
