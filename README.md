# 🍔 Food Store - Trabajo Práctico Integrador

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

Este proyecto es una aplicación web dinámica desarrollada para la cátedra de **Programación III** (Tecnicatura Universitaria en Programación). 

El proyecto es un **Trabajo Práctico Integrador** de entregas progresivas, donde la aplicación base fue escalando en complejidad hasta llegar a esta versión final y completamente funcional.

---

## 🚀 Objetivo de la Entrega Final

En esta etapa definitiva, el sistema integra la gestión completa de la tienda y el panel de administración, utilizando persistencia de datos local, tipado estricto y protección de rutas.

### ✨ Características Implementadas (Consigna)

* **Consumo Inicial de Datos (JSON)**: El sistema arranca leyendo los archivos estáticos proveídos por la cátedra (`categorias.json`, `productos.json`, `pedidos.json`, `usuarios.json`) ubicados en la carpeta `public/data`.
* **Persistencia en LocalStorage**: Una vez leídos los JSON iniciales, toda la base de datos se vuelca al `localStorage`. A partir de allí, todas las operaciones de CRUD (crear, editar, eliminar) impactan y persisten sobre el almacenamiento local del navegador.
* **Panel de Administración Funcional**: 
  - Gestión completa de **Categorías** y **Productos** (Altas, Bajas lógicas y Modificaciones).
  - Listado y cambio de estados para los **Pedidos**.
* **Sincronización de Tienda**: La interfaz pública de la tienda (Catálogo y Carrito) lee de forma dinámica los productos y categorías disponibles directamente de la base de datos local, filtrando aquellos ítems que han sido dados de baja por el administrador.
* **Autenticación y Guards**: 
  - Sistema de Login para clientes y administradores.
  - Protección estricta de rutas: los usuarios normales no pueden acceder al panel de administración.
* **Migración a TypeScript**: Todo el proyecto fue tipado estrictamente utilizando interfaces formales para asegurar los contratos de datos de las entidades principales.

---

## 📂 Estructura del Proyecto

El código fuente respeta una arquitectura modular separada por responsabilidades:

```text
📦 root
 ┣ 📂 frontend
 ┃ ┣ 📂 public/data    # Archivos JSON iniciales de la cátedra
 ┃ ┣ 📂 public/assets  # Imágenes y recursos estáticos
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 pages      # Contenedores de las vistas (Admin, Auth, Store)
 ┃ ┃ ┣ 📂 types      # Contratos de datos (Interfaces)
 ┃ ┃ ┗ 📂 utils      # Lógica de persistencia (storage.ts) y autenticación
 ┃ ┣ 📜 index.html   # Entry point
 ┃ ┗ 📜 package.json # Dependencias y scripts
```

---

## 🛠️ Instalación y Ejecución

> [!WARNING]
> **Aclaración sobre el archivo .zip**: No se incluye la carpeta `node_modules` para reducir el peso de la entrega. Asegúrese de ejecutar el comando de instalación de dependencias antes de iniciar el proyecto.

Para correr este proyecto en un entorno de desarrollo local, asegúrate de tener [Node.js](https://nodejs.org/) instalado.

1. **Clonar/Descomprimir el repositorio** y abrir una terminal en la carpeta `frontend`.
2. **Instalar las dependencias**:
   ```bash
   npm install
   ```
3. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```
4. **Abrir en el navegador**: Acceder al enlace local proporcionado por consola (por defecto `http://localhost:5173/`).

---

## 🧪 Instrucciones de Prueba (Roles)

Al arrancar la página por primera vez, la base de datos se autocompletará con los JSON de la cátedra, proveyendo cuentas por defecto para realizar las pruebas.

1. **Cliente**: Puedes crear tu propia cuenta desde el registro, o iniciar sesión con:
   - **Email**: `cliente@food.com`
   - **Clave**: `123456`
   - *Este rol permite comprar y ver el catálogo, pero tiene el acceso bloqueado al panel de control.*
2. **Administrador**: Para probar la gestión completa y el guard de administrador, inicia sesión con las credenciales maestras pre-generadas:
   - **Email**: `admin@admin.com`
   - **Clave**: `admin`
   - *Este rol otorga acceso total al panel de control.*

---
*Desarrollado como Trabajo Práctico Integrador - Programación III - 2026*
