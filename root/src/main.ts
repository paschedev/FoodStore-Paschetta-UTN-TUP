import Swal from 'sweetalert2';
import { getCurrentUser } from './utils/auth';

const initGuard = async () => {
    const user = getCurrentUser();
    const currentPath = window.location.pathname;

    const isAdminRoute = currentPath.includes('/admin/');
    const isClientRoute = currentPath.includes('/client/');
    const isAuthRoute = currentPath.includes('/auth/');

    if (isAdminRoute) {
        if (!user) {
            await Swal.fire({
                icon: 'warning',
                title: 'Acceso Denegado',
                text: 'Debes iniciar sesión para acceder al panel de administración.',
                confirmButtonColor: '#ff6b6b'
            });
            window.location.href = '/src/pages/auth/login/index.html';
        } else if (user.rol !== 'admin') {
            await Swal.fire({
                icon: 'error',
                title: 'Permisos Insuficientes',
                text: 'Tu cuenta de cliente no tiene los privilegios necesarios para entrar aquí.',
                confirmButtonColor: '#ff6b6b'
            });
            window.location.href = '/src/pages/client/index.html';
        }
    }

    if (isClientRoute) {
        if (!user) {
            await Swal.fire({
                icon: 'warning',
                title: 'Sesión Requerida',
                text: 'Por favor, inicia sesión para realizar pedidos.',
                confirmButtonColor: '#ff6b6b'
            });
            window.location.href = '/src/pages/auth/login/index.html';
        }
    }

    if (isAuthRoute && user) {
        if (user.rol === 'admin') {
            window.location.href = '/src/pages/admin/index.html';
        } else {
            window.location.href = '/src/pages/client/index.html';
        }
    }
};

initGuard();
