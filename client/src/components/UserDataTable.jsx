import { useState, useEffect } from "react";
import UserModal from "./UserModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import Toast from "./Toast";
import usuarioService from "../services/usuarioService";

const UserDataTable = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  }; // Cargar usuarios desde la API

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null); // MODIFICACIÓN CLAVE: Esperamos un objeto JSON y accedemos a la propiedad 'data'
      const response = await usuarioService.obtenerTodosLosUsuarios();
      const usuarios = response.data || []; // Asume que la lista está en 'data' y si no, es un array vacío
      setUsers(usuarios);
      setFilteredUsers(usuarios);
    } catch (err) {
      const errorMessage = "Error al cargar los usuarios: " + err.message;
      setError(errorMessage);
      showToast(errorMessage, "error");
      console.error("Error:", err); // Asegurar que siempre tengamos arrays vacíos en caso de error
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    const searchUsers = async () => {
      if (!searchTerm.trim()) {
        setFilteredUsers(users);
        return;
      }

      try {
        // Usar la API de búsqueda por nombre
        // MODIFICACIÓN CLAVE: Esperamos un objeto JSON y accedemos a la propiedad 'data'
        const response = await usuarioService.buscarUsuariosPorNombre(
          searchTerm
        );
        const resultados = response.data || []; // Asume que la lista está en 'data'
        setFilteredUsers(resultados);
      } catch {
        // Si falla la búsqueda por API, buscar localmente
        const filtered = users.filter(
          (user) =>
            user.nombreCompleto
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            user.correoElectronico
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            user.numeroTelefono?.includes(searchTerm)
        );
        setFilteredUsers(filtered);
      }
      setCurrentPage(1);
    }; // Debounce la búsqueda

    const timeoutId = setTimeout(searchUsers, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, users]);

  const handleCreate = () => {
    setSelectedUser(null);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleSave = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      if (isEditing) {
        // Actualizar usuario existente
        await usuarioService.actualizarUsuario(selectedUser.id, userData);
        showToast("Usuario actualizado correctamente", "success");
      } else {
        // Crear nuevo usuario
        await usuarioService.crearUsuario(userData);
        showToast("Usuario creado correctamente", "success");
      } // Recargar la lista de usuarios

      await loadUsers();
      setShowModal(false);
      setSelectedUser(null);
    } catch (err) {
      const errorMessage = `Error al ${
        isEditing ? "actualizar" : "crear"
      } usuario: ${err.message}`;
      setError(errorMessage);
      showToast(errorMessage, "error");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      setError(null);

      await usuarioService.eliminarUsuario(selectedUser.id);
      showToast("Usuario eliminado correctamente", "success"); // Recargar la lista de usuarios

      await loadUsers();
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (err) {
      const errorMessage = "Error al eliminar usuario: " + err.message;
      setError(errorMessage);
      showToast(errorMessage, "error");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  }; // Paginación

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const safeFilteredUsers = filteredUsers || [];
  const currentUsers = safeFilteredUsers.slice(
    indexOfFirstUser,
    indexOfLastUser
  );
  const totalPages = Math.ceil(safeFilteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container-fluid py-4">
      
      <div className="row">
        
        <div className="col-12">
          
          <div className="card shadow">
            
            <div className="card-header bg-primary text-white">
              
              <div className="row align-items-center">
                
                <div className="col-md-6">
                  
                  <h5 className="mb-0">
                    <i className="fas fa-users me-2"></i>
                    Gestión de Usuarios
                  </h5>
                </div>
                <div className="col-md-6 text-end">
                  
                  <button
                    className="btn btn-light btn-sm"
                    onClick={handleCreate}
                    disabled={loading}
                  >
                    <i className="fas fa-plus me-1"></i>
                    Nuevo Usuario
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body">
              {/* Mensaje de error */}
              {error && (
                <div
                  className="alert alert-danger alert-dismissible fade show"
                  role="alert"
                >
                  
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setError(null)}
                  ></button>
                </div>
              )}
              {/* Barra de búsqueda */}
              <div className="row mb-3">
                
                <div className="col-md-6">
                  
                  <div className="input-group">
                    
                    <span className="input-group-text">
                      <i className="fas fa-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar por nombre, email o teléfono..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6 text-end">
                  
                  <small className="text-muted">
                    Mostrando {currentUsers.length} de
                    {safeFilteredUsers.length} usuarios
                  </small>
                </div>
              </div>
              {/* Tabla */}
              <div className="table-responsive">
                
                {loading ? (
                  <div className="text-center py-4">
                    
                    <div className="spinner-border" role="status">
                      
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                  </div>
                ) : (
                  <table className="table table-hover table-striped">
                    
                    <thead className="table-dark">
                      
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Nombre Completo</th>
                        <th scope="col" className="d-none d-md-table-cell">
                          Correo Electrónico
                        </th>
                        <th scope="col" className="d-none d-lg-table-cell">
                          Teléfono
                        </th>
                        <th scope="col" className="text-center">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      
                      {currentUsers.length === 0 ? (
                        <tr>
                          
                          <td colSpan="5" className="text-center py-4">
                            
                            <i className="fas fa-inbox fa-2x text-muted mb-2"></i>
                            <p className="text-muted mb-0">
                              No se encontraron usuarios
                            </p>
                          </td>
                        </tr>
                      ) : (
                        currentUsers.map((user, index) => (
                          <tr key={user.id}>
                            
                            <th scope="row">
                              {indexOfFirstUser + index + 1}
                            </th>
                            <td>
                              
                              <div>
                                
                                <strong>{user.nombreCompleto}</strong>
                                <div className="d-md-none">
                                  
                                  <small className="text-muted">
                                    
                                    {user.correoElectronico}
                                  </small>
                                </div>
                              </div>
                            </td>
                            <td className="d-none d-md-table-cell">
                              
                              {user.correoElectronico}
                            </td>
                            <td className="d-none d-lg-table-cell">
                              
                              {user.numeroTelefono}
                            </td>
                            <td className="text-center">
                              
                              <div className="btn-group" role="group">
                                
                                <button
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={() => handleEdit(user)}
                                  title="Editar"
                                  disabled={loading}
                                >
                                  
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => handleDelete(user)}
                                  title="Eliminar"
                                  disabled={loading}
                                >
                                  
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>
              {/* Paginación */}
              {totalPages > 1 && (
                <nav aria-label="Paginación">
                  
                  <ul className="pagination justify-content-center mb-0">
                    
                    <li
                      className={`page-item ${
                        currentPage === 1 ? "disabled" : ""
                      }`}
                    >
                      
                      <button
                        className="page-link"
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        
                        <i className="fas fa-chevron-left"></i>
                      </button>
                    </li>
                    {[...Array(totalPages)].map((_, i) => (
                      <li
                        key={i + 1}
                        className={`page-item ${
                          currentPage === i + 1 ? "active" : ""
                        }`}
                      >
                        
                        <button
                          className="page-link"
                          onClick={() => paginate(i + 1)}
                        >
                          {i + 1}
                        </button>
                      </li>
                    ))}
                    <li
                      className={`page-item ${
                        currentPage === totalPages ? "disabled" : ""
                      }`}
                    >
                      
                      <button
                        className="page-link"
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Modales */}
      <UserModal
        show={showModal}
        onHide={() => setShowModal(false)}
        user={selectedUser}
        isEditing={isEditing}
        onSave={handleSave}
      />
      <DeleteConfirmModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        user={selectedUser}
        onConfirm={confirmDelete}
      />
      {/* Toast de notificaciones */}
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
    </div>
  );
};

export default UserDataTable;
