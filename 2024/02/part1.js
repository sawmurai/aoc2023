import fs from "fs";

const content = fs.readFileSync("./data.txt", { encoding: "utf-8" });

const sum = content.split("\n").reduce(
  (acc, cur) => {
    const parts = cur.trim().split(" ").map(Number);

    const up = parts[0] < parts[1];

    for (let i = 1; i < parts.length; i++) {
      if (up) {
        if (parts[i] <= parts[i-1] || parts[i] > parts[i-1] + 3) {
          return acc + 0;
        }
      } else {
        // Next one is higher than last one (wrong direction) or
        if (parts[i] >= parts[i-1] || parts[i] + 3 < parts[i-1]) {
          return acc + 0;
        }
      }
    }

    console.log(cur)
    return acc + 1;
  },
  0,
);



console.log(sum);
