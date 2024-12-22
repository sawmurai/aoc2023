import fs from "fs";

const content = fs.readFileSync("./data.txt", { encoding: "utf-8" });

const checkUp = (parts, joker) => {
  const l = parts.length;

  for (let i = 1; i < l; i++) {
    if (parts[i] <= parts[i - 1] || parts[i - 1] - parts[i] < -3) {
      return joker && (checkUp(parts.toSpliced(i-1, 1), false) || checkUp(parts.toSpliced(i, 1), false));
    }
  }
  return true;
};

const checkDown = (parts, joker) => {
  const l = parts.length;

  for (let i = 1; i < l; i++) {
    if (parts[i] >= parts[i - 1] || parts[i - 1] - parts[i] > 3) {
      return joker && (checkDown(parts.toSpliced(i-1, 1), false) || checkDown(parts.toSpliced(i, 1), false));
    }
  }

  return true;
};

 const sum = content.split("\n").reduce((acc, cur) => {
   const parts = cur.trim().split(" ").map(Number);

   // if (checkUp(parts) || checkDown(parts)) console.log(cur)

   return acc + (checkUp(parts, true) || checkDown(parts, true) ? 1 : 0);
 }, 0);

console.log(checkUp([1, 3, 5, 8, 9], true),);
//console.log(checkUp([99, 3, 5, 8, 9], true),);
console.log(checkUp([1, 99, 3, 6, 9], true),);
console.log(checkUp([1, 3, 99, 6, 9], true),);
console.log(checkUp([1, 3, 6, 99, 9], true),);
console.log(checkUp([1, 3, 5, 6, 99], true),);

console.log(checkUp([99, 99, 6, 8, 9], true),);
console.log(checkUp([1, 99, 99, 2, 3], true),);
console.log(checkUp([1, 3, 99, 99, 9], true),);
console.log(checkUp([1, 3, 5, 99, 99], true),);
console.log(checkUp([99, 3, 5, 8, 99], true),);

console.log(checkUp([ 3, 5, 8, 9 ], true))
console.log(sum);