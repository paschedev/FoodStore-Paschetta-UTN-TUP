package com.tp.jpa;

import com.tp.jpa.model.Categoria;
import com.tp.jpa.model.Pedido;
import com.tp.jpa.model.Producto;
import com.tp.jpa.model.Usuario;
import com.tp.jpa.model.enums.EstadoPedido;
import com.tp.jpa.model.enums.FormaPago;
import com.tp.jpa.model.enums.Rol;
import com.tp.jpa.repository.CategoriaRepository;
import com.tp.jpa.repository.PedidoRepository;
import com.tp.jpa.repository.ProductoRepository;
import com.tp.jpa.repository.UsuarioRepository;
import com.tp.jpa.util.JPAUtil;

import jakarta.persistence.EntityManager;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.Scanner;

// menu principal de consola para la app
public class Main {

    private static final Scanner sc = new Scanner(System.in);

    private static final CategoriaRepository categoriaRepo = new CategoriaRepository();
    private static final ProductoRepository productoRepo = new ProductoRepository();
    private static final UsuarioRepository usuarioRepo = new UsuarioRepository();
    private static final PedidoRepository pedidoRepo = new PedidoRepository();

    public static void main(String[] args) {
        boolean salir = false;
        while (!salir) {
            System.out.println();
            System.out.println("===== FOOD STORE - MENÚ PRINCIPAL =====");
            System.out.println("1. Gestionar Categorías");
            System.out.println("2. Gestionar Productos");
            System.out.println("3. Gestionar Usuarios");
            System.out.println("4. Gestionar Pedidos");
            System.out.println("5. Reportes");
            System.out.println("0. Salir");
            System.out.print("Opción: ");
            String op = sc.nextLine().trim();
            switch (op) {
                case "1": menuCategorias(); break;
                case "2": menuProductos(); break;
                case "3": menuUsuarios(); break;
                case "4": menuPedidos(); break;
                case "5": menuReportes(); break;
                case "0": salir = true; break;
                default: System.out.println("Opción inválida.");
            }
        }
        JPAUtil.close();
        System.out.println("Aplicación finalizada.");
    }

    private static void menuCategorias() {
        boolean salir = false;
        while (!salir) {
            System.out.println("\n--- GESTIÓN DE CATEGORÍAS ---");
            System.out.println("1-Alta 2-Modificar 3-Baja lógica 4-Listado 0-Volver");
            System.out.print("Opción: ");
            String op = sc.nextLine().trim();
            switch (op) {
                case "1":
                    System.out.print("Nombre (obligatorio): ");
                    String nom = sc.nextLine().trim();
                    if (nom.isEmpty()) { System.out.println("Error: vacío."); break; }
                    System.out.print("Descripción: ");
                    String desc = sc.nextLine().trim();
                    Categoria c = Categoria.builder().nombre(nom).descripcion(desc).build();
                    try {
                        c = categoriaRepo.guardar(c);
                        System.out.println("Categoría ID: " + c.getId());
                    } catch (Exception e) { System.out.println("Error: " + e.getMessage()); }
                    break;
                case "2":
                    System.out.print("ID: ");
                    Long idMod = Long.parseLong(sc.nextLine().trim());
                    Optional<Categoria> optC = categoriaRepo.buscarPorId(idMod);
                    if (optC.isEmpty() || optC.get().isEliminado()) { System.out.println("Error"); break; }
                    Categoria cMod = optC.get();
                    System.out.print("Nuevo Nombre (Enter conserva): ");
                    String nNom = sc.nextLine().trim(); if (!nNom.isEmpty()) cMod.setNombre(nNom);
                    System.out.print("Nueva Descripción: ");
                    String nDesc = sc.nextLine().trim(); if (!nDesc.isEmpty()) cMod.setDescripcion(nDesc);
                    categoriaRepo.guardar(cMod);
                    System.out.println("Guardado.");
                    break;
                case "3":
                    System.out.print("ID baja: ");
                    if (categoriaRepo.eliminarLogico(Long.parseLong(sc.nextLine().trim()))) System.out.println("Baja exitosa.");
                    break;
                case "4":
                    for (Categoria cat : categoriaRepo.listarActivos()) {
                        System.out.println(cat.getId() + " | " + cat.getNombre());
                    }
                    break;
                case "0": salir = true; break;
            }
        }
    }

    private static void menuProductos() {
        boolean salir = false;
        while (!salir) {
            System.out.println("\n--- GESTIÓN DE PRODUCTOS ---");
            System.out.println("1-Alta 2-Modificar 3-Baja lógica 4-Listado 0-Volver");
            System.out.print("Opción: ");
            String op = sc.nextLine().trim();
            switch (op) {
                case "1":
                    System.out.print("ID Categoría: ");
                    Long idCat = Long.parseLong(sc.nextLine().trim());
                    Optional<Categoria> optC = categoriaRepo.buscarPorId(idCat);
                    if (optC.isEmpty() || optC.get().isEliminado()) { System.out.println("Error categoría"); break; }
                    System.out.print("Nombre: "); String nom = sc.nextLine().trim();
                    if (nom.isEmpty()) break;
                    System.out.print("Precio: "); Double pre = Double.parseDouble(sc.nextLine().trim());
                    System.out.print("Stock: "); int stk = Integer.parseInt(sc.nextLine().trim());
                    if (pre <= 0 || stk < 0) { System.out.println("Error valores"); break; }
                    Producto p = Producto.builder().nombre(nom).precio(pre).stock(stk).disponible(true).build();
                    p = productoRepo.guardar(p);
                    optC.get().addProducto(p);
                    categoriaRepo.guardar(optC.get());
                    System.out.println("ID Generado: " + p.getId());
                    break;
                case "2":
                    System.out.print("ID Producto: ");
                    Long idMod = Long.parseLong(sc.nextLine().trim());
                    Optional<Producto> optP = productoRepo.buscarPorId(idMod);
                    if (optP.isEmpty() || optP.get().isEliminado()) { System.out.println("Error"); break; }
                    Producto pMod = optP.get();
                    System.out.print("Nuevo Nombre: "); String nNom = sc.nextLine().trim(); if(!nNom.isEmpty()) pMod.setNombre(nNom);
                    System.out.print("Nuevo Precio: "); String nPre = sc.nextLine().trim(); if(!nPre.isEmpty()) pMod.setPrecio(Double.parseDouble(nPre));
                    System.out.print("Nuevo Stock: "); String nStk = sc.nextLine().trim(); if(!nStk.isEmpty()) pMod.setStock(Integer.parseInt(nStk));
                    productoRepo.guardar(pMod);
                    System.out.println("Guardado");
                    break;
                case "3":
                    System.out.print("ID baja: ");
                    if (productoRepo.eliminarLogico(Long.parseLong(sc.nextLine().trim()))) System.out.println("Baja exitosa");
                    break;
                case "4":
                    for (Producto prod : productoRepo.listarActivos()) {
                        System.out.println(prod.getId() + " | " + prod.getNombre() + " | $" + prod.getPrecio() + " | Stk: " + prod.getStock());
                    }
                    break;
                case "0": salir = true; break;
            }
        }
    }

    private static void menuUsuarios() {
        boolean salir = false;
        while (!salir) {
            System.out.println("\n--- GESTIÓN DE USUARIOS ---");
            System.out.println("1-Alta 2-Modificar 3-Baja lógica 4-Listado 5-Buscar por mail 0-Volver");
            System.out.print("Opción: ");
            String op = sc.nextLine().trim();
            switch (op) {
                case "1":
                    System.out.print("Mail: "); String m = sc.nextLine().trim();
                    if (usuarioRepo.buscarPorMail(m).isPresent()) { System.out.println("Mail en uso"); break; }
                    System.out.print("Nombre: "); String n = sc.nextLine().trim();
                    System.out.print("Apellido: "); String a = sc.nextLine().trim();
                    System.out.print("Rol (ADMIN/USUARIO): "); String r = sc.nextLine().trim().toUpperCase();
                    Usuario u = Usuario.builder().nombre(n).apellido(a).mail(m).rol(Rol.valueOf(r)).build();
                    u = usuarioRepo.guardar(u);
                    System.out.println("ID Generado: " + u.getId());
                    break;
                case "2":
                    System.out.print("ID Usuario: ");
                    Optional<Usuario> optU = usuarioRepo.buscarPorId(Long.parseLong(sc.nextLine().trim()));
                    if (optU.isEmpty() || optU.get().isEliminado()) { System.out.println("Error"); break; }
                    Usuario uMod = optU.get();
                    System.out.print("Nuevo Mail: "); String nm = sc.nextLine().trim();
                    if (!nm.isEmpty() && !nm.equals(uMod.getMail()) && usuarioRepo.buscarPorMail(nm).isPresent()) {
                        System.out.println("Mail en uso"); break;
                    } else if (!nm.isEmpty()) uMod.setMail(nm);
                    System.out.print("Nuevo Nombre: "); String nn = sc.nextLine().trim(); if(!nn.isEmpty()) uMod.setNombre(nn);
                    System.out.print("Nuevo Apellido: "); String na = sc.nextLine().trim(); if(!na.isEmpty()) uMod.setApellido(na);
                    usuarioRepo.guardar(uMod);
                    System.out.println("Guardado");
                    break;
                case "3":
                    System.out.print("ID baja: ");
                    if (usuarioRepo.eliminarLogico(Long.parseLong(sc.nextLine().trim()))) System.out.println("Baja exitosa");
                    break;
                case "4":
                    for (Usuario usr : usuarioRepo.listarActivos()) System.out.println(usr.getId() + " | " + usr.getMail() + " | " + usr.getRol());
                    break;
                case "5":
                    System.out.print("Mail a buscar: ");
                    Optional<Usuario> o = usuarioRepo.buscarPorMail(sc.nextLine().trim());
                    if (o.isPresent()) System.out.println("Encontrado: " + o.get().getNombre() + " " + o.get().getApellido());
                    else System.out.println("No existe");
                    break;
                case "0": salir = true; break;
            }
        }
    }

    private static void menuPedidos() {
        boolean salir = false;
        while (!salir) {
            System.out.println("\n--- GESTIÓN DE PEDIDOS ---");
            System.out.println("1-Alta 2-Cambiar estado 3-Baja lógica 4-Listado 0-Volver");
            System.out.print("Opción: ");
            String op = sc.nextLine().trim();
            switch (op) {
                case "1": altaPedido(); break;
                case "2":
                    System.out.print("ID Pedido: ");
                    Optional<Pedido> o = pedidoRepo.buscarPorId(Long.parseLong(sc.nextLine().trim()));
                    if (o.isEmpty() || o.get().isEliminado()) { System.out.println("Error"); break; }
                    System.out.print("Nuevo Estado (PENDIENTE/CONFIRMADO/TERMINADO/CANCELADO): ");
                    o.get().setEstado(EstadoPedido.valueOf(sc.nextLine().trim().toUpperCase()));
                    pedidoRepo.guardar(o.get());
                    System.out.println("Actualizado");
                    break;
                case "3":
                    System.out.print("ID baja: ");
                    if (pedidoRepo.eliminarLogico(Long.parseLong(sc.nextLine().trim()))) System.out.println("Baja exitosa");
                    break;
                case "4":
                    for (Pedido p : pedidoRepo.listarActivos()) System.out.println(p.getId() + " | " + p.getEstado() + " | $" + p.getTotal());
                    break;
                case "0": salir = true; break;
            }
        }
    }

    private static void altaPedido() {
        System.out.print("ID Usuario: ");
        Long idU = Long.parseLong(sc.nextLine().trim());
        Optional<Usuario> ou = usuarioRepo.buscarPorId(idU);
        if (ou.isEmpty() || ou.get().isEliminado()) { System.out.println("Error usuario"); return; }

        System.out.print("Forma de pago (TARJETA/TRANSFERENCIA/EFECTIVO): ");
        FormaPago fp;
        try { fp = FormaPago.valueOf(sc.nextLine().trim().toUpperCase()); } catch(Exception e) { System.out.println("Error"); return; }

        class ItemTemp { Long id; int cant; ItemTemp(Long i, int c) { id=i; cant=c; } }
        List<ItemTemp> items = new ArrayList<>();
        
        while (true) {
            System.out.print("ID Producto (0 para terminar): ");
            Long idP = Long.parseLong(sc.nextLine().trim());
            if (idP == 0) break;
            Optional<Producto> op = productoRepo.buscarPorId(idP);
            if (op.isEmpty() || !op.get().getDisponible() || op.get().isEliminado()) { System.out.println("No disponible"); continue; }
            System.out.print("Cantidad: ");
            int cant = Integer.parseInt(sc.nextLine().trim());
            if (cant <= 0 || cant > op.get().getStock()) { System.out.println("Stock insuficiente"); continue; }
            items.add(new ItemTemp(idP, cant));
        }

        if (items.isEmpty()) return;

        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();
        em.getTransaction().begin();
        try {
            Pedido ped = Pedido.builder().fecha(LocalDate.now()).estado(EstadoPedido.PENDIENTE).formaPago(fp).build();
            
            for (ItemTemp it : items) {
                Producto prod = em.find(Producto.class, it.id);
                ped.addDetallePedido(it.cant, prod);
                prod.setStock(prod.getStock() - it.cant);
            }
            ped.calcularTotal();
            em.persist(ped);
            
            Usuario usr = em.find(Usuario.class, idU);
            usr.addPedido(ped);
            
            em.getTransaction().commit();
            System.out.println("Pedido generado ID: " + ped.getId() + " Total: $" + ped.getTotal());
        } catch (Exception e) {
            em.getTransaction().rollback();
            System.out.println("Error rollback: " + e.getMessage());
        } finally {
            em.close();
        }
    }

    private static void menuReportes() {
        boolean salir = false;
        while (!salir) {
            System.out.println("\n--- REPORTES ---");
            System.out.println("1-Prod por Categoría 2-Ped por Usuario 3-Ped por Estado 4-Total facturado 0-Volver");
            System.out.print("Opción: ");
            String op = sc.nextLine().trim();
            switch (op) {
                case "1":
                    System.out.print("ID Cat: ");
                    List<Producto> ps = productoRepo.buscarPorCategoria(Long.parseLong(sc.nextLine().trim()));
                    ps.forEach(p -> System.out.println(p.getId() + " | " + p.getNombre()));
                    break;
                case "2":
                    System.out.print("ID Usuario: ");
                    List<Pedido> peds = pedidoRepo.buscarPorUsuario(Long.parseLong(sc.nextLine().trim()));
                    peds.forEach(p -> System.out.println("ID:" + p.getId() + " Total:$" + p.getTotal()));
                    break;
                case "3":
                    System.out.print("Estado: ");
                    List<Pedido> pedsE = pedidoRepo.buscarPorEstado(EstadoPedido.valueOf(sc.nextLine().trim().toUpperCase()));
                    pedsE.forEach(p -> System.out.println("ID:" + p.getId() + " Total:$" + p.getTotal()));
                    break;
                case "4":
                    double sum = pedidoRepo.buscarPorEstado(EstadoPedido.TERMINADO).stream().mapToDouble(Pedido::getTotal).sum();
                    System.out.println(String.format(Locale.US, "Total facturado: $%.2f", sum));
                    break;
                case "0": salir = true; break;
            }
        }
    }
}
