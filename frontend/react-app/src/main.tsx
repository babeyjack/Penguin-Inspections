import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import Home from "./Home.tsx";
import App from "./App.tsx";
import Rent from "./Rent.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {location.href.split("/")[3] == "dashboard" ? (
      <App />
    ) : location.href.split("/")[3] == "rent" ? (
      <Rent />
    ) : (
      <Home />
    )}
  </StrictMode>
);
