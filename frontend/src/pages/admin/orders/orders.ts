import Swal from 'sweetalert2';
import '../../../main';
import { logoutUser, getCurrentUser } from '../../../utils/auth';
import { getOrders, updateOrderStatus } from '../../../utils/storage';
import { Order, OrderStatus } from '../../../types';

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


    const tbody = document.getElementById('orders-table-body');
    const modal = document.getElementById('order-modal');
    const form = document.getElementById('order-form') as HTMLFormElement;
    const btnClose = document.getElementById('close-order-modal');

    const renderTable = () => {
        if (!tbody) return;
        tbody.innerHTML = '';
        

        const orders = getOrders().sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

        orders.forEach(order => {
            const tr = document.createElement('tr');
            
            let badgeClass = 'badge';
            let badgeText: string = order.estado;
            
            switch(order.estado) {
                case 'PENDIENTE': badgeClass += ' pendiente'; badgeText = 'Pendiente'; break;
                case 'EN_PREPARACION': badgeClass += ' preparacion'; badgeText = 'En Preparación'; break;
                case 'CONFIRMADO': badgeClass += ' preparacion'; badgeText = 'Confirmado'; break;
                case 'ENTREGADO': 
                case 'TERMINADO': badgeClass += ' entregado'; badgeText = order.estado === 'ENTREGADO' ? 'Entregado' : 'Terminado'; break;
                case 'CANCELADO': badgeClass += ' cancelado'; badgeText = 'Cancelado'; break;
                default: badgeClass += ' pendiente';
            }

            const itemsCount = order.detalles ? order.detalles.reduce((sum, d) => sum + d.cantidad, 0) : 0;
            const clientName = order.usuarioDto ? `${order.usuarioDto.nombre} ${order.usuarioDto.apellido}` : 'Cliente';

            tr.innerHTML = `
                <td><strong>#${order.id}</strong></td>
                <td>${clientName}</td>
                <td>${order.fecha}</td>
                <td>${itemsCount} prod(s)</td>
                <td><strong>$${order.total.toFixed(2)}</strong></td>
                <td><span class="${badgeClass}">${badgeText}</span></td>
                <td class="action-links">
                    <a href="#" class="edit-order" data-id="${order.id}">Cambiar Estado</a>
                </td>
            `;
            tbody.appendChild(tr);
        });


        document.querySelectorAll('.edit-order').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const id = parseInt((e.target as HTMLElement).getAttribute('data-id') || '0');
                const order = getOrders().find(o => o.id === id);
                if (order) openModal(order);
            });
        });
    };

    const openModal = (order: Order) => {
        const idInput = document.getElementById('order-id') as HTMLInputElement;
        const statusInput = document.getElementById('order-status') as HTMLSelectElement;

        idInput.value = order.id.toString();
        statusInput.value = order.estado;

        if (modal) modal.style.display = 'block';
    };

    const closeModal = () => {
        if (modal) modal.style.display = 'none';
        form.reset();
    };

    btnClose?.addEventListener('click', closeModal);

    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const idInput = document.getElementById('order-id') as HTMLInputElement;
        const statusInput = document.getElementById('order-status') as HTMLSelectElement;

        updateOrderStatus(parseInt(idInput.value), statusInput.value as OrderStatus);
        
        closeModal();
        renderTable();
        Swal.fire('Actualizado', 'Estado del pedido actualizado con éxito', 'success');
    });


    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    renderTable();
});
