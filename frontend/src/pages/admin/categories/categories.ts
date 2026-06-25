import Swal from 'sweetalert2';
import '../../../main';
import { logoutUser, getCurrentUser } from '../../../utils/auth';
import { getCategories, saveCategory, deleteCategory } from '../../../utils/storage';
import { ICategory } from '../../../types';

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


    const tbody = document.getElementById('categories-table-body');
    const modal = document.getElementById('category-modal');
    const form = document.getElementById('category-form') as HTMLFormElement;
    const btnAdd = document.getElementById('btn-add-category');
    const btnClose = document.getElementById('close-category-modal');

    const renderTable = () => {
        if (!tbody) return;
        tbody.innerHTML = '';
        const categories = getCategories().filter(c => !c.eliminado);

        categories.forEach(cat => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${cat.id}</td>
                <td><strong>${cat.nombre}</strong></td>
                <td>${cat.descripcion || '-'}</td>
                <td class="action-links">
                    <a href="#" class="edit-cat" data-id="${cat.id}">Editar</a> |
                    <a href="#" class="delete-cat" data-id="${cat.id}" style="color: #d33;">Eliminar</a>
                </td>
            `;
            tbody.appendChild(tr);
        });


        document.querySelectorAll('.edit-cat').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const id = parseInt((e.target as HTMLElement).getAttribute('data-id') || '0');
                const cat = getCategories().find(c => c.id === id);
                if (cat) openModal(cat);
            });
        });

        document.querySelectorAll('.delete-cat').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                const id = parseInt((e.target as HTMLElement).getAttribute('data-id') || '0');
                
                const res = await Swal.fire({
                    title: '¿Eliminar categoría?',
                    text: 'Esta acción no se puede deshacer.',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Eliminar',
                    cancelButtonText: 'Cancelar',
                    confirmButtonColor: '#d33'
                });

                if (res.isConfirmed) {
                    deleteCategory(id);
                    renderTable();
                    Swal.fire('Eliminada', 'La categoría fue eliminada.', 'success');
                }
            });
        });
    };

    const openModal = (cat?: ICategory) => {
        document.getElementById('modal-title')!.textContent = cat ? 'Editar Categoría' : 'Nueva Categoría';
        const idInput = document.getElementById('category-id') as HTMLInputElement;
        const nameInput = document.getElementById('category-name') as HTMLInputElement;
        const descInput = document.getElementById('category-desc') as HTMLTextAreaElement;

        if (cat) {
            idInput.value = cat.id.toString();
            nameInput.value = cat.nombre;
            descInput.value = cat.descripcion;
        } else {
            idInput.value = '';
            nameInput.value = '';
            descInput.value = '';
        }

        if (modal) modal.style.display = 'block';
    };

    const closeModal = () => {
        if (modal) modal.style.display = 'none';
        form.reset();
    };

    btnAdd?.addEventListener('click', () => openModal());
    btnClose?.addEventListener('click', closeModal);

    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const idInput = document.getElementById('category-id') as HTMLInputElement;
        const nameInput = document.getElementById('category-name') as HTMLInputElement;
        const descInput = document.getElementById('category-desc') as HTMLTextAreaElement;

        const category: ICategory = {
            id: idInput.value ? parseInt(idInput.value) : 0,
            nombre: nameInput.value,
            descripcion: descInput.value,
            eliminado: false,
            createdAt: new Date().toISOString()
        };

        saveCategory(category);
        closeModal();
        renderTable();
        Swal.fire('Guardado', 'Categoría guardada con éxito', 'success');
    });


    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    renderTable();
});
