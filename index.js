// @ts-check

import React from "react";
import { jsx } from "react/jsx-runtime";
import { createRoot } from "react-dom/client";

function App() {
  return jsx("div", {
    children: [
      jsx("h1", { key: "h1", children: "Hello, world!" }),
      jsx(Grid, { key: "grid" }),
    ],
  });
}

function Grid() {
  const [grid] = React.useState(() => genGrid());
  const cellWidth = 30;
  const strokeWidth = 1;
  const pathWidth = 0.8
  const r = (cellWidth * pathWidth) / 2;
  const strokeColor = "#222";
  const fillColor = "#eefc";
  return jsx(
    "svg",
    {
      width: 500,
      height: 500,
      viewBox: "0 0 500 500",
      xmlns: "http://www.w3.org/2000/svg",
      children: grid.flatMap((col, x) =>
        col.flatMap((cell, y) => {
          /**
           * @param {number} dir
           * @param {number} rx
           * @param {number} ry
           * @returns {string}
           */
          function relative(dir, rx, ry) {
            const [dx, dy] = rotate(dir, rx, ry);
            return `${cellWidth * (x + 0.5 + dx) + strokeWidth / 2} ${cellWidth * (y + 0.5 + dy) + strokeWidth / 2}`
          }
          /** @type {React.ReactNode[]} */
          const objects = [];
          if (cell.conn.every((c) => c === 0)) {
            // draw circle in the cell
            objects.push(jsx("circle", {
              key: `${x}-${y}-circle`,
              cx: cellWidth * (x + 0.5) + strokeWidth / 2,
              cy: cellWidth * (y + 0.5) + strokeWidth / 2,
              r: cellWidth * pathWidth / 2,
              stroke: strokeColor,
              fill: fillColor,
            }));
          } else {
            for (const i of [0, 1]) {
              const conn = cell.conn.map((c) => Boolean((c >> i) & 1));
              if (conn.every((c) => !c)) {
                continue;
              }
              const connCount = conn.reduce((acc, c) => acc + (c ? 1 : 0), 0);
              if (connCount === 1) {
                const dir = conn.indexOf(true);
                const commands = [
                  `M ${relative(dir, 0.5, pathWidth / 2)}`,
                  `L ${relative(dir, 0, pathWidth / 2)}`,
                  `A ${r} ${r} 0 0 1 ${relative(dir, -pathWidth / 2, 0)}`,
                  `A ${r} ${r} 0 0 1 ${relative(dir, 0, -pathWidth / 2)}`,
                  `L ${relative(dir, 0.5, -pathWidth / 2)}`,
                ];
                objects.push(jsx("path", {
                  key: `${x}-${y}-lv${i}-cap`,
                  d: commands.join(" "),
                  stroke: strokeColor,
                  fill: fillColor,
                }));
              } else if (connCount === 2 && conn[0] === conn[2]) {
                const dir = conn.indexOf(true);
                const commands1 = [
                  `M ${relative(dir, -0.5, -pathWidth / 2)}`,
                  `L ${relative(dir, 0.5, -pathWidth / 2)}`,
                  `L ${relative(dir, 0.5, pathWidth / 2)}`,
                  `L ${relative(dir, -0.5, pathWidth / 2)}`,
                ];
                objects.push(jsx("path", {
                  key: `${x}-${y}-lv${i}-straight-fill`,
                  d: commands1.join(" "),
                  stroke: "none",
                  fill: fillColor,
                }));
                const commands2 = [
                  `M ${relative(dir, -0.5, -pathWidth / 2)}`,
                  `L ${relative(dir, 0.5, -pathWidth / 2)}`,
                  `M ${relative(dir, 0.5, pathWidth / 2)}`,
                  `L ${relative(dir, -0.5, pathWidth / 2)}`,
                ];
                objects.push(jsx("path", {
                  key: `${x}-${y}-lv${i}-straight-stroke`,
                  d: commands2.join(" "),
                  stroke: strokeColor,
                  fill: "none",
                }));
              } else if (connCount === 2) {
                const dir = conn[0] && conn[3] ? 3 : conn.indexOf(true);
                const commands1 = [
                  `M ${relative(dir, 0.5, pathWidth / 2)}`,
                  `L ${relative(dir, pathWidth / 2, pathWidth / 2)}`,
                  `L ${relative(dir, pathWidth / 2, 0.5)}`,
                  `L ${relative(dir, -pathWidth / 2, 0.5)}`,
                  `L ${relative(dir, -pathWidth / 2, 0)}`,
                  `A ${r} ${r} 0 0 1 ${relative(dir, 0, -pathWidth / 2)}`,
                  `L ${relative(dir, 0.5, -pathWidth / 2)}`,
                ];
                objects.push(jsx("path", {
                  key: `${x}-${y}-lv${i}-curve-fill`,
                  d: commands1.join(" "),
                  stroke: "none",
                  fill: fillColor,
                }));
                const commands2 = [
                  `M ${relative(dir, 0.5, pathWidth / 2)}`,
                  `L ${relative(dir, pathWidth / 2, pathWidth / 2)}`,
                  `L ${relative(dir, pathWidth / 2, 0.5)}`,
                  `M ${relative(dir, -pathWidth / 2, 0.5)}`,
                  `L ${relative(dir, -pathWidth / 2, 0)}`,
                  `A ${r} ${r} 0 0 1 ${relative(dir, 0, -pathWidth / 2)}`,
                  `L ${relative(dir, 0.5, -pathWidth / 2)}`,
                ];
                objects.push(jsx("path", {
                  key: `${x}-${y}-lv${i}-curve-stroke`,
                  d: commands2.join(" "),
                  stroke: strokeColor,
                  fill: "none",
                }));
              } else if (connCount === 3) {
                const dir = (conn.indexOf(false) + 1) % 4;
                const commands1 = [
                  `M ${relative(dir, 0.5, pathWidth / 2)}`,
                  `L ${relative(dir, pathWidth / 2, pathWidth / 2)}`,
                  `L ${relative(dir, pathWidth / 2, 0.5)}`,
                  `L ${relative(dir, -pathWidth / 2, 0.5)}`,
                  `L ${relative(dir, -pathWidth / 2, pathWidth / 2)}`,
                  `L ${relative(dir, -0.5, pathWidth / 2)}`,
                  `L ${relative(dir, -0.5, -pathWidth / 2)}`,
                  `L ${relative(dir, 0.5, -pathWidth / 2)}`,
                ];
                objects.push(jsx("path", {
                  key: `${x}-${y}-lv${i}-t-fill`,
                  d: commands1.join(" "),
                  stroke: "none",
                  fill: fillColor,
                }));
                const commands2 = [
                  `M ${relative(dir, 0.5, pathWidth / 2)}`,
                  `L ${relative(dir, pathWidth / 2, pathWidth / 2)}`,
                  `L ${relative(dir, pathWidth / 2, 0.5)}`,
                  `M ${relative(dir, -pathWidth / 2, 0.5)}`,
                  `L ${relative(dir, -pathWidth / 2, pathWidth / 2)}`,
                  `L ${relative(dir, -0.5, pathWidth / 2)}`,
                  `M ${relative(dir, -0.5, -pathWidth / 2)}`,
                  `L ${relative(dir, 0.5, -pathWidth / 2)}`,
                ];
                objects.push(jsx("path", {
                  key: `${x}-${y}-lv${i}-t-stroke`,
                  d: commands2.join(" "),
                  stroke: strokeColor,
                  fill: "none",
                }));
              } else if (connCount === 4) {
                const dir = 0;
                const commands1 = [
                  `M ${relative(dir, 0.5, pathWidth / 2)}`,
                  `L ${relative(dir, pathWidth / 2, pathWidth / 2)}`,
                  `L ${relative(dir, pathWidth / 2, 0.5)}`,
                  `L ${relative(dir, -pathWidth / 2, 0.5)}`,
                  `L ${relative(dir, -pathWidth / 2, pathWidth / 2)}`,
                  `L ${relative(dir, -0.5, pathWidth / 2)}`,
                  `L ${relative(dir, -0.5, -pathWidth / 2)}`,
                  `L ${relative(dir, -pathWidth / 2, -pathWidth / 2)}`,
                  `L ${relative(dir, -pathWidth / 2, -0.5)}`,
                  `L ${relative(dir, pathWidth / 2, -0.5)}`,
                  `L ${relative(dir, pathWidth / 2, -pathWidth / 2)}`,
                  `L ${relative(dir, 0.5, -pathWidth / 2)}`,
                ];
                objects.push(jsx("path", {
                  key: `${x}-${y}-lv${i}-x-fill`,
                  d: commands1.join(" "),
                  stroke: "none",
                  fill: fillColor,
                }));
                const commands2 = [
                  `M ${relative(dir, 0.5, pathWidth / 2)}`,
                  `L ${relative(dir, pathWidth / 2, pathWidth / 2)}`,
                  `L ${relative(dir, pathWidth / 2, 0.5)}`,
                  `M ${relative(dir, -pathWidth / 2, 0.5)}`,
                  `L ${relative(dir, -pathWidth / 2, pathWidth / 2)}`,
                  `L ${relative(dir, -0.5, pathWidth / 2)}`,
                  `M ${relative(dir, -0.5, -pathWidth / 2)}`,
                  `L ${relative(dir, -pathWidth / 2, -pathWidth / 2)}`,
                  `L ${relative(dir, -pathWidth / 2, -0.5)}`,
                  `M ${relative(dir, pathWidth / 2, -0.5)}`,
                  `L ${relative(dir, pathWidth / 2, -pathWidth / 2)}`,
                  `L ${relative(dir, 0.5, -pathWidth / 2)}`,
                ];
                objects.push(jsx("path", {
                  key: `${x}-${y}-lv${i}-x-stroke`,
                  d: commands2.join(" "),
                  stroke: strokeColor,
                  fill: "none",
                }));
              }
            }
          }
          return objects;
        })
      ),
    }
  );
}

/**
 * @typedef CellData
 * @property {(0 | 1 | 2)[]} conn
 */

const RIGHT = 0;
const DOWN = 1;
const LEFT = 2;
const UP = 3;

/**
 * @returns {CellData[][]}
 */
function genGrid() {
  const w = 10;
  const h = 15;
  /** @type {CellData[][]} */
  const grid = new Array(w).fill(null).map(() => new Array(h).fill(null).map(() => ({ conn: [0, 0, 0, 0] })));
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      if (x > 0 && Math.random() < 0.5) {
        grid[x][y].conn[LEFT] = Math.random() < 0.5 ? 1 : 2;
        grid[x - 1][y].conn[RIGHT] = Math.random() < 0.5 ? 1 : 2;
      }
      if (y > 0 && Math.random() < 0.5) {
        grid[x][y].conn[UP] = Math.random() < 0.5 ? 1 : 2;
        grid[x][y - 1].conn[DOWN] = Math.random() < 0.5 ? 1 : 2;
      }
    }
  }
  return grid;
}

/**
 *
 * @param {number} dir
 * @param {number} x
 * @param {number} y
 * @returns [number, number]
 */
function rotate(dir, x, y) {
  switch (dir % 4) {
    case RIGHT:
      return [x, y];
    case DOWN:
      return [-y, x];
    case LEFT:
      return [-x, -y];
    default:
      return [y, -x];
  }
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
