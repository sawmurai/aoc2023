use std::io::{self, BufRead};

struct Galaxy {
    x: usize,
    y: usize,
}

impl Galaxy {
    fn new(x: usize, y: usize) -> Self {
        Self { x, y }
    }
}

fn main() {
    let map: Vec<Vec<char>> = io::stdin()
        .lock()
        .lines()
        .filter(Result::is_ok)
        .map(Result::unwrap)
        .map(|r| r.chars().collect())
        .collect();

    let empty_rows: Vec<usize> = map
        .iter()
        .enumerate()
        .filter_map(|(i, r)| {
            if r.iter().all(|c| *c == '.') {
                Some(i)
            } else {
                None
            }
        })
        .collect();

    let mut empty_cols = Vec::new();
    for x in 0..map[0].len() {
        let mut is_empty = true;
        for y in 0..map.len() {
            if map[y][x] != '.' {
                is_empty = false;
                break;
            }
        }

        if is_empty {
            empty_cols.push(x);
        }
    }

    let mut galaxies = Vec::new();
    for x in 0..map[0].len() {
        for y in 0..map.len() {
            if map[y][x] == '#' {
                let empty_rows_before = empty_rows.iter().filter(|i| **i < y).count();
                let empty_cols_before = empty_cols.iter().filter(|i| **i < x).count();
                galaxies.push(Galaxy::new(
                    x - empty_cols_before + empty_cols_before * 1_000_000,
                    y - empty_rows_before + empty_rows_before * 1_000_000,
                ));
            }
        }
    }

    let mut sum = 0;
    for g in 0..(galaxies.len() - 1) {
        for o in (g + 1)..galaxies.len() {
            sum += galaxies[o].x.abs_diff(galaxies[g].x) + galaxies[o].y.abs_diff(galaxies[g].y);
        }
    }

    dbg!(sum);
}
