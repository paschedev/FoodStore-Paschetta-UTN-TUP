import { ICategory, Product, Order } from '../types';

// Helper to check if local storage is populated
export const isDataInitialized = () => {
  return localStorage.getItem('products') !== null;
};

// Initialize data from JSON files
export const initData = async () => {
  if (isDataInitialized()) return;

  try {
    const [catRes, prodRes, ordRes, usrRes] = await Promise.all([
      fetch('/data/categorias.json'),
      fetch('/data/productos.json'),
      fetch('/data/pedidos.json'),
      fetch('/data/usuarios.json')
    ]);

    const categories = await catRes.json();
    const products = await prodRes.json();
    const orders = await ordRes.json();
    const users = await usrRes.json();

    localStorage.setItem('categories', JSON.stringify(categories));
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Auth util already manages users, but let's prepopulate it here if empty
    if (!localStorage.getItem('users')) {
      localStorage.setItem('users', JSON.stringify(users));
    }
  } catch (error) {
    console.error('Error initializing data from JSON:', error);
  }
};

// Products
export const getProducts = (): Product[] => {
  return JSON.parse(localStorage.getItem('products') || '[]');
};

export const saveProduct = (product: Product) => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === product.id);
  if (index >= 0) {
    products[index] = product;
  } else {
    // Generate new ID if not exist
    const maxId = products.reduce((max, p) => Math.max(max, p.id), 0);
    product.id = maxId + 1;
    products.push(product);
  }
  localStorage.setItem('products', JSON.stringify(products));
};

export const deleteProduct = (id: number) => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index >= 0) {
    products[index].eliminado = true; // Logical delete
    localStorage.setItem('products', JSON.stringify(products));
  }
};

// Categories
export const getCategories = (): ICategory[] => {
  return JSON.parse(localStorage.getItem('categories') || '[]');
};

export const saveCategory = (category: ICategory) => {
  const categories = getCategories();
  const index = categories.findIndex(c => c.id === category.id);
  if (index >= 0) {
    categories[index] = category;
  } else {
    const maxId = categories.reduce((max, c) => Math.max(max, c.id), 0);
    category.id = maxId + 1;
    categories.push(category);
  }
  localStorage.setItem('categories', JSON.stringify(categories));
};

export const deleteCategory = (id: number) => {
  const categories = getCategories();
  const index = categories.findIndex(c => c.id === id);
  if (index >= 0) {
    categories[index].eliminado = true;
    localStorage.setItem('categories', JSON.stringify(categories));

    // Handle products orphaned by this category deletion
    let sinCat = categories.find(c => c.nombre === 'Sin Categoría' && !c.eliminado);
    if (!sinCat) {
      const maxId = categories.reduce((max, c) => Math.max(max, c.id), 0);
      sinCat = {
        id: maxId + 1,
        nombre: 'Sin Categoría',
        descripcion: 'Categoría por defecto',
        eliminado: false,
        createdAt: new Date().toISOString()
      };
      categories.push(sinCat);
      localStorage.setItem('categories', JSON.stringify(categories));
    }

    const products = getProducts();
    let productsUpdated = false;
    products.forEach(p => {
      let isOrphaned = false;
      if (p.categorias && p.categorias.length > 0 && p.categorias[0].id === id) {
        p.categorias = [sinCat!];
        isOrphaned = true;
      }
      if ((p as any).categoria && (p as any).categoria.id === id) {
        (p as any).categoria = sinCat;
        isOrphaned = true;
      }
      if (isOrphaned) productsUpdated = true;
    });

    if (productsUpdated) {
      localStorage.setItem('products', JSON.stringify(products));
    }
  }
};

// Orders
export const getOrders = (): Order[] => {
  return JSON.parse(localStorage.getItem('orders') || '[]');
};

export const updateOrderStatus = (id: number, status: Order['estado']) => {
  const orders = getOrders();
  const index = orders.findIndex(o => o.id === id);
  if (index >= 0) {
    orders[index].estado = status;
    localStorage.setItem('orders', JSON.stringify(orders));
  }
};
