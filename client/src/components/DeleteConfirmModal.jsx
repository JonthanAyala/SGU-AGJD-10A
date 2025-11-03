const DeleteConfirmModal = ({ show, onHide, user, onConfirm }) => {
  if (!show || !user) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title">
              <i className="fas fa-exclamation-triangle me-2"></i>
              Confirmar Eliminación
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onHide}
            ></button>
          </div>

          <div className="modal-body">
            <div className="text-center">
              <div className="mb-3">
                <i className="fas fa-user-times fa-4x text-danger"></i>
              </div>
              <h6 className="mb-3">
                ¿Está seguro que desea eliminar este usuario?
              </h6>

              <div className="card border-light bg-light">
                <div className="card-body">
                  <div className="row text-start">
                    <div className="col-4 text-muted">
                      <strong>Nombre:</strong>
                    </div>
                    <div className="col-8">{user.nombreCompleto}</div>
                  </div>
                  <div className="row text-start">
                    <div className="col-4 text-muted">
                      <strong>Email:</strong>
                    </div>
                    <div className="col-8">{user.correoElectronico}</div>
                  </div>
                  <div className="row text-start">
                    <div className="col-4 text-muted">
                      <strong>Teléfono:</strong>
                    </div>
                    <div className="col-8">{user.numeroTelefono}</div>
                  </div>
                </div>
              </div>

              <div
                className="alert alert-warning d-flex align-items-center mt-3"
                role="alert"
              >
                <i className="fas fa-exclamation-triangle me-2"></i>
                <small>Esta acción no se puede deshacer</small>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onHide}
            >
              <i className="fas fa-times me-1"></i>
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={onConfirm}
            >
              <i className="fas fa-trash me-1"></i>
              Eliminar Usuario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
