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

    queue({y, x: x+1, path: [...path, '>']});
    queue({y: y-1, x, path: [...path, '^']});
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


const splitSequence = (seq) => {
  let current = [];
  const collect = [];

  for (const s of seq) {
    current.push(s);
    if (s === 'A') {
      collect.push(current);
      current = [];
    }
  }

  return collect;
}

const cache = new Map();
const iter = (inputSequence, level) => {
  if (level === 0) {
    return inputSequence.length;
  }

  let len = 0;
  for (let p of splitSequence(inputSequence)) {
    const cacheKey = `${level}-${p}`;
    if (cache.has(cacheKey)) {
      len += cache.get(cacheKey);
    } else {
      // < becomes <v<A
      const resolved = getSequenceInstructions(keyPad, p);
      const lengthFromHere = iter(resolved, level - 1);
      len += lengthFromHere;
      cache.set(cacheKey, lengthFromHere);
    }
  }

  return len;
}

const exampleOut = content.reduce((col, cur) => {
  // mit 2 klappt part 1 (3 robots)
  // mit
  return col + parseInt(cur, 10) * iter(getSequenceInstructions(numPad, cur), 2);
}, 0);

console.log(exampleOut);