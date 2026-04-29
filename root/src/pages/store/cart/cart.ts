import Swal from 'sweetalert2';
import '../../../main';
import { logoutUser } from '../../../utils/auth';
import { PRODUCTS as productos } from '../../../utils/data';

interface ICartItem {
  producto: typeof productos[0];
  cantidad: number;
}

let carrito: ICartItem[] = (JSON.parse(localStorage.getItem("carrito") || "[]") as ICartItem[])
  .filter((item): item is ICartItem => item != null && item.producto != null && typeof item.producto.id === 'number');

const actualizarCarritoUI = () => {
  const contador = document.getElementById("contador-carrito");
  if (contador) {
    const totalItems = carrito.reduce((acc, item) => acc + (item.cantidad || 0), 0);
    contador.textContent = `🛒 (${totalItems})`;
  }
};

const renderizarCarrito = () => {
  const contenedor = document.getElementById("cart-items");
  const totalSpan = document.getElementById("cart-total");
  if (!contenedor || !totalSpan) return;

  contenedor.innerHTML = "";
  let total = 0;

  if (carrito.length === 0) {
      contenedor.innerHTML = "<p style='text-align:center;'>Tu carrito está vacío.</p>";
  } else {
      carrito.forEach((item, index) => {
          total += item.producto.precio * item.cantidad;
          const div = document.createElement("div");
          div.className = "cart-item";
          div.innerHTML = `
              <img src="${item.producto.imagen}" alt="${item.producto.nombre}">
              <div class="cart-item-info">
                  <h4>${item.producto.nombre}</h4>
                  <p>$${item.producto.precio} x ${item.cantidad}</p>
              </div>
              <div class="cart-item-actions">
                  <button class="btn-restar" data-index="${index}">-</button>
                  <span>${item.cantidad}</span>
                  <button class="btn-sumar" data-index="${index}">+</button>
                  <button class="btn-eliminar" data-index="${index}">🗑️</button>
              </div>
          `;
          contenedor.appendChild(div);
      });

      // Cart buttons events
      document.querySelectorAll('.btn-sumar').forEach(btn => {
          btn.addEventListener('click', (e) => {
              const index = parseInt((e.target as HTMLElement).getAttribute('data-index') || '0');
              carrito[index].cantidad++;
              actualizarYCerrar();
          });
      });
      document.querySelectorAll('.btn-restar').forEach(btn => {
          btn.addEventListener('click', (e) => {
              const index = parseInt((e.target as HTMLElement).getAttribute('data-index') || '0');
              if (carrito[index].cantidad > 1) {
                  carrito[index].cantidad--;
              } else {
                  carrito.splice(index, 1);
              }
              actualizarYCerrar();
          });
      });
      document.querySelectorAll('.btn-eliminar').forEach(btn => {
          btn.addEventListener('click', (e) => {
              const index = parseInt((e.target as HTMLElement).getAttribute('data-index') || '0');
              carrito.splice(index, 1);
              actualizarYCerrar();
          });
      });
  }

  totalSpan.textContent = total.toString();
};

const actualizarYCerrar = () => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarritoUI();
    renderizarCarrito();
};

document.addEventListener('DOMContentLoaded', () => {
  actualizarCarritoUI();
  renderizarCarrito();

  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
        if (carrito.length === 0) {
            Swal.fire('Carrito vacío', 'Agrega algunos productos antes de proceder al pago.', 'info');
            return;
        }
        Swal.fire('Checkout', 'Funcionalidad de pago no implementada (solo requerimiento visual).', 'info');
    });
  }

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
