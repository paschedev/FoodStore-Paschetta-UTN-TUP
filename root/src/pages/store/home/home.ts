import Swal from 'sweetalert2';
import '../../../main';
import { logoutUser, isAuthenticated } from '../../../utils/auth';
import { PRODUCTS as productos, getCategories } from '../../../utils/data';

interface ICartItem {
  producto: typeof productos[0];
  cantidad: number;
}

let carrito: ICartItem[] = (JSON.parse(localStorage.getItem("carrito") || "[]") as ICartItem[])
  .filter((item): item is ICartItem => item != null && item.producto != null && typeof item.producto.id === 'number');

const renderizarProductos = (lista: any[]) => {
  const contenedor = document.getElementById("contenedor-productos");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  lista.forEach(producto => {
    const article = document.createElement("article");

    article.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}">
      <h3>${producto.nombre}</h3>
      <p>${producto.descripcion}</p>
      <p><strong>$${producto.precio}</strong></p>
      <button data-id="${producto.id}" class="btn-agregar">
        Agregar
      </button>
    `;

    contenedor.appendChild(article);
  });

  // Event listeners de los add buttons
  const botones = document.querySelectorAll('.btn-agregar');
  botones.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt((e.target as HTMLElement).getAttribute('data-id') || '0');
      agregarProducto(id);
    });
  });
};

const cargarCategorias = () => {
  const lista = document.getElementById("lista-categorias");
  if (!lista) return;

  const categorias = getCategories();

  categorias.forEach(cat => {
    const li = document.createElement("li");

    li.innerHTML = `<a href="#">${cat.nombre}</a>`;

    li.addEventListener("click", (e) => {
      e.preventDefault();
      const filtrados = productos.filter(p => p.categorias.some(c => c.id === cat.id));
      renderizarProductos(filtrados);
    });

    lista.appendChild(li);
  });
};

const activarBuscador = () => {
  const input = document.getElementById("buscador") as HTMLInputElement;
  if (!input) return;

  input.addEventListener("input", (e) => {
    const texto = (e.target as HTMLInputElement).value.toLowerCase();

    const filtrados = productos.filter(p =>
      p.nombre.toLowerCase().includes(texto)
    );

    renderizarProductos(filtrados);
  });
};

const agregarProducto = (id: number) => {
  if (!isAuthenticated()) {
    Swal.fire({
      icon: 'warning',
      title: 'Atención',
      text: 'Debes iniciar sesión para agregar productos al carrito.',
      confirmButtonColor: '#ff6347'
    });
    return;
  }

  const producto = productos.find(p => p.id === id);
  if (producto) {
    const itemExistente = carrito.find(item => item.producto?.id === id);
    if (itemExistente) {
      itemExistente.cantidad++;
    } else {
      carrito.push({ producto, cantidad: 1 });
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarritoUI();
    Swal.fire({
      icon: 'success',
      title: '¡Agregado!',
      text: `Se agregó ${producto.nombre} a tu carrito.`,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
  }
};

const actualizarCarritoUI = () => {
  const contador = document.getElementById("contador-carrito");
  if (contador) {
    const totalItems = carrito.reduce((acc, item) => acc + (item.cantidad || 0), 0);
    contador.textContent = `🛒 (${totalItems})`;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  cargarCategorias();
  renderizarProductos(productos);
  activarBuscador();
  actualizarCarritoUI();

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      
      const result = await Swal.fire({
        title: '¿Cerrar sesión?',
        text: "Tendrás que volver a ingresar tus credenciales.",
        icon: 'question',
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
});