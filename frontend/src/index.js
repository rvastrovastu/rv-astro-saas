import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./globals.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("ROOT DIV NOT FOUND in public/index.html");
}

const root = ReactDOM.createRoot(rootElement);

root.render(<App />);