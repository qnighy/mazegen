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
  const uf = new UnionFind(w * h * 2);
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} f
   */
  function vid(x, y, f) {
    return (y * w + x) * 2 + f;
  }

  /**
   * @typedef Edge
   * @property {number} x
   * @property {number} y
   * @property {0 | 1} dir
   * @property {0 | 1} floor0
   * @property {0 | 1} floor1
   */
  /** @type {Edge[]} */
  const edges = [];
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      for (const floor0 of /** @type {const} */ ([0, 1])) {
        for (const floor1 of /** @type {const} */ ([0, 1])) {
          if (x + 1 < w) {
            edges.push({
              x,
              y,
              dir: 0,
              floor0,
              floor1,
            });
          }
          if (y + 1 < h) {
            edges.push({
              x,
              y,
              dir: 1,
              floor0,
              floor1,
            });
          }
        }
      }
    }
  }
  shuffle(edges);
  for (const edge of edges) {
    if (edge.dir === 0) {
      if (grid[edge.x][edge.y].conn[RIGHT] > 0) {
        continue;
      }
      const v0 = vid(edge.x, edge.y, edge.floor0);
      const v1 = vid(edge.x + 1, edge.y, edge.floor1);
      if (uf.unify(v0, v1)) {
        grid[edge.x][edge.y].conn[RIGHT] = /** @type {1 | 2} */ (1 << edge.floor0);
        grid[edge.x + 1][edge.y].conn[LEFT] = /** @type {1 | 2} */ (1 << edge.floor1);
      }
    } else {
      if (grid[edge.x][edge.y].conn[DOWN] > 0) {
        continue;
      }
      const v0 = vid(edge.x, edge.y, edge.floor0);
      const v1 = vid(edge.x, edge.y + 1, edge.floor1);
      if (uf.unify(v0, v1)) {
        grid[edge.x][edge.y].conn[DOWN] = /** @type {1 | 2} */ (1 << edge.floor0);
        grid[edge.x][edge.y + 1].conn[UP] = /** @type {1 | 2} */ (1 << edge.floor1);
      }
    }
  }

  {
    /** @type {[number, number][]} */
    const cells = [];
    for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) {
        cells.push([x, y]);
      }
    }
    shuffle(cells);
    for (const cell of cells) {
      const [x, y] = cell;
      const v0 = vid(x, y, 0);
      const v1 = vid(x, y, 1);
      if (uf.unify(v0, v1)) {
        for (const [dir] of DIRS) {
          if (grid[x][y].conn[dir] === 2) {
            grid[x][y].conn[dir] = 1;
          }
        }
      }
    }
    for (const cell of cells) {
      const [x, y] = cell;
      let countPos = 0;
      let countNeg = 0;
      for (const [dir, odir, dx, dy] of DIRS) {
        if (grid[x][y].conn[dir] === 0) continue;
        if (grid[x][y].conn[dir] === grid[x + dx][y + dy].conn[odir]) {
          countPos++;
        } else {
          countNeg++;
        }
      }
      if (countPos < countNeg) {
        for (const [dir] of DIRS) {
          if (grid[x][y].conn[dir] === 2) {
            grid[x][y].conn[dir] = 1;
          } else if (grid[x][y].conn[dir] === 1) {
            grid[x][y].conn[dir] = 2;
          }
        }
      }
    }
  }

  return grid;
}

/** @type {[number, number, number, number][]} */
const DIRS = [
  [RIGHT, LEFT, 1, 0],
  [DOWN, UP, 0, 1],
  [LEFT, RIGHT, -1, 0],
  [UP, DOWN, 0, -1],
];

/**
 * @template T
 * @param {T[]} arr
 */
function shuffle(arr) {
  for (let i = arr.length - 1; i >= 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

class UnionFind {
  /** @type {number[]} */
  v;
  /**
   * @param {number} size
   */
  constructor(size) {
    this.v = new Array(size).fill(null).map(() => -1);
  }

  /** @param {number} x */
  root(x) {
    return this.v[x] < 0 ? x : this.v[x] = this.root(this.v[x]);
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  eq(x, y) {
    return this.root(x) === this.root(y);
  }

  /**
   * @param {number} x
   * @param {number} y
   * @returns {boolean}
   */
  unify(x, y) {
    x = this.root(x);
    y = this.root(y);
    if (x === y) {
      return false;
    }
    if (this.v[x] < this.v[y]) {
      [x, y] = [y, x];
    }
    this.v[y] += this.v[x];
    this.v[x] = y;
    return true;
  }
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
