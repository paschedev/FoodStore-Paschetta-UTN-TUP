package com.tp.jpa.repository;

import com.tp.jpa.model.Categoria;

// repo de categorias para la db
public class CategoriaRepository extends BaseRepository<Categoria> {

    public CategoriaRepository() {
        super(Categoria.class);
    }
}
