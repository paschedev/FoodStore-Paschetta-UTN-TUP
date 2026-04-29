# 🍔 Food Store - Trabajo Práctico Integrador

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

Este proyecto es una aplicación web dinámica desarrollada para la cátedra de **Programación III** (Tecnicatura Universitaria en Programación). 

El proyecto es un **Trabajo Práctico Integrador** de entregas progresivas, donde la aplicación base va escalando en complejidad y seguridad a medida que se avanza en la cursada.

---

## 🚀 Objetivo de esta Entrega: TypeScript & Autenticación

En esta etapa dejamos atrás el HTML estático con JavaScript vainilla y nos pasamos a algo mucho más robusto. Implementé un sistema de login, persistencia de datos y protección de rutas.

### ✨ Características Implementadas

* **Tipado Estricto**: Migración completa a **TypeScript**, asegurando contratos de datos rígidos mediante el uso de interfaces (`IUser`, `Rol`).
* **Autenticación (Login / Registro)**: Sistema de captación de datos y validación de credenciales en tiempo real.
* **Persistencia de Datos**: Uso  de `localStorage` simulando una base de datos de usuarios (`users`) y mantenimiento de la sesión activa del navegador (`userData`).
* **Autorización y Guards**: Implementación de un interceptor centralizado (`main.ts`) que bloquea o redirige las peticiones según el rol (`admin` o `client`).
* **Experiencia de Usuario (UX)**: Integración de la librería **SweetAlert2** para manejar todas las notificaciones, alertas de seguridad y confirmaciones de forma profesional e intuitiva.

---

## 📂 Estructura del Proyecto

El código fuente respeta una arquitectura modular separada por responsabilidades:

```text
📦 root
 ┣ 📂 assets       # Imágenes y recursos estáticos
 ┣ 📂 css          # Hojas de estilo globales
 ┣ 📂 src
 ┃ ┣ 📂 pages      # Contenedores de las vistas
 ┃ ┃ ┣ 📂 admin    # Panel de administración (Protegido)
 ┃ ┃ ┣ 📂 auth     # Vistas de Registro y Login
 ┃ ┃ ┗ 📂 client   # Tienda principal (Carrito y Catálogo)
 ┃ ┣ 📂 types      # Contratos de datos (Interfaces)
 ┃ ┗ 📂 utils      # Lógica de verificación y sesión
 ┣ 📜 index.html   # Entry point (Redireccionador)
 ┗ 📜 package.json # Dependencias y scripts
```

---

## 🛠️ Instalación y Ejecución

> [!WARNING]
> **Aclaración sobre el archivo .zip**: No se incluye la carpeta `node_modules` para reducir el peso de la entrega. Asegúrese de ejecutar el comando de instalación de dependencias antes de iniciar el proyecto.

Para correr este proyecto en un entorno de desarrollo local, asegúrate de tener [Node.js](https://nodejs.org/) instalado.

1. **Clonar/Descomprimir el repositorio** y abrir una terminal en el directorio raíz.
2. **Instalar las dependencias** (Vite, TypeScript, SweetAlert2):
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

Por defecto, la "base de datos" inicia vacía. (Hasta implementar una base de datos real)

1. **Cliente**: Haz clic en "Registrate" y crea una cuenta. El sistema te asignará el rol de `client`. Podrás ver la tienda y agregar productos al carrito, pero el acceso a `/admin/` te será denegado.
2. **Administrador**: Para probar el guard de administrador, puedes inyectar un usuario admin directamente en el LocalStorage ejecutando el siguiente código en la consola (F12) del navegador:
```javascript
const users = JSON.parse(localStorage.getItem('users')) || [];
users.push({ email: "admin@admin.com", password: "admin", rol: "admin" });
localStorage.setItem("users", JSON.stringify(users));
```
   *Luego, inicia sesión con `admin@admin.com` y clave `admin`.*

---
*Desarrollado como proyecto integrador universitario - 2026*
