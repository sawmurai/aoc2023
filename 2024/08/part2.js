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

for (const [key, value] of frequencies.entries()) {
  for (let i = 0; i < value.length; i++) {
    for (let y = 0; y < i; y++) {
      const xDistance = value[i].x - value[y].x;
      const yDistance = value[i].y - value[y].y;

      let f = 0;
      do {
        addPoint({x: value[i].x + f * xDistance, y: value[i].y + f * yDistance});
        addPoint({x: value[y].x + f * xDistance, y: value[y].y + f * yDistance});
        addPoint({x: value[i].x - f * xDistance, y: value[i].y - f * yDistance});
        addPoint({x: value[y].x - f * xDistance, y: value[y].y - f * yDistance});
      } while (f++ < 1000)



    }
  }
}

console.log(points.size);
