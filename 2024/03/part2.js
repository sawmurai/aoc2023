import fs from "fs";

let content = fs.readFileSync("./data.txt", { encoding: "utf-8" });

content = content.split('\n').join('')

const doChunks = content.split('do()').map((doChunk) =>doChunk.split("don't()")[0]);

let sum = 0;
for (const doCunk of doChunks) {
  for (const m of doCunk.matchAll(/mul\((\d+),(\d+)\)/g)) {
    // console.log(m)
    sum += Number(m[1]) * Number(m[2]);
  }
}

console.log(sum)