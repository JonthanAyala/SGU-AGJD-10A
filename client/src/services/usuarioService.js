const ENV = import.meta.env;

//const API_BASE_URL = "http://localhost:8080/api/usuarios";
const API_BASE_URL = `http://${ENV.VITE_API_HOST}:${ENV.VITE_API_PORT}${ENV.VITE_API_BASE}`;

class UsuarioService {
  // 1. Crear Usuario
  async crearUsuario(usuario) {
    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombreCompleto: usuario.nombreCompleto,
          correoElectronico: usuario.correoElectronico,
          numeroTelefono: usuario.numeroTelefono,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear usuario");
      }

      return await response.json();
    } catch (error) {
      console.error("Error al crear usuario:", error);
      throw error;
    }
  }

  // 2. Obtener Todos los Usuarios
  async obtenerTodosLosUsuarios() {
    try {
      const response = await fetch(API_BASE_URL);

      if (!response.ok) {
        throw new Error("Error al obtener usuarios");
      }

      return await response.json();
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }
  }

  // 3. Obtener Usuario por ID
  async obtenerUsuarioPorId(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Usuario no encontrado");
        }
        throw new Error("Error al obtener usuario");
      }

      return await response.json();
    } catch (error) {
      console.error("Error al obtener usuario por ID:", error);
      throw error;
    }
  }

  // 4. Buscar Usuarios por Nombre
  async buscarUsuariosPorNombre(nombre) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/buscar?nombre=${encodeURIComponent(nombre)}`
      );

      if (!response.ok) {
        throw new Error("Error al buscar usuarios");
      }

      return await response.json();
    } catch (error) {
      console.error("Error al buscar usuarios:", error);
      throw error;
    }
  }

  // 5. Actualizar Usuario
  async actualizarUsuario(id, usuario) {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombreCompleto: usuario.nombreCompleto,
          correoElectronico: usuario.correoElectronico,
          numeroTelefono: usuario.numeroTelefono,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar usuario");
      }

      return await response.json();
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      throw error;
    }
  }

  // 6. Eliminar Usuario
  async eliminarUsuario(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Usuario no encontrado");
        }
        throw new Error("Error al eliminar usuario");
      }

      // Retornar true si la eliminación fue exitosa
      return true;
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      throw error;
    }
  }

  // 7. Verificar si Existe Correo
  async verificarExisteCorreo(correo) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/existe-correo?correo=${encodeURIComponent(correo)}`
      );

      if (!response.ok) {
        throw new Error("Error al verificar correo");
      }

      return await response.json();
    } catch (error) {
      console.error("Error al verificar correo:", error);
      throw error;
    }
  }
}

// Exportar una instancia del servicio
export default new UsuarioService();
