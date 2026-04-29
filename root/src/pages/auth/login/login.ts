import Swal from 'sweetalert2';
import { findUserByEmail, loginUser } from '../../../utils/auth';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form') as HTMLFormElement;

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const emailInput = document.getElementById('email') as HTMLInputElement;
        const passwordInput = document.getElementById('password') as HTMLInputElement;

        const email = emailInput.value;
        const password = passwordInput.value;

        if (!email || !password) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos Vacíos',
                text: 'Por favor, completa todos los campos para continuar.',
            });
            return;
        }

        const user = findUserByEmail(email);

        if (user && user.password === password) {
            loginUser(user);
            
            await Swal.fire({
                icon: 'success',
                title: `¡Bienvenido, ${user.rol === 'admin' ? 'Administrador' : 'Cliente'}!`,
                text: 'Has iniciado sesión correctamente.',
                timer: 1500,
                showConfirmButton: false
            });

            if (user.rol === 'admin') {
                window.location.href = '/src/pages/admin/index.html';
            } else {
                window.location.href = '/src/pages/store/home/home.html';
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error de Autenticación',
                text: 'Las credenciales ingresadas son incorrectas.',
            });
        }
    });
});
