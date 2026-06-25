import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'src/pages/auth/login/index.html'),
        registro: resolve(__dirname, 'src/pages/auth/registro/index.html'),
        adminHome: resolve(__dirname, 'src/pages/admin/adminHome/index.html'),
        adminCategories: resolve(__dirname, 'src/pages/admin/categories/index.html'),
        adminProducts: resolve(__dirname, 'src/pages/admin/products/index.html'),
        adminOrders: resolve(__dirname, 'src/pages/admin/orders/index.html'),
        storeHome: resolve(__dirname, 'src/pages/store/home/home.html'),
        storeCart: resolve(__dirname, 'src/pages/store/cart/cart.html'),
      },
    },
  },
  base: './',
});
