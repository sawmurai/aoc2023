import fs from "node:fs";
import { isMainThread, BroadcastChannel, Worker, parentPort } from "node:worker_threads";
import os from 'node:os';

let content = fs.readFileSync("./data.txt", { encoding: "utf-8" }).split("\n");
let example = `1
10
100
2024`.split("\n");

const nextSecret = (secret) => {
  let newSecret = ((secret << 6n) ^ secret) % 16777216n;

  newSecret = ((newSecret >> 5n) ^ newSecret) % 16777216n;

  newSecret = ((newSecret << 11n) ^ newSecret) % 16777216n;

  return newSecret;
};

const calcOnes = (initial, iterations) => {
  let secret = initial;

  const ones = [];
  for (let i = 0; i < iterations; i++) {
    secret = nextSecret(secret);
    ones.push(Number(secret % 10n));
  }

  return ones;
};

const prepareSequences = () => {
  const sequences = [];

  for (let a = -9; a <= 9; a++) {
    for (let b = -9; b <= 9; b++) {
      for (let c = -9; c <= 9; c++) {
        for (let d = -9; d <= 9; d++) {
          sequences.push([a, b, c, d]);
        }
      }
    }
  }

  return sequences;
};

const buySequence = (monkey, sequence) => {
  for (let price = 4; price < monkey.length; price++) {
    if (
      monkey[price - 4] - monkey[price - 3] === sequence[0] &&
      monkey[price - 3] - monkey[price - 2] === sequence[1] &&
      monkey[price - 2] - monkey[price - 1] === sequence[2] &&
      monkey[price - 1] - monkey[price] === sequence[3]
    ) {
      return monkey[price];
    }
  }

  return 0;
};

const monkeys = (initalSecrets) => {
  return initalSecrets.map((secret) => calcOnes(BigInt(secret), 2000));
};


// 1696 is riiiight
if (isMainThread) {
  const sequences = prepareSequences();
  const monkeyPrices = monkeys(content);

  let maxSeqSum = 0;
  const numWorkers = os.cpus().length;
  const workers = Array.from(Array(numWorkers)).map(() => new Worker('./part2.js'));
  let received = 0;
  let sent = 0;

  workers.forEach(worker => {
    worker.on('message', (seqSum) => {
      received++;

      if (seqSum > maxSeqSum) {
        maxSeqSum = seqSum;
      }

      if (received % 1000 == 0) {
        process.stdout.clearLine(); // clear current text
        process.stdout.cursorTo(0);
        process.stdout.write("Progress " + received + " of " + sequences.length);
      }

      if (received === sequences.length) {
        workers.forEach(w => w.terminate());
        console.log(maxSeqSum);
      }
    });
    worker.postMessage({_t: 'init', monkeyPrices})
  });

  for (const seq of sequences) {
    workers[sent++ % numWorkers].postMessage({_t: 'calc', seq});
  }
} else {
  let monkeyPrices;
  parentPort.on('message', (msg) => {
    if (msg._t === 'init') {
      monkeyPrices = msg.monkeyPrices;
      return;
    }

    let seqSum = 0;
    for (const monkey of monkeyPrices) {
      seqSum += buySequence(monkey, msg.seq);
    }

    parentPort.postMessage(seqSum);
  });
}