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

function generateCombinations(arrays) {
  // Helper function to generate combinations recursively
  function combine(prefix, remainingArrays) {
      if (remainingArrays.length === 0) {
          // Base case: no more arrays to combine, return the current prefix
          return [prefix];
      }

      // Get the first array and the rest of the arrays
      const [firstArray, ...restArrays] = remainingArrays;
      const combinations = [];

      // Loop through each element of the first array
      for (const element of firstArray) {
          // Recursively combine the current element with the rest
          combinations.push(...combine([...prefix, element], restArrays));
      }

      return combinations;
  }

  // Start with an empty prefix and the full array of arrays
  return combine([], arrays);
}

const padDistance = (pad, pos, target) => {
  let shortest;
  const allPaths = [];
  const prio = Array(100).fill(undefined).map(_ => []);
  const hist = new Map();
  const targetPosition = findKey(pad, target);

  const queue = (op, penalty) => {
    if (pad[op.y]?.[op.x] === undefined) return;

    const dist = Math.abs(targetPosition.x - op.x) + Math.abs(targetPosition.y - op.y);

    prio[dist + (penalty ? 1 : 0)].push(op);
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
    const {y, x, path, dir} = currentOp;
    if (hist.has(pad[y][x]) && hist.get(pad[y][x]) < path.length) {
      continue;
    }

    hist.set(pad[y][x], path.length)

    if (pad[y][x] === target) {
      if (shortest === undefined || path.length < shortest.length) {
        shortest = path;
      }
      allPaths.push(path);

      continue;
    }

    queue({y: y+1, x, path: [...path, 'v'], dir: 'v'}, !!dir && dir !== 'v');
    queue({y, x: x+1, path: [...path, '>'], dir: '>'}, !!dir && dir !== '>');
    queue({y: y-1, x, path: [...path, '^'], dir: '^'}, !!dir && dir !== '^');
    queue({y, x: x-1, path: [...path, '<'], dir: '<'}, !!dir && dir !== '<');
  } while (currentOp = next());

  return allPaths.filter(p => p.length === shortest.length).map(p => [...p, 'A']);
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
    const shortestPaths = padDistance(pad, current, key);

    paths.push(shortestPaths);

    current = findKey(pad, key);
  }

  return generateCombinations(paths).map(p => p.flat());
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

    let minOfSeq = Infinity;
    // Instructions for what robot in depressurized has to type
    const numPathOptions = getSequenceInstructions(numPad, seq);


    // Instructions for what robot in radiation has to type
    for (const numPath of numPathOptions) {
      // console.log(numPath)
      const dirPad1Options = getSequenceInstructions(keyPad, numPath);

      // Instructions for what robot in -40 degrees has to type
      for (const dirPad1 of dirPad1Options) {
        const dirPad2Options = getSequenceInstructions(keyPad, dirPad1);

        for (const dirPad2 of dirPad2Options) {
          // console.assert(reverse(dirPad2) == seq, 'reverse(dirPad2) failed', reverse(dirPad2), seq);
          // console.log('Instructions for robot at numpad', numPath)
          // console.log('Instruction for robot in radiation (controlling numpad robot)', dirPad1)
          // console.log('Instruction for -40 degree robot (controlling radiation robot)', dirPad2)

          //seq == seqs[0] && console.assert(firstExSeq === dirPad2.join(''), dirPad2.join(''))
          // console.log(dirPad2.join(''), dirPad2.length)
          minOfSeq = Math.min(dirPad2.length * parseInt(seq, 10), minOfSeq)
        }
      }
    }
    s += minOfSeq;
    console.log(seq)
  }

  return s;
}

                  //<v<A>A<A>>^AvAA<^A>A
const result = run(content);
console.assert(result === 126384, result);

// console.log(padDistance(numPad, findKey(numPad, 'A'), '0'))
//console.log(padDistance(keyPad, findKey(keyPad, 'A'), '<'))

// <v<A>>^AvA^A<vA<AA>>^AAvA<^A>AAvA^A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A
// v<<A>>^AvA^Av<<A>>^AAv<A<A>>^AAvAA^<A>Av<A^>AA<A>Av<A<A>>^AAA<Av>A^A