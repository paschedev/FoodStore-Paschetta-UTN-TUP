package com.tp.jpa.repository;

import com.tp.jpa.model.Pedido;
import com.tp.jpa.model.enums.EstadoPedido;

import java.util.List;

// repo de pedidos para la db
public class PedidoRepository extends BaseRepository<Pedido> {

    public PedidoRepository() {
        super(Pedido.class);
    }


    public List<Pedido> buscarPorUsuario(Long idUsuario) {
        // TODO: implementar
        throw new UnsupportedOperationException("Método no implementado aún");
    }


    public List<Pedido> buscarPorEstado(EstadoPedido estadoPedido) {
        // TODO: implementar
        throw new UnsupportedOperationException("Método no implementado aún");
    }
}
