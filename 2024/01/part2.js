import fs from "fs";

const content = fs.readFileSync("./data.txt", { encoding: "utf-8" });

const numbers = content.split("\n").reduce(
  (acc, cur) => {
    const parts = cur.trim().split("  ");

    if (parts.length === 2) {
      acc[0].set(Number(parts[0].trim()), 0);
      acc[1].push(Number(parts[1].trim()));
    }

    return acc;
  },
  [new Map(), []],
);

numbers[1].sort();

let sum = 0;
for (let i = 0; i < numbers[1].length; i++) {
  const n = numbers[1][i];
  const has = numbers[0].get(n) !== undefined;

  if (has) {
    numbers[0].set(n, numbers[0].get(n) + 1);
  }
}

sum = numbers[0].toArray().reduce((acc, [v, k]) => acc + v * k, 0);

console.log(sum);
