# Food Store - Trabajo Práctico Integrador

Este proyecto es una aplicación web dinámica desarrollada para la cátedra de Programación III (Tecnicatura Universitaria en Programación). 

El proyecto es un Trabajo Práctico Integrador de entregas progresivas, donde la aplicación base fue escalando en complejidad hasta llegar a esta versión final.

---

## Objetivo de la Entrega Final

En esta etapa el sistema integra la gestión completa de la tienda y el panel de administración, utilizando persistencia de datos local, tipado estricto y protección de rutas.

### Características Implementadas (Consigna)

* Consumo Inicial de Datos (JSON): El sistema arranca leyendo los archivos estáticos dados por la cátedra (categorias.json, productos.json, pedidos.json, usuarios.json) ubicados en la carpeta public/data.
* Persistencia en LocalStorage: Una vez leídos los JSON iniciales, toda la base de datos se guarda en el localStorage. A partir de ahí, todas las operaciones de CRUD (crear, editar, eliminar) impactan y se guardan en el almacenamiento local del navegador.
* Panel de Administración Funcional: 
  - Gestión completa de Categorías y Productos (Altas, Bajas lógicas y Modificaciones).
  - Listado y cambio de estados para los Pedidos.
* Sincronización de Tienda: La interfaz pública de la tienda (Catálogo y Carrito) lee de forma dinámica los productos y categorías disponibles directamente de la base de datos local, filtrando los que fueron dados de baja por el administrador.
* Autenticación y Guards: 
  - Sistema de Login para clientes y administradores.
  - Protección estricta de rutas: los usuarios normales no pueden acceder al panel de administración.
* Migración a TypeScript: Todo el proyecto fue tipado usando interfaces formales para asegurar la estructura de las entidades principales.

---

## App de Consola (Backend JPA)

El proyecto incluye una app de consola interactiva hecha en Java (Main.java) que sirve como panel de control directo para la base de datos relacional (H2).
Esta consola usa JPA (Hibernate) para interactuar con la db y permite gestionar el 100% de las entidades.

Características principales de la app de consola:
* Alta transaccional de pedidos: Al generar un pedido, el sistema automáticamente valida si hay stock suficiente de los productos elegidos. Si todo está ok, genera el detalle del pedido y descuenta el stock del inventario dentro de una misma transacción atómica usando el EntityManager. Si algo falla, hace un rollback automático para mantener la consistencia de la db.
* Bajas Lógicas: Ningún registro se borra físicamente. La consola hace un update del campo "eliminado" para ocultarlos del sistema sin romper las relaciones.
* Menú de Reportes: Consultas JPQL puras para buscar pedidos por usuario, filtrar por estado (PENDIENTE, CONFIRMADO, etc.) y calcular el total de plata facturada.

Para probar la consola, podés correr el archivo Main.java desde tu IDE o usar el wrapper de gradle:
   ```bash
   cd backend
   ./gradlew run
   ```

---

## Estructura del Proyecto

El código fuente respeta una arquitectura modular separada por responsabilidades:

```text
root
 ┣ frontend
 ┃ ┣ public/data    # Archivos JSON iniciales de la cátedra
 ┃ ┣ public/assets  # Imágenes y recursos estáticos
 ┃ ┣ src
 ┃ ┃ ┣ pages      # Contenedores de las vistas (Admin, Auth, Store)
 ┃ ┃ ┣ types      # Contratos de datos (Interfaces)
 ┃ ┃ ┗ utils      # Lógica de persistencia (storage.ts) y autenticación
 ┃ ┣ index.html   # Entry point
 ┃ ┗ package.json # Dependencias y scripts
```

---

## Instalación y Ejecución

> [!WARNING]
> Aclaración sobre el archivo .zip: No se incluye la carpeta node_modules para reducir el peso de la entrega. Asegúrese de ejecutar el comando de instalación de dependencias antes de iniciar el proyecto.

Para correr este proyecto en un entorno de desarrollo local, asegurate de tener Node.js instalado.

1. Clonar/Descomprimir el repositorio y abrir una terminal en la carpeta frontend.
2. Instalar las dependencias:
   ```bash
   npm install
   ```
3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Abrir en el navegador: Acceder al enlace local que da la consola (por defecto http://localhost:5173/).

---

## Instrucciones de Prueba (Roles)

Al arrancar la página por primera vez, la base de datos se autocompletará con los JSON de la cátedra, proveyendo cuentas por defecto para realizar las pruebas.

1. Cliente: Podés crear tu propia cuenta desde el registro, o iniciar sesión con:
   - Email: cliente@food.com
   - Clave: 123456
   - Este rol permite comprar y ver el catálogo, pero tiene el acceso bloqueado al panel de control.
2. Administrador: Para probar la gestión completa y el guard de administrador, iniciá sesión con las credenciales maestras pre-generadas:
   - Email: admin@admin.com
   - Clave: admin
   - Este rol otorga acceso total al panel de control.

---

## Presentación en Video

 https://youtu.be/nOMo0kr7dkw
