import Swal from 'sweetalert2';
import '../../../main';
import { logoutUser, getCurrentUser } from '../../../utils/auth';
import { getCategories, getProducts, getOrders } from '../../../utils/storage';

document.addEventListener('DOMContentLoaded', () => {

    const user = getCurrentUser();
    if (user) {
        const adminName = document.getElementById('admin-name');
        if (adminName) adminName.textContent = (user.nombre && user.apellido) ? `${user.nombre} ${user.apellido}` : 'Administrador';
    }

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


    const categories = getCategories().filter(c => !c.eliminado);
    const products = getProducts().filter(p => !p.eliminado);
    const orders = getOrders();

    const availableProducts = products.filter(p => p.disponible).length;


    document.getElementById('total-categories')!.textContent = categories.length.toString();
    document.getElementById('total-products')!.textContent = products.length.toString();
    document.getElementById('total-orders')!.textContent = orders.length.toString();
    document.getElementById('total-available')!.textContent = availableProducts.toString();


    const pendingOrders = orders.filter(o => o.estado === 'PENDIENTE').length;
    const prepOrders = orders.filter(o => o.estado === 'EN_PREPARACION').length;
    const completedOrders = orders.filter(o => o.estado === 'ENTREGADO' || o.estado === 'TERMINADO').length;

    const totalRevenue = orders
        .filter(o => o.estado === 'ENTREGADO' || o.estado === 'TERMINADO')
        .reduce((sum, o) => sum + o.total, 0);

    document.getElementById('pending-orders')!.textContent = pendingOrders.toString();
    document.getElementById('prep-orders')!.textContent = prepOrders.toString();
    document.getElementById('completed-orders')!.textContent = completedOrders.toString();
    document.getElementById('total-revenue')!.textContent = `$${totalRevenue.toFixed(2)}`;
});
