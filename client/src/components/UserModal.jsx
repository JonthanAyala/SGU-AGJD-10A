import { useState, useEffect } from "react";

const UserModal = ({ show, onHide, user, isEditing, onSave }) => {
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    correoElectronico: "",
    numeroTelefono: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      if (isEditing && user) {
        setFormData({
          nombreCompleto: user.nombreCompleto || "",
          correoElectronico: user.correoElectronico || "",
          numeroTelefono: user.numeroTelefono || "",
        });
      } else {
        setFormData({
          nombreCompleto: "",
          correoElectronico: "",
          numeroTelefono: "",
        });
      }
      setErrors({});
    }
  }, [show, isEditing, user]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombreCompleto.trim()) {
      newErrors.nombreCompleto = "El nombre completo es requerido";
    } else if (formData.nombreCompleto.trim().length < 2) {
      newErrors.nombreCompleto = "El nombre debe tener al menos 2 caracteres";
    }

    if (!formData.correoElectronico.trim()) {
      newErrors.correoElectronico = "El correo electrónico es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correoElectronico)) {
      newErrors.correoElectronico =
        "El formato del correo electrónico no es válido";
    }

    if (!formData.numeroTelefono.trim()) {
      newErrors.numeroTelefono = "El número de teléfono es requerido";
    } else if (!/^\d{10}$/.test(formData.numeroTelefono)) {
      newErrors.numeroTelefono = "El número debe tener 10 dígitos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      try {
        await onSave(formData);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar el error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handlePhoneChange = (e) => {
    // Solo dígitos, máximo 10
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);

    setFormData((prev) => ({
      ...prev,
      numeroTelefono: digits,
    }));

    if (errors.numeroTelefono) {
      setErrors((prev) => ({ ...prev, numeroTelefono: "" }));
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              <i
                className={`fas ${isEditing ? "fa-edit" : "fa-plus"} me-2`}
              ></i>
              {isEditing ? "Editar Usuario" : "Crear Nuevo Usuario"}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onHide}
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row">
                <div className="col-12 mb-3">
                  <label htmlFor="nombreCompleto" className="form-label">
                    <i className="fas fa-user me-1"></i>
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.nombreCompleto ? "is-invalid" : ""
                    }`}
                    id="nombreCompleto"
                    name="nombreCompleto"
                    value={formData.nombreCompleto}
                    onChange={handleChange}
                    placeholder="Ingrese el nombre completo"
                    disabled={loading}
                  />
                  {errors.nombreCompleto && (
                    <div className="invalid-feedback">
                      {errors.nombreCompleto}
                    </div>
                  )}
                </div>

                <div className="col-12 mb-3">
                  <label htmlFor="correoElectronico" className="form-label">
                    <i className="fas fa-envelope me-1"></i>
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    className={`form-control ${
                      errors.correoElectronico ? "is-invalid" : ""
                    }`}
                    id="correoElectronico"
                    name="correoElectronico"
                    value={formData.correoElectronico}
                    onChange={handleChange}
                    placeholder="ejemplo@correo.com"
                    disabled={loading}
                  />
                  {errors.correoElectronico && (
                    <div className="invalid-feedback">
                      {errors.correoElectronico}
                    </div>
                  )}
                </div>

                <div className="col-12 mb-3">
                  <label htmlFor="numeroTelefono" className="form-label">
                    <i className="fas fa-phone me-1"></i>
                    Número de Teléfono *
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.numeroTelefono ? "is-invalid" : ""
                    }`}
                    id="numeroTelefono"
                    name="numeroTelefono"
                    value={formData.numeroTelefono}
                    onChange={handlePhoneChange}
                    placeholder="1234567890"
                    maxLength="10"
                    disabled={loading}
                  />
                  {errors.numeroTelefono && (
                    <div className="invalid-feedback">
                      {errors.numeroTelefono}
                    </div>
                  )}
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <div
                    className="alert alert-info d-flex align-items-center"
                    role="alert"
                  >
                    <i className="fas fa-info-circle me-2"></i>
                    <small>Los campos marcados con (*) son obligatorios</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onHide}
                disabled={loading}
              >
                <i className="fas fa-times me-1"></i>
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    >
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                    {isEditing ? "Guardando..." : "Creando..."}
                  </>
                ) : (
                  <>
                    <i
                      className={`fas ${
                        isEditing ? "fa-save" : "fa-plus"
                      } me-1`}
                    ></i>
                    {isEditing ? "Guardar Cambios" : "Crear Usuario"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
