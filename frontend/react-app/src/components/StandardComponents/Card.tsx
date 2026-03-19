import { type JSX } from "react";

interface Props {
  header?: JSX.Element | JSX.Element[] | string;
  children: JSX.Element | JSX.Element[] | string;
  footer?: JSX.Element | JSX.Element[] | string;
  classes?: string;
  style?: React.CSSProperties;
}

const Card = ({
  header = "",
  children = "This is a card!",
  footer = "",
  classes = "",
  style = { display: "block" },
}: Props) => {
  return (
    <>
      <div className={"card" + (classes && " " + classes)} style={style}>
        <div className={"card-header" + (!header ? " d-none " : " ")}>
          {header}
        </div>
        <div className="card-body">{children}</div>
        <div className={"card-footer" + (!footer ? " d-none" : "")}>
          {footer}
        </div>
      </div>
    </>
  );
};

export default Card;
