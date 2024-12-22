use std::io::{self, BufRead};

#[cfg(feature = "part1")]
fn main() {
    let stdin = io::stdin();
    let mut sum = 0;

    for (i, line) in stdin.lock().lines().enumerate() {
        if let Ok(line) = line {
            let line = line
                .trim()
                .strip_prefix(&format!("Card {: >3}: ", i + 1))
                .unwrap()
                .trim();

            let parts: Vec<&str> = line.split("|").collect();

            let winning: Vec<u32> = parts[0]
                .split(" ")
                .filter(|n| !n.is_empty())
                .map(|n| n.parse::<u32>().unwrap())
                .collect();
            let actual: Vec<u32> = parts[1]
                .split(" ")
                .filter(|n| !n.is_empty())
                .map(|n| n.parse::<u32>().unwrap())
                .collect();

            let mut win_count = 0;
            for w in winning {
                if actual.contains(&w) {
                    win_count += 1;
                }
            }

            if win_count > 0 {
                sum += 2_i32.pow(win_count - 1);
            }
        }
    }

    println!("{sum}");
}

#[cfg(feature = "part2")]
fn main() {
    use std::collections::HashMap;

    let stdin = io::stdin();
    let mut pile: HashMap<usize, usize> = HashMap::new();

    for (i, line) in stdin.lock().lines().enumerate() {
        if let Ok(line) = line {
            let line = line
                .trim()
                .strip_prefix(&format!("Card {: >3}: ", i + 1))
                .unwrap()
                .trim();

            let parts: Vec<&str> = line.split("|").collect();

            let winning: Vec<usize> = parts[0]
                .split(" ")
                .filter(|n| !n.is_empty())
                .map(|n| n.parse::<usize>().unwrap())
                .collect();
            let actual: Vec<usize> = parts[1]
                .split(" ")
                .filter(|n| !n.is_empty())
                .map(|n| n.parse::<usize>().unwrap())
                .collect();

            let current_card: usize = *pile.entry(i).or_insert(1) + 0;

            let mut x = 1;
            for w in winning {
                if actual.contains(&w) {
                    *pile.entry(i + x).or_insert(1) += current_card;
                    x += 1;
                }
            }
        }
    }

    let sum: usize = pile.values().sum();
    println!("{sum}");
}
