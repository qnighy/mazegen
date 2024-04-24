import React from "react";
import { jsx } from "react/jsx-runtime";
import { createRoot } from "react-dom/client";

function App() {
  return jsx("div", { children: "Hello, world!" });
}

const root = createRoot(document.getElementById("app"));
root.render(jsx(App, {}));
