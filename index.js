// @ts-check

import React from "react";
import { jsx } from "react/jsx-runtime";
import { createRoot } from "react-dom/client";

function App() {
  return jsx("div", { children: "Hello, world!" });
}

/**
 *
 * @template T
 * @param {T} x
 * @returns {NonNullable<T>}
 */
function ensurePresence(x) {
  if (x == null) {
    throw new Error("Unexpected nullish");
  }
  return x;

}

const root = createRoot(ensurePresence(document.getElementById("app")));
root.render(jsx(App, {}));
