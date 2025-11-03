import { useEffect } from "react";

const Toast = ({
  message,
  type = "success",
  show,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  const getToastClass = () => {
    switch (type) {
      case "success":
        return "text-bg-success";
      case "error":
        return "text-bg-danger";
      case "warning":
        return "text-bg-warning";
      case "info":
        return "text-bg-info";
      default:
        return "text-bg-success";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return "fas fa-check-circle";
      case "error":
        return "fas fa-exclamation-circle";
      case "warning":
        return "fas fa-exclamation-triangle";
      case "info":
        return "fas fa-info-circle";
      default:
        return "fas fa-check-circle";
    }
  };

  return (
    <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
      <div className={`toast show ${getToastClass()}`} role="alert">
        <div className="d-flex">
          <div className="toast-body d-flex align-items-center">
            <i className={`${getIcon()} me-2`}></i>
            {message}
          </div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            onClick={onClose}
          ></button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
