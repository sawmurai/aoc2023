import fs from "node:fs";

let content = fs.readFileSync("./data.txt", { encoding: "utf-8" }).split("\n");
let example = `1
10
100
2024`.split("\n")

const nextSecret = (secret) => {
  let newSecret = ((secret << 6n) ^ secret) % 16777216n;

  newSecret = ((newSecret >> 5n) ^ newSecret) % 16777216n;

  newSecret = ((newSecret << 11n) ^ newSecret) % 16777216n;

  return newSecret;
}

const calcSecret = (initial, iterations) => {
  let secret = initial;
  for (let i=0; i<iterations; i++) {
    secret = nextSecret(secret);
  }

  return secret;
}

const sum = (initalSecrets) => {
  return initalSecrets.map(BigInt).reduce((col, cur) => {
    return col + calcSecret(cur, 2000);
  }, 0n);
};

console.log(sum(content))
