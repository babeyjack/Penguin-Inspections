import { useState } from "react";
import Button from "../StandardComponents/Button";
import LogoImage from "../StandardComponents/LogoImage";
import "../../../node_modules/bootstrap/dist/js/bootstrap.min.js";

interface Props {
  mainItems: string[][];
  endItems: string[][];
  preSelected?: number;
  onSelectItem: (index: number) => void;
}

const NavigationBar = ({
  mainItems,
  endItems,
  preSelected = 0,
  onSelectItem,
}: Props) => {
  const [selectedIndex, setSelectedIndex] = useState(preSelected);

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
      <div className="container-fluid">
        <a className="navbar-brand w-25 p-1" href="/" style={{ maxWidth: 175 }}>
          <LogoImage />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarToggleExternalContent"
          aria-controls="navbarToggleExternalContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse"
          id="navbarToggleExternalContent"
        >
          <ul className="nav nav-underline me-auto mb-2 mb-lg-0">
            {mainItems.map((item, index) => (
              <li className="nav-item" key={"li" + index}>
                <a
                  className={
                    selectedIndex == index
                      ? "nav-link link-dark active"
                      : "nav-link link-dark"
                  }
                  key={index}
                  onClick={() => {
                    setSelectedIndex(index);
                    onSelectItem(index);
                  }}
                >
                  {item[0]}
                </a>
              </li>
            ))}
          </ul>
          {endItems.map((item, index) => (
            <div className="p-1" key={"div" + index + mainItems.length}>
              <Button
                colour={
                  selectedIndex == index + mainItems.length
                    ? "primary"
                    : "outline-primary"
                }
                onClick={() => {
                  setSelectedIndex(index + mainItems.length);
                  onSelectItem(index + mainItems.length);
                }}
                key={index + mainItems.length}
              >
                {item[0]}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
