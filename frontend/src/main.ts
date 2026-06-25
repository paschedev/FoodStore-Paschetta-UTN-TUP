import Swal from 'sweetalert2';
import { getCurrentUser } from './utils/auth';
import { initData } from './utils/storage';

const initGuard = async () => {
    await initData();
    const user = getCurrentUser();
    const currentPath = window.location.pathname;

    const isAdminRoute = currentPath.includes('/admin/');
    const isClientRoute = currentPath.includes('/client/');
    const isAuthRoute = currentPath.includes('/auth/');

    if (isAdminRoute) {
        if (!user || user.rol.toLowerCase() !== 'admin') {
            const style = document.createElement('style');
            style.innerHTML = 'body > * { filter: blur(5px); pointer-events: none; } body > .swal2-container { filter: none !important; pointer-events: auto !important; }';
            document.head.appendChild(style);

            if (!user) {
            await Swal.fire({
                icon: 'warning',
                title: 'Acceso Denegado',
                text: 'Debes iniciar sesión para acceder al panel de administración.',
                confirmButtonColor: '#ff6b6b'
            });
            window.location.href = '/src/pages/auth/login/index.html';
        } else if (user.rol.toLowerCase() !== 'admin') {
            await Swal.fire({
                icon: 'error',
                title: 'Permisos Insuficientes',
                text: 'Tu cuenta de cliente no tiene los privilegios necesarios para entrar aquí.',
                confirmButtonColor: '#ff6b6b'
            });
            window.location.href = '/src/pages/store/home/home.html';
        }
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
        if (user.rol.toLowerCase() === 'admin') {
            window.location.href = '/src/pages/admin/adminHome/index.html';
        } else {
            window.location.href = '/src/pages/client/index.html';
        }
    }
};

initGuard();
