import type { IUser } from '../types';

export const getUsers = (): IUser[] => {
    const usersStr = localStorage.getItem('users');
    return usersStr ? JSON.parse(usersStr) : [];
};

export const saveUser = (user: IUser): void => {
    const users = getUsers();
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
};

export const findUserByEmail = (email: string): IUser | undefined => {
    const users = getUsers();
    return users.find(u => u.email === email);
};

export const loginUser = (user: IUser): void => {
    // Save userData without password
    const { password, ...userData } = user;
    localStorage.setItem('userData', JSON.stringify(userData));
};

export const logoutUser = (): void => {
    localStorage.removeItem('userData');
};

export const getCurrentUser = (): IUser | null => {
    const userDataStr = localStorage.getItem('userData');
    return userDataStr ? JSON.parse(userDataStr) : null;
};

export const isAuthenticated = (): boolean => {
    return getCurrentUser() !== null;
};

export const isAdmin = (): boolean => {
    const user = getCurrentUser();
    return user?.rol === 'admin';
};
