const testInput = `Register A: 117440
Register B: 0
Register C: 0
Program: 0,3,5,4,3,0`;

const testParse = {
    A: 117440,
    B: 0,
    C: 0,
    ins: [0,3,5,4,3,0]
}

const input = `Register A: 62769524
Register B: 0
Register C: 0
Program: 2,4,1,7,7,5,0,3,4,0,1,7,5,5,3,0`;

const inputParse = {
    A: 62769524n,
    B: 0n,
    C: 0n,
     ins: [2,4,1,7,7,5,0,3,4,0,1,7,5,5,3,0].map(BigInt)
    // ins: [2,4,1,2,7,5,4,5,1,3,5,5,0,3,3,0].map(BigInt)
}

const registers = {
    A: 0n,
    B: 0n,
    C: 0n
};

const combo = {
    0n: () => 0n,
    1n: () => 1n,
    2n: () => 2n,
    3n: () => 3n,
    4n: () => registers.A,
    5n: () => registers.B,
    6n: () => registers.C,
    7n: () => {throw "invalid";}
};

let ip = 0;
let out = [];
const op = {
    // adv
    0: (_combo) => {
        registers.A = registers.A / 2n ** combo[_combo]();
        ip += 2n;
    },
    // bxl
    1: (_lit) => {
        registers.B = registers.B ^ _lit;
        ip += 2n;
    },
    // bst
    2: (_combo) => {
        registers.B = combo[_combo]() % 8n;
        ip += 2n;
    },
    // jnz
    3: (_lit) => {
        if (registers.A === 0n) {
            ip += 2n;
            return;
        }
        ip = _lit;
    },
    // bxc
    4: (_) => {
        registers.B = registers.B ^ registers.C;
        ip += 2n;
    },
    // out
    5: (_combo) => {
        const v = combo[_combo]() % 8n;
        out.push(v);
        ip += 2n;
    },
    // bdv
    6: (_combo) => {
        registers.B = registers.A / 2n ** combo[_combo]();
        ip += 2n;
    },
    // cdv
    7: (_combo) => {
        registers.C = registers.A / 2n ** combo[_combo]();
        ip += 2n;
    }
}

const compute = (a) => {
  p = structuredClone(inputParse)
  p.A = a;

  return run(p);
}

const run = (p) => {
    ip = 0n;
    registers.A = p.A;
    registers.B = p.B;
    registers.C = p.C;
    out = [];

    do {
        op[p.ins[ip]](p.ins[ip + 1n]);
    } while (ip < p.ins.length);

    return out.join('');
}

const bruteforce = (p) => {
  let candidates = [0n];

  for (let i = 0; i < p.ins.length; i++) {
    const eos = p.ins.slice(-i - 1).join('');

    let nextCandidates = [];
    for (const val of candidates) {
      for (let n = 0; n < 10; n++) {
        let target = (val << BigInt(3)) + BigInt(n);

        let computedTarget = compute(target);

        if (computedTarget === eos) {
          console.log(target, computedTarget, eos)

          nextCandidates.push(target)
        }
      }
    }

    candidates = nextCandidates;
  }

  return candidates;
}

// 2,1,4,0,7,4,0,2,3
console.log(run(inputParse));
console.log(bruteforce(inputParse))