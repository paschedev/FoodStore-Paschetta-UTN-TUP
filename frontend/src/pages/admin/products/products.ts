import Swal from 'sweetalert2';
import '../../../main';
import { logoutUser, getCurrentUser } from '../../../utils/auth';
import { getProducts, getCategories, saveProduct, deleteProduct } from '../../../utils/storage';
import { Product } from '../../../types';

document.addEventListener('DOMContentLoaded', () => {
    // Topbar Setup
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

    // Products Logic
    const tbody = document.getElementById('products-table-body');
    const modal = document.getElementById('product-modal');
    const form = document.getElementById('product-form') as HTMLFormElement;
    const btnAdd = document.getElementById('btn-add-product');
    const btnClose = document.getElementById('close-product-modal');
    const selectCategory = document.getElementById('product-category') as HTMLSelectElement;

    const renderTable = () => {
        if (!tbody) return;
        tbody.innerHTML = '';
        const products = getProducts().filter(p => !p.eliminado);

        products.forEach(prod => {
            const tr = document.createElement('tr');
            
            // Category can be an object or just name depending on structure
            const catName = prod.categorias && prod.categorias.length > 0 
                ? prod.categorias[0].nombre 
                : (prod as any).categoria?.nombre || '-';
            
            const badgeClass = prod.disponible ? 'badge disponible' : 'badge nodisponible';
            const badgeText = prod.disponible ? 'Disponible' : 'No Disponible';

            tr.innerHTML = `
                <td>${prod.id}</td>
                <td><img src="${prod.imagen}" alt="${prod.nombre}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;"></td>
                <td><strong>${prod.nombre}</strong></td>
                <td>$${prod.precio.toFixed(2)}</td>
                <td>${catName}</td>
                <td>${prod.stock}</td>
                <td><span class="${badgeClass}">${badgeText}</span></td>
                <td class="action-links">
                    <a href="#" class="edit-prod" data-id="${prod.id}">Editar</a> |
                    <a href="#" class="delete-prod" data-id="${prod.id}" style="color: #d33;">Eliminar</a>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Attach events
        document.querySelectorAll('.edit-prod').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const id = parseInt((e.target as HTMLElement).getAttribute('data-id') || '0');
                const prod = getProducts().find(p => p.id === id);
                if (prod) openModal(prod);
            });
        });

        document.querySelectorAll('.delete-prod').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                const id = parseInt((e.target as HTMLElement).getAttribute('data-id') || '0');
                
                const res = await Swal.fire({
                    title: '¿Eliminar producto?',
                    text: 'Esta acción no se puede deshacer.',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Eliminar',
                    cancelButtonText: 'Cancelar',
                    confirmButtonColor: '#d33'
                });

                if (res.isConfirmed) {
                    deleteProduct(id);
                    renderTable();
                    Swal.fire('Eliminado', 'El producto fue eliminado.', 'success');
                }
            });
        });
    };

    const populateCategories = () => {
        const categories = getCategories().filter(c => !c.eliminado);
        selectCategory.innerHTML = '<option value="">Seleccione una categoría</option>';
        categories.forEach(c => {
            const option = document.createElement('option');
            option.value = c.id.toString();
            option.textContent = c.nombre;
            selectCategory.appendChild(option);
        });
    };

    const openModal = (prod?: Product) => {
        populateCategories();
        document.getElementById('modal-title')!.textContent = prod ? 'Editar Producto' : 'Nuevo Producto';
        
        const idInput = document.getElementById('product-id') as HTMLInputElement;
        const nameInput = document.getElementById('product-name') as HTMLInputElement;
        const priceInput = document.getElementById('product-price') as HTMLInputElement;
        const descInput = document.getElementById('product-desc') as HTMLTextAreaElement;
        const stockInput = document.getElementById('product-stock') as HTMLInputElement;
        const imageInput = document.getElementById('product-image') as HTMLInputElement;
        const availInput = document.getElementById('product-available') as HTMLInputElement;

        if (prod) {
            idInput.value = prod.id.toString();
            nameInput.value = prod.nombre;
            priceInput.value = prod.precio.toString();
            descInput.value = prod.descripcion;
            stockInput.value = prod.stock.toString();
            imageInput.value = prod.imagen;
            availInput.checked = prod.disponible;
            
            const catId = prod.categorias && prod.categorias.length > 0 ? prod.categorias[0].id : (prod as any).categoria?.id;
            if (catId) selectCategory.value = catId.toString();
        } else {
            form.reset();
            idInput.value = '';
            availInput.checked = true;
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
        
        const catId = parseInt(selectCategory.value);
        if (!catId) {
            Swal.fire('Error', 'Debe seleccionar una categoría', 'error');
            return;
        }
        
        const category = getCategories().find(c => c.id === catId);
        
        const idInput = document.getElementById('product-id') as HTMLInputElement;
        const nameInput = document.getElementById('product-name') as HTMLInputElement;
        const priceInput = document.getElementById('product-price') as HTMLInputElement;
        const descInput = document.getElementById('product-desc') as HTMLTextAreaElement;
        const stockInput = document.getElementById('product-stock') as HTMLInputElement;
        const imageInput = document.getElementById('product-image') as HTMLInputElement;
        const availInput = document.getElementById('product-available') as HTMLInputElement;

        const product: Product = {
            id: idInput.value ? parseInt(idInput.value) : 0,
            nombre: nameInput.value,
            precio: parseFloat(priceInput.value),
            descripcion: descInput.value,
            stock: parseInt(stockInput.value),
            imagen: imageInput.value,
            disponible: availInput.checked,
            eliminado: false,
            createdAt: new Date().toISOString(),
            categorias: category ? [category] : [],
            // compat for old data
            categoria: category
        } as Product;

        saveProduct(product);
        closeModal();
        renderTable();
        Swal.fire('Guardado', 'Producto guardado con éxito', 'success');
    });

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    renderTable();
});
