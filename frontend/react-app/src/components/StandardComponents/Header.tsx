import { type JSX } from "react";

interface Props {
  children: JSX.Element | JSX.Element[] | string;
}

const Header = ({ children }: Props) => {
  return (
    <div className="page-header container-fluid mb-5 pb-5"> {children}</div>
  );
};

export default Header;
