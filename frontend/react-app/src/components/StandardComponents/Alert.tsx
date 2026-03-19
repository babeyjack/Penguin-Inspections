import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  colour?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark";
  dismissable?: boolean;
  onClose?: () => void;
}

const Alert = ({
  children,
  colour = "primary",
  dismissable,
  onClose,
}: Props) => {
  return (
    <div
      className={
        dismissable
          ? "alert-dismissible alert alert-" + colour + " fade show"
          : "alert alert-" + colour + " fade show"
      }
    >
      {children}
      {dismissable && (
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
          onClick={onClose}
        ></button>
      )}
    </div>
  );
};

export default Alert;
