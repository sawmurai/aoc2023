use std::io::{self, BufRead};

#[cfg(feature = "part1")]
fn main() {
    let stdin = io::stdin();
    let mut sum = 0;
    let allowed_red = 12;
    let allowed_green = 13;
    let allowed_blue = 14;

    'next_game: for (game, line) in stdin.lock().lines().enumerate() {
        if let Ok(line) = line {
            let line: Vec<&str> = line.trim().split(":").collect();

            for draw in line[1].trim().split(";") {
                for pairs in draw.split(",") {
                    let num_color: Vec<&str> = pairs.trim().split(" ").collect();
                    let count: u8 = num_color[0].parse().unwrap();

                    let allowed_count = match num_color[1] {
                        "green" => allowed_green,
                        "red" => allowed_red,
                        "blue" => allowed_blue,
                        _ => 0,
                    };

                    if count > allowed_count {
                        continue 'next_game;
                    }
                }
            }

            sum += game + 1;
        }
    }

    println!("{sum}");
}

#[cfg(feature = "part2")]
fn main() {
    let stdin = io::stdin();
    let mut sum = 0;

    for line in stdin.lock().lines() {
        if let Ok(line) = line {
            let line: Vec<&str> = line.trim().split(":").collect();

            let mut max_red = 0;
            let mut max_blue = 0;
            let mut max_green = 0;
            for draw in line[1].trim().split(";") {
                for pairs in draw.split(",") {
                    let num_color: Vec<&str> = pairs.trim().split(" ").collect();
                    let count: u32 = num_color[0].parse().unwrap();

                    match num_color[1] {
                        "green" => {
                            if count > max_green {
                                max_green = count;
                            }
                        }
                        "red" => {
                            if count > max_red {
                                max_red = count;
                            }
                        }
                        "blue" => {
                            if count > max_blue {
                                max_blue = count;
                            }
                        }
                        _ => {}
                    };
                }
            }

            sum += max_red * max_blue * max_green;
        }
    }

    println!("{sum}");
}
