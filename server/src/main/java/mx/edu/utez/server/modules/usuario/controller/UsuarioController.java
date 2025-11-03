package mx.edu.utez.server.modules.usuario.controller;

import mx.edu.utez.server.modules.usuario.dto.UsuarioRequest;
import mx.edu.utez.server.modules.usuario.dto.UsuarioResponse;
import mx.edu.utez.server.modules.usuario.dto.UsuarioUpdate;
import mx.edu.utez.server.modules.usuario.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
@Validated
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    // GET /api/usuarios - Obtener todos los usuarios
    @GetMapping
    public ResponseEntity<Map<String, Object>> obtenerTodosLosUsuarios() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<UsuarioResponse> usuarios = usuarioService.obtenerTodosLosUsuarios();
            response.put("success", true);
            response.put("message", "Usuarios obtenidos correctamente");
            response.put("data", usuarios);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            response.put("data", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // GET /api/usuarios/{id} - Obtener usuario por ID
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> obtenerUsuarioPorId(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            UsuarioResponse usuario = usuarioService.obtenerUsuarioPorId(id);
            response.put("success", true);
            response.put("message", "Usuario encontrado");
            response.put("data", usuario);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            response.put("data", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // POST /api/usuarios - Crear usuario
    @PostMapping
    public ResponseEntity<Map<String, Object>> crearUsuario(@Valid @RequestBody UsuarioRequest usuarioRequest) {
        Map<String, Object> response = new HashMap<>();
        try {
            UsuarioResponse usuarioCreado = usuarioService.crearUsuario(usuarioRequest);
            response.put("success", true);
            response.put("message", "Usuario creado correctamente");
            response.put("data", usuarioCreado);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            response.put("data", null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // PUT /api/usuarios/{id} - Actualizar usuario
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> actualizarUsuario(
            @PathVariable Long id,
            @Valid @RequestBody UsuarioUpdate usuarioUpdate) {
        Map<String, Object> response = new HashMap<>();
        try {
            UsuarioResponse usuarioActualizado = usuarioService.actualizarUsuario(id, usuarioUpdate);
            response.put("success", true);
            response.put("message", "Usuario actualizado correctamente");
            response.put("data", usuarioActualizado);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            response.put("data", null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // DELETE /api/usuarios/{id} - Eliminar usuario
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> eliminarUsuario(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            usuarioService.eliminarUsuario(id);
            response.put("success", true);
            response.put("message", "Usuario eliminado correctamente");
            response.put("data", null);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            response.put("data", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // GET /api/usuarios/buscar/{correo} - Buscar usuario por correo
    @GetMapping("/buscar/{correo}")
    public ResponseEntity<Map<String, Object>> buscarPorCorreo(@PathVariable String correo) {
        Map<String, Object> response = new HashMap<>();
        try {
            UsuarioResponse usuario = usuarioService.buscarPorCorreo(correo);
            response.put("success", true);
            response.put("message", "Usuario encontrado");
            response.put("data", usuario);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            response.put("data", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}