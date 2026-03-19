import type { JSX } from "react";

interface Props {
  children: JSX.Element | JSX.Element[] | string;
  colour?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark"
    | "link"
    | "outline-primary"
    | "outline-secondary"
    | "outline-success"
    | "outline-danger"
    | "outline-warning"
    | "outline-info"
    | "outline-light"
    | "outline-dark";
  onClick?: () => void;
}

const Button = ({
  children,
  colour = "primary",
  onClick = () => console.log("Clicked"),
}: Props) => {
  return (
    <button className={"btn btn-" + colour} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
