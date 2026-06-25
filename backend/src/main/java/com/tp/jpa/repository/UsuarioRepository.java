package com.tp.jpa.repository;

import com.tp.jpa.model.Usuario;
import java.util.Optional;

// repo de usuarios para la db
public class UsuarioRepository extends BaseRepository<Usuario> {

    public UsuarioRepository() {
        super(Usuario.class);
    }


    public Optional<Usuario> buscarPorMail(String mail) {
        // TODO: implementar
        throw new UnsupportedOperationException("Método no implementado aún");
    }
}
