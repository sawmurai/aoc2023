import fs from "fs";

const content = fs.readFileSync("./data.txt", { encoding: "utf-8" });

const numbers = content.split("\n").reduce(
  (acc, cur) => {
    const parts = cur.trim().split("  ");

    if (parts.length === 2) {
      acc[0].push(Number(parts[0].trim()));
      acc[1].push(Number(parts[1].trim()));
    }

    return acc;
  },
  [[], []],
);

numbers[0].sort();
numbers[1].sort();

let sum = 0;
for (let i = 0; i < numbers[0].length; i++) {
  sum += Math.abs(numbers[0][i] - numbers[1][i]);
}

console.log(sum);
