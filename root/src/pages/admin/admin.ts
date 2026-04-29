import Swal from 'sweetalert2';
import '../../main';
import { logoutUser } from '../../utils/auth';

document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout-btn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const result = await Swal.fire({
                title: '¿Cerrar sesión?',
                text: "Saldrás del panel de administración.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, salir',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                logoutUser();
                window.location.href = '/src/pages/auth/login/index.html';
            }
        });
    }

    // Aquí iría el resto de la lógica de administración (agregar productos, editar, etc.)
});
