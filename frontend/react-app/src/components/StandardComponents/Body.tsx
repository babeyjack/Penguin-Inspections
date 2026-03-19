import { type JSX } from "react";

interface Props {
  children: JSX.Element | JSX.Element[] | string;
  className?: string;
  style?: React.CSSProperties;
}

const Header = ({ children, className = "", style = {} }: Props) => {
  return (
    <div
      className={"page-body container-fluid py-3 " + className}
      style={style}
    >
      {children}
    </div>
  );
};

export default Header;
