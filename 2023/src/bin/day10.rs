use std::io::{self, BufRead};

#[derive(Clone, Debug)]
enum Direction {
    Up,
    Down,
    Left,
    Right,
}

#[derive(Clone, Debug)]
struct Pos {
    x: usize,
    y: usize,
    pointing: Direction,
}

impl PartialEq for Pos {
    fn eq(&self, other: &Self) -> bool {
        self.x == other.x && self.y == other.y
    }
}

impl Eq for Pos {}

impl Pos {
    fn new(x: usize, y: usize, pointing: Direction) -> Self {
        Self { x, y, pointing }
    }
    fn up(&self, pointing: Direction) -> Self {
        Self {
            x: self.x,
            y: self.y - 1,
            pointing,
        }
    }
    fn down(&self, pointing: Direction) -> Self {
        Self {
            x: self.x,
            y: self.y + 1,
            pointing,
        }
    }
    fn left(&self, pointing: Direction) -> Self {
        Self {
            x: self.x - 1,
            y: self.y,
            pointing,
        }
    }
    fn right(&self, pointing: Direction) -> Self {
        Self {
            x: self.x + 1,
            y: self.y,
            pointing,
        }
    }
}

#[cfg(feature = "part1")]
fn main() {
    let map: Vec<Vec<char>> = io::stdin()
        .lock()
        .lines()
        .filter(Result::is_ok)
        .map(Result::unwrap)
        .map(|r| r.chars().collect())
        .collect();

    let mut path: Vec<_> = Vec::new();
    'outer: for (y, row) in map.iter().enumerate() {
        for (x, c) in row.iter().enumerate() {
            if *c == 'S' {
                explore(&map, Pos::new(x, y, Direction::Down), &mut path);

                break 'outer;
            }
        }
    }

    let mut escapable = 0;
    let mut no_escapeable = 0;
    for (y, row) in map.iter().enumerate() {
        for (x, _) in row.iter().enumerate() {
            if path_tile(&map, y, x, &path).is_none() {
                let mut cnt = 0;
                for p_x in (0..=x).rev() {
                    if let Some(c) = path_tile(&map, y, p_x, &path) {
                        match c {
                            'L' | 'J' | '|' => {
                                cnt += 1;
                            }
                            _ => {}
                        };
                    }
                }

                if cnt % 2 == 1 {
                    no_escapeable += 1;
                } else {
                    escapable += 1;
                }
            }
        }
    }
    dbg!(escapable, no_escapeable);
}

fn path_tile<'a>(map: &[Vec<char>], y: usize, x: usize, path: &'a Vec<Pos>) -> Option<char> {
    if path.iter().find(|p| x == p.x && p.y == y).is_some() {
        Some(map[y][x])
    } else {
        None
    }
}

fn explore(map: &[Vec<char>], pos: Pos, path: &mut Vec<Pos>) {
    match pos.pointing {
        Direction::Up => match map.get(pos.y - 1).unwrap_or(&Vec::new()).get(pos.x) {
            Some('|') => explore(map, pos.up(Direction::Up), path),
            Some('F') => explore(map, pos.up(Direction::Right), path),
            Some('7') => explore(map, pos.up(Direction::Left), path),
            _ => {}
        },
        Direction::Down => match map.get(pos.y + 1).unwrap_or(&Vec::new()).get(pos.x) {
            Some('|') => explore(map, pos.down(Direction::Down), path),
            Some('L') => explore(map, pos.down(Direction::Right), path),
            Some('J') => explore(map, pos.down(Direction::Left), path),
            _ => {}
        },
        Direction::Left => match map[pos.y].get(pos.x - 1) {
            Some('-') => explore(map, pos.left(Direction::Left), path),
            Some('F') => explore(map, pos.left(Direction::Down), path),
            Some('L') => explore(map, pos.left(Direction::Up), path),
            _ => {}
        },
        Direction::Right => match map[pos.y].get(pos.x + 1) {
            Some('-') => explore(map, pos.right(Direction::Right), path),
            Some('J') => explore(map, pos.right(Direction::Up), path),
            Some('7') => explore(map, pos.right(Direction::Down), path),
            _ => {}
        },
    };
    path.push(pos);
}
