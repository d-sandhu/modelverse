import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Root } from "./App";
import "./styles.css";
const element = document.getElementById("root");
if (element === null) throw new Error("Missing #root element");
createRoot(element).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
