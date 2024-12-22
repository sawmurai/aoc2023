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

  while (lines[i] !== "") map.push(lines[i++].split(""));
  while (i < lines.length) movements.push(lines[i++]);

  return [map, movements.join("")];
};

const executeMove = (map, move, robotPosition) => {

  let x = robotPosition.x;
  let y = robotPosition.y;

  const swap = (map, x, y, dir) => {
    let nextY = y;
    let nextX = x;

    switch (move) {
      case "<":
        nextX--;
        break;
      case "^":
        nextY--;
        break;
      case ">":
        nextX++;
        break;
      case "v":
        nextY++;
        break;
    }

    if (map[nextY][nextX] === ".") {
      [map[nextY][nextX], map[y][x]] = [map[y][x], map[nextY][nextX]];

      return true;
    } else if (map[nextY][nextX] === "O" && swap(map, nextX, nextY, dir)) {
      [map[nextY][nextX], map[y][x]] = [map[y][x], map[nextY][nextX]];

      return true;
    } else {
      return false;
    }
  };

  swap(map, x, y, move);

  return map
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
    map = executeMove(map, move, findRobot(map));
    // console.log(++i, move);
    // _printMap(map);
  }

  return map;
};

const run = (content) => {
  const [map, movements] = parseMapAndMovements(content);

  const finalMap = executeAllMoves(map, movements);

  let totalSumOfCoordinates = 0;
  for (let y = 0; y < finalMap.length; y++) {
    for (let x = 0; x < finalMap.length; x++) {
      if (finalMap[y][x] === "O")
        totalSumOfCoordinates += y * 100 + x;
    }
  }

  console.log(totalSumOfCoordinates);
};

run(["#######", "#.@.O.#", "#######", "", ">><<<<<"]);

// run([
//   '#######',
//   '#.O.@.#',
//   '#######',
//   '',
//   '<'
// ])
//
// run([
//   '#######',
//   '#.@...#',
//   '#.O...#',
//   '#.....#',
//   '#######',
//   '',
//   'v'
// ])
//
// run([
//   '#######',
//   '#.....#',
//   '#.O...#',
//   '#.@...#',
//   '#######',
//   '',
//   '^<^>'
// ])

run(content);
