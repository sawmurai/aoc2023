use std::{
    io::{self, BufRead},
    iter::FromIterator,
};

#[cfg(feature = "part1")]
fn main() {
    let stdin = io::stdin();
    let mut lines = Vec::new();

    for line in stdin.lock().lines() {
        if let Ok(line) = line {
            let chars: Vec<char> = line.chars().collect();
            lines.push(chars);
        }
    }

    let mut sum = 0;
    let lines_len = lines.len();
    for (lc, line) in lines.iter().enumerate() {
        let mut current_number = Vec::new();
        let mut current_number_valid = false;
        let line_len = line.len();

        let mut char_iter = line.iter().enumerate().peekable();

        let first_line = lc == 0;
        let last_line = lc == lines_len - 1;

        while let Some((cc, char)) = char_iter.next() {
            if char == &'.' {
                continue;
            }

            let first_char = cc == 0;
            let last_char = cc == line_len - 1;

            if char.is_ascii_digit() {
                current_number.push(char);
            }

            if !current_number_valid {
                let sign_above = !first_line && is_sign(lines[lc - 1][cc]);
                let sign_before = !first_char && is_sign(line[cc - 1]);
                let sign_after = !last_char && is_sign(line[cc + 1]);
                let sign_below = !last_line && is_sign(lines[lc + 1][cc]);
                let sign_10 = !first_line && !first_char && is_sign(lines[lc - 1][cc - 1]);
                let sign_2 = !first_line && !last_char && is_sign(lines[lc - 1][cc + 1]);
                let sign_4 = !last_line && !last_char && is_sign(lines[lc + 1][cc + 1]);
                let sign_8 = !last_line && !first_char && is_sign(lines[lc + 1][cc - 1]);

                current_number_valid = sign_before
                    || sign_after
                    || sign_above
                    || sign_below
                    || sign_10
                    || sign_2
                    || sign_4
                    || sign_8
            }

            let peek = char_iter.peek();
            let number_ends = peek.is_none() || !peek.unwrap().1.is_ascii_digit();
            if number_ends {
                if current_number_valid {
                    sum += String::from_iter(current_number).parse::<u32>().unwrap();
                }
                current_number = Vec::new();

                current_number_valid = false;
            }
        }
    }

    println!("{sum}");
}

#[cfg(feature = "part1")]
fn is_sign(c: char) -> bool {
    !c.is_ascii_digit() && c != '.'
}

type GearPosition = (usize, usize);

#[cfg(feature = "part2")]
fn main() {
    use std::collections::HashMap;

    let stdin = io::stdin();
    let mut lines = Vec::new();
    let mut gears: HashMap<GearPosition, Vec<u32>> = HashMap::new();

    for line in stdin.lock().lines() {
        if let Ok(line) = line {
            let chars: Vec<char> = line.chars().collect();
            lines.push(chars);
        }
    }

    let mut line_iter = lines.iter().enumerate().peekable();

    while let Some((lc, line)) = line_iter.next() {
        let mut current_number = Vec::new();
        let first_line = lc == 0;
        let last_line = line_iter.peek().is_none();
        let mut current_gear = (0, 0);
        let mut char_iter = line.iter().enumerate().peekable();

        while let Some((cc, char)) = char_iter.next() {
            if char == &'.' {
                continue;
            }

            let first_char = cc == 0;
            let last_char = char_iter.peek().is_none();

            if char.is_ascii_digit() {
                current_number.push(char);
            }

            if current_gear == (0, 0) {
                if !first_line && is_gear(lines[lc - 1][cc]) {
                    current_gear = (lc - 1, cc)
                } else if !first_char && is_gear(line[cc - 1]) {
                    current_gear = (lc, cc - 1)
                } else if !last_char && is_gear(line[cc + 1]) {
                    current_gear = (lc, cc + 1)
                } else if !last_line && is_gear(lines[lc + 1][cc]) {
                    current_gear = (lc + 1, cc)
                } else if !first_line && !first_char && is_gear(lines[lc - 1][cc - 1]) {
                    current_gear = (lc - 1, cc - 1)
                } else if !first_line && !last_char && is_gear(lines[lc - 1][cc + 1]) {
                    current_gear = (lc - 1, cc + 1)
                } else if !last_line && !last_char && is_gear(lines[lc + 1][cc + 1]) {
                    current_gear = (lc + 1, cc + 1)
                } else if !last_line && !first_char && is_gear(lines[lc + 1][cc - 1]) {
                    current_gear = (lc + 1, cc - 1)
                }
            }

            let peek = char_iter.peek();
            let number_ends = peek.is_none() || !peek.unwrap().1.is_ascii_digit();
            if number_ends && !current_number.is_empty() {
                if current_gear != (0, 0) {
                    gears
                        .entry(current_gear)
                        .or_insert(Vec::new())
                        .push(String::from_iter(current_number).parse::<u32>().unwrap());

                    current_gear = (0, 0);
                }
                current_number = Vec::new();
            }
        }
    }

    let sum: u32 = gears
        .values()
        .filter(|vals| vals.len() == 2)
        .map(|vals| vals.iter().product::<u32>())
        .sum();

    eprintln!("{sum}");
}

#[cfg(feature = "part2")]
fn is_gear(c: char) -> bool {
    c == '*'
}
