import fs from "node:fs";

let content = fs.readFileSync("./data.txt", { encoding: "utf-8" });

content = content.split("\n");

const frequencies = new Map();

for (let y = 0; y < content.length; y++) {
  for (let x = 0; x < content[y].length; x++) {
    if (content[y][x] === ".") {
      continue;
    }

    if (!frequencies.has(content[y][x])) {
      frequencies.set(content[y][x], []);
    }

    frequencies.get(content[y][x]).push({ x, y });
  }
}

const points = new Set();

const addPoint = (p) => {
  if (p.x < 0 || p.x >= content[0].length) {
    return;
  }

  if (p.y < 0 || p.y >= content.length) {
    return;
  }

  points.add(`${p.x}-${p.y}`);
};

const isSame = (p1, p2) => p1.x === p2.x && p1.y === p2.y;

for (const [key, value] of frequencies.entries()) {
  for (let i = 0; i < value.length; i++) {
    for (let y = 0; y < i; y++) {
      const xDistance = value[i].x - value[y].x;
      const yDistance = value[i].y - value[y].y;

      const p1 = { x: value[i].x + xDistance, y: value[i].y + yDistance };
      const p2 = { x: value[i].x - xDistance, y: value[i].y - yDistance };
      const p3 = { x: value[y].x + xDistance, y: value[y].y + yDistance };
      const p4 = { x: value[y].x - xDistance, y: value[y].y - yDistance };

      if (!isSame(p1, value[i]) && !isSame(p1, value[y])) addPoint(p1);
      if (!isSame(p2, value[i]) && !isSame(p2, value[y])) addPoint(p2);
      if (!isSame(p3, value[i]) && !isSame(p3, value[y])) addPoint(p3);
      if (!isSame(p4, value[i]) && !isSame(p4, value[y])) addPoint(p4);
    }
  }
}

console.log(points.size);
