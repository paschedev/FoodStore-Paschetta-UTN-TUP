package com.tp.jpa.repository;

import com.tp.jpa.model.Producto;

import java.util.List;

// repo de productos para la db
public class ProductoRepository extends BaseRepository<Producto> {

    public ProductoRepository() {
        super(Producto.class);
    }


    public List<Producto> buscarPorCategoria(Long categoriaId) {
        // TODO: implementar
        throw new UnsupportedOperationException("Método no implementado aún");
    }
}
