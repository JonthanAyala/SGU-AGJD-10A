package mx.edu.utez.server.modules.usuario.service;

import mx.edu.utez.server.modules.usuario.dto.UsuarioRequest;
import mx.edu.utez.server.modules.usuario.dto.UsuarioResponse;
import mx.edu.utez.server.modules.usuario.dto.UsuarioUpdate;
import mx.edu.utez.server.modules.usuario.model.Usuario;
import mx.edu.utez.server.modules.usuario.model.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Obtener todos los usuarios
    public List<UsuarioResponse> obtenerTodosLosUsuarios() {
        try {
            List<Usuario> usuarios = usuarioRepository.findAll();
            return usuarios.stream()
                    .map(this::convertirAUsuarioResponse)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error al obtener los usuarios: " + e.getMessage());
        }
    }

    // Obtener usuario por ID
    public UsuarioResponse obtenerUsuarioPorId(Long id) {
        try {
            Optional<Usuario> usuario = usuarioRepository.findById(id);
            if (usuario.isPresent()) {
                return convertirAUsuarioResponse(usuario.get());
            } else {
                throw new RuntimeException("Usuario no encontrado con ID: " + id);
            }
        } catch (Exception e) {
            throw new RuntimeException("Error al obtener el usuario: " + e.getMessage());
        }
    }

    // Crear usuario
    public UsuarioResponse crearUsuario(UsuarioRequest usuarioRequest) {
        try {
            // Verificar si ya existe un usuario con ese correo
            if (usuarioRepository.existsByCorreoElectronico(usuarioRequest.getCorreoElectronico())) {
                throw new RuntimeException("Ya existe un usuario con ese correo electrónico");
            }

            Usuario usuario = new Usuario();
            usuario.setNombreCompleto(usuarioRequest.getNombreCompleto());
            usuario.setCorreoElectronico(usuarioRequest.getCorreoElectronico());
            usuario.setNumeroTelefono(usuarioRequest.getNumeroTelefono());

            Usuario usuarioGuardado = usuarioRepository.save(usuario);
            return convertirAUsuarioResponse(usuarioGuardado);
        } catch (Exception e) {
            throw new RuntimeException("Error al crear el usuario: " + e.getMessage());
        }
    }

    // Actualizar usuario
    public UsuarioResponse actualizarUsuario(Long id, UsuarioUpdate usuarioUpdate) {
        try {
            Optional<Usuario> usuarioOptional = usuarioRepository.findById(id);
            if (!usuarioOptional.isPresent()) {
                throw new RuntimeException("Usuario no encontrado con ID: " + id);
            }

            // Verificar si el correo ya existe para otro usuario
            if (usuarioRepository.existsByCorreoElectronicoAndIdNot(usuarioUpdate.getCorreoElectronico(), id)) {
                throw new RuntimeException("Ya existe otro usuario con ese correo electrónico");
            }

            Usuario usuario = usuarioOptional.get();
            usuario.setNombreCompleto(usuarioUpdate.getNombreCompleto());
            usuario.setCorreoElectronico(usuarioUpdate.getCorreoElectronico());
            usuario.setNumeroTelefono(usuarioUpdate.getNumeroTelefono());

            Usuario usuarioActualizado = usuarioRepository.save(usuario);
            return convertirAUsuarioResponse(usuarioActualizado);
        } catch (Exception e) {
            throw new RuntimeException("Error al actualizar el usuario: " + e.getMessage());
        }
    }

    // Eliminar usuario
    public void eliminarUsuario(Long id) {
        try {
            if (!usuarioRepository.existsById(id)) {
                throw new RuntimeException("Usuario no encontrado con ID: " + id);
            }
            usuarioRepository.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("Error al eliminar el usuario: " + e.getMessage());
        }
    }

    // Buscar usuario por correo
    public UsuarioResponse buscarPorCorreo(String correo) {
        try {
            Optional<Usuario> usuario = usuarioRepository.findByCorreoElectronico(correo);
            if (usuario.isPresent()) {
                return convertirAUsuarioResponse(usuario.get());
            } else {
                throw new RuntimeException("Usuario no encontrado con correo: " + correo);
            }
        } catch (Exception e) {
            throw new RuntimeException("Error al buscar el usuario: " + e.getMessage());
        }
    }

    // Método auxiliar para convertir Usuario a UsuarioResponse
    private UsuarioResponse convertirAUsuarioResponse(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNombreCompleto(),
                usuario.getCorreoElectronico(),
                usuario.getNumeroTelefono());
    }
}