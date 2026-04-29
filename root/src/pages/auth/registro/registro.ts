import Swal from 'sweetalert2';
import type { IUser } from '../../../types';
import { findUserByEmail, saveUser } from '../../../utils/auth';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registro-form') as HTMLFormElement;

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const emailInput = document.getElementById('email') as HTMLInputElement;
        const passwordInput = document.getElementById('password') as HTMLInputElement;

        const email = emailInput.value;
        const password = passwordInput.value;

        if (!email || !password) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos Incompletos',
                text: 'Por favor, completa todos los campos.',
            });
            return;
        }

        if (findUserByEmail(email)) {
            Swal.fire({
                icon: 'error',
                title: 'Email en uso',
                text: 'Ese correo ya se encuentra registrado en nuestro sistema.',
            });
            return;
        }

        const newUser: IUser = {
            email,
            password,
            rol: 'client'
        };

        saveUser(newUser);

        await Swal.fire({
            icon: 'success',
            title: '¡Cuenta Creada!',
            text: 'Tu registro ha sido exitoso. Ahora puedes iniciar sesión.',
            confirmButtonText: 'Ir al Login'
        });
        
        window.location.href = '/src/pages/auth/login/index.html';
    });
});
