const content = `129A
540A
789A
596A
582A`.split('\n');

const example = `029A
980A
179A
456A
379A`.split('\n');

const keyPad = [[undefined, '^', 'A'], ['<', 'v', '>']];
const numPad = [['7','8','9'], ['4','5','6'], ['1','2','3'], [undefined, '0', 'A']];

const padDistance = (pad, pos, target) => {
  let shortest;
  const allPaths = [];
  const prio = Array(100).fill(undefined).map(_ => []);
  const hist = new Map();
  const targetPosition = findKey(pad, target);

  const queue = (op) => {
    if (pad[op.y]?.[op.x] === undefined) return;

    const dist = Math.abs(targetPosition.x - op.x) + Math.abs(targetPosition.y - op.y);

    prio[dist].push(op);
  }

  const next = () => {
    for (const q of prio) {
      if (q.length > 0) {
        return q.pop();
      }
    }
  }

  let currentOp = {y: pos.y, x: pos.x, target, path: [], dir: undefined};
  do {
    const {y, x, path} = currentOp;
    if (hist.has(pad[y][x]) && hist.get(pad[y][x]) < path.length) {
      continue;
    }

    hist.set(pad[y][x], path.length)

    if (pad[y][x] === target) {
      if (!shortest || path.length < shortest.length) {
        shortest = path;
      }
      allPaths.push(path);

      continue;
    }

    queue({y: y-1, x, path: [...path, '^']});
    queue({y, x: x+1, path: [...path, '>']});
    queue({y: y+1, x, path: [...path, 'v']});
    queue({y, x: x-1, path: [...path, '<']});
  } while (currentOp = next());

  const bestPaths = allPaths.filter(p => p.length === shortest.length).toSorted((p1, p2) => {
    let p1Turns = 0;
    let p2Turns = 0;
    for (let i = 1; i < p1.length; i++) {
      if (p1[i] !== p1[i-1]) {
        p1Turns++;
      }
    }

    for (let i = 1; i < p2.length; i++) {
      if (p2[i] !== p2[i-1]) {
        p2Turns++;
      }
    }

    return p1Turns - p2Turns;
  })

  return bestPaths[0];
}

const findKey = (pad, key) => {
  for (let y = 0; y < pad.length; y++) {
    for (let x = 0; x < pad[y].length; x++) {
      if (pad[y][x] === key) {
        return {y, x};
      }
    }
  }
}

const getSequenceInstructions = (pad, sequence) => {
  let current = findKey(pad, 'A');

  const paths = [];
  for (const key of sequence) {
    const p = padDistance(pad, current, key);
    p.push('A');
    paths.push(p);
    current = findKey(pad, key);
  }

  return paths.flat();
}

const pressPad = (pad, seq) => {
  const out = [];
  const pos = findKey(pad, 'A');
  for (const s of seq) {
    switch (s) {
      case '^':
        pos.y--;
      break;
      case '>':
        pos.x++;
      break;
      case 'v':
        pos.y++;
      break;
      case '<':
        pos.x--;
      break;
      case 'A':
        out.push(pad[pos.y][pos.x])
      break;
    }
  }

  console.assert(seq.at(-1) == 'A')
  return out;
}

const reverse = (seq) => {
  const l0 = pressPad(keyPad, seq);
  const l1 = pressPad(keyPad, l0);
  const l2 = pressPad(numPad, l1);
  return l2.join('');
}

const firstExSeq = '<vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A';
                 // v<A<AA>>^AvAA^<A>Av<<A>>^AvA^Av<<A>>^AAv<A>A^A<A>Av<A<A>>^AAA<Av>A^A

const run = (seqs) => {
  let s = 0;
  for (const seq of seqs) {
    // Instructions for what robot in depressurized has to type
    const numPath = getSequenceInstructions(numPad, seq);

    // Instructions for what robot in radiation has to type
    const dirPad1 = getSequenceInstructions(keyPad, numPath);

    // Instructions for what robot in -40 degrees has to type
    const dirPad2 = getSequenceInstructions(keyPad, dirPad1);

    console.assert(reverse(dirPad2) == seq, 'reverse(dirPad2) failed', reverse(dirPad2), seq);
    // console.log('Instructions for robot at numpad', numPath)
    // console.log('Instruction for robot in radiation (controlling numpad robot)', dirPad1)
    // console.log('Instruction for -40 degree robot (controlling radiation robot)', dirPad2)

    const sum = dirPad2.length * parseInt(seq, 10);
    s += sum;
  }

  return s;
}

const result = run(content);
console.assert(result === 184180, 'Content off by', result - 184180);
console.assert(run(example) === 126384, 'Example does not match');

// <v<A>>^A<vA<A>>^AAvAA<^A>A<v<A>>^AAvA^A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A
// <<vAA>A>^AAvA<^A>AvA^A<<vA>>^AAvA^A<vA>^AA<A>A<<vA>A>^AAAvA<^A>A
