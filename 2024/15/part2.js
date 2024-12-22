import fs from "node:fs";

let content = fs.readFileSync("./data.txt", { encoding: "utf-8" }).split("\n");
let exampleContent = `##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`.split(
  "\n"
);
let exampleSum = 10092;
let smallExampleContent = `########
#..O.O.#
##@.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

<^^>>>vv<v>>v<`.split("\n");
let smallExampleSum = 2028;

const parseMapAndMovements = (lines) => {
  let map = [];
  let movements = [];
  let i = 0;

  while (lines[i] !== "")
    map.push(
      lines[i++].split("").flatMap((c) => {
        if (c === "@") return "@.".split("");
        if (c === ".") return "..".split("");
        if (c === "O") return "[]".split("");
        if (c === "#") return "##".split("");
      })
    );
  while (i < lines.length) movements.push(lines[i++]);

  return [map, movements.join("")];
};

const verify = (finalMap) => {
  for (let y = 0; y < finalMap.length; y++) {
    for (let x = 0; x < finalMap[y].length; x++) {
      if (finalMap[y][x] === "[" && finalMap[y][x+1] !== "]") return false;
    }
  }

  return true;
}

const executeMove = (map, move, robotPosition) => {
  let x = robotPosition.x;
  let y = robotPosition.y;

  const swapTile = (map, y, x, nextY, nextX, testOnly) => {
    if (testOnly) {
      console.log("just testing"); return;
    };

    [map[nextY][nextX], map[y][x]] = [map[y][x], map[nextY][nextX]];
  }

  const swap = (map, x, y, dir, testOnly) => {
    let nextY = y;
    let nextX = x;

    switch (move) {
      case "<":
        nextX--;
        break;
      case ">":
        nextX++;
        break;
      case "v":
        nextY++;
        break;
      case "^":
        nextY--;
        break;
    }

    if (map[nextY][nextX] === ".") {
      swapTile(map, y, x, nextY, nextX, testOnly);

      return true;

    } else if (map[nextY][nextX] === "[" && nextY === y ) {
      // Horizontal <-

      if (swap(map, nextX, nextY, dir, testOnly)) {
        swapTile(map, y, x, nextY, nextX, testOnly);

        return true;
      }
    // Horizontal ->
    } else if (map[nextY][nextX] === "]" && nextY === y) {

      if (swap(map, nextX, nextY, dir, testOnly)) {
        swapTile(map, y, x, nextY, nextX, testOnly);

        return true;
      }
    // Vertical v, start of box
    } else if (map[nextY][nextX] === "[") {
      if (swap(map, nextX+1, nextY, dir, true) && swap(map, nextX, nextY, dir, testOnly) && swap(map, nextX+1, nextY, dir, testOnly)) {

        swapTile(map, y, x, nextY, nextX, testOnly);
        return true;
      }
    // Vertical v, end of box
    } else if (map[nextY][nextX] === "]") {
      if (swap(map, nextX-1, nextY, dir, true)&& swap(map, nextX, nextY, dir, testOnly)  && swap(map, nextX-1, nextY, dir, testOnly) ) {
        console.log("Swapping down")
        swapTile(map, y, x, nextY, nextX, testOnly);
        return true;
      }
    }

    return false;
  };

  swap(map, x, y, move);

  return map;
};

const _printMap = (map) => {
  console.log(map.map((l) => l.join("")).join("\n"));
};

const executeAllMoves = (map, moves) => {
  const findRobot = () => {
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] === "@") {
          return { x, y };
        }
      }
    }
  };

  let i = 0;
  for (const move of moves) {
    console.log(++i, move);
    map = executeMove(map, move, findRobot(map));

   // _printMap(map);
    if (!verify(map)) {
      _printMap(map);
     break;
    }

  }

  return map;
};

const run = (content) => {
  const [map, movements] = parseMapAndMovements(content);

  const finalMap = executeAllMoves(map, movements);

  let totalSumOfCoordinates = 0;
  for (let y = 0; y < finalMap.length; y++) {
    for (let x = 0; x < finalMap[y].length; x++) {
      if (finalMap[y][x] === "[") totalSumOfCoordinates += y * 100 + x;
    }
  }

  console.log(totalSumOfCoordinates);
};

// run([
//   "#######",
//   "#.@.O.#",
//   "#######", "", ">>>>>>>"]);

 // run([
 //   '#######',
 //   '#.O.@.#',
 // '#######',
 //   '',
 //   '<<<<<<<'
 // ])

 //run([
 //  '#######',
 //  '#.@...#',
 //  '#.O.O.#',
 //  '#.....#',
 //  '#.....#',
 //  '#######',
 //  '',
 //  '>vvvv'
 //])
////
 //run([
 //  '#######',
 //  '#.....#',
 //  '#.O...#',
 //  '#.@...#',
 //  '#######',
 //  '',
 //  '^'
 //])
 false && run([
   '#######',
   '#.@...#',
   '#.O.O.#',
   '#.O#..#',
   '#.....#',
   '#######',
   '',
   '<v>^>vvvv'
 ])
 false && run([
  '#######',
  '#.....#',
  '#OO@..#',
  '#.O#..#',
  '#.....#',
  '#######',
  '',
  '<'
])
run(content);
