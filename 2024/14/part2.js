import fs from "node:fs";

let content = fs.readFileSync("./data.txt", { encoding: "utf-8" }).split("\n");


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

const renderSeconds = (seconds) => {
  const map = new Map();
  moveRobots(robots, seconds).forEach(
    ( robot) => {
      const key = `${robot.p.y}-${robot.p.x}`;

      if (!map.has(key)) {
        map.set(key, 0)
      }

      map.set(key, map.get(key) + 1)
    }
  );


  for (let y = 0; y < MAP_HEIGHT; y++) {
    let line = '';
    for (let x = 0; x < MAP_WIDTH; x++) {
      line += map.get(`${y}-${x}`) ?? '.';
    }
    console.log(line);
  }
}

let s = 0;
while (s < 10403) {
  console.log(s)
  renderSeconds(s++);

  continue;
  await new Promise(resolve => {
    setTimeout(resolve, 100)
  })
}
