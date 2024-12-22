import fs from "node:fs";

let content = fs.readFileSync("./data.txt", { encoding: "utf-8" }).split("\n");
let exampleContent = `p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3`.split("\n");

const robots = content.map((line) => {
  const parts = line.split(" ");
  const p1 = parts[0].split("=")[1].split(",");
  const p2 = parts[1].split("=")[1].split(",");

  return {
    p: {
      x: +p1[0]  ,
      y: +p1[1] ,
    },
    v: {
      x: +p2[0],
      y: +p2[1],
    },
  };
});

const MAP_HEIGHT = 103; // 103
const MAP_WIDTH = 101; // 101
const MIDDLE_Y = Math.floor(MAP_HEIGHT / 2);
const MIDDLE_X = Math.floor(MAP_WIDTH / 2);
const STEPS = 100;

const moveRobots = (robots, steps) => {
  return robots.map((robot) => {
    const x = (robot.p.x + (steps * robot.v.x)) % MAP_WIDTH;
    const y = (robot.p.y + (steps * robot.v.y)) % MAP_HEIGHT;

    return {
      p: {
        x: Math.abs(x < 0 ? MAP_WIDTH + x : x),
        y: Math.abs(y < 0 ? MAP_HEIGHT + y : y),
      },
      v: robot.v,
    };
  });
};

const map = new Map();

const robotsInQuadrant = moveRobots(robots).reduce(
  (quadrants, robot) => {
    const key = `${robot.p.y}-${robot.p.x}`;

    if (!map.has(key)) {
      map.set(key, 0)
    }

    map.set(key, map.get(key) + 1)
    if (robot.p.x < MIDDLE_X) {
      if (robot.p.y < MIDDLE_Y) {
        quadrants[0]++;
      } else if (robot.p.y > MIDDLE_Y) {
        quadrants[1]++;
      }
    } else if (robot.p.x > MIDDLE_X) {
      if (robot.p.y < MIDDLE_Y) {
        quadrants[2]++;
      } else if (robot.p.y > MIDDLE_Y) {
        quadrants[3]++;
      }
    }

    return quadrants;
  },
  [0, 0, 0, 0]
);

for (let y = 0; y < MAP_HEIGHT; y++) {
  let line = '';
  for (let x = 0; x < MAP_WIDTH; x++) {
    line += map.get(`${y}-${x}`) ?? '.';
  }
  console.log(line);
}

console.log(
  robotsInQuadrant[0] ,
    robotsInQuadrant[1] ,
    robotsInQuadrant[2] ,
    robotsInQuadrant[3],
  robotsInQuadrant[0] *
    robotsInQuadrant[1] *
    robotsInQuadrant[2] *
    robotsInQuadrant[3]
);
