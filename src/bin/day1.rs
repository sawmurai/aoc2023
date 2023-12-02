use std::io::{self, BufRead};

fn main() {
    let stdin = io::stdin();
    let mut sum = 0;

    for line in stdin.lock().lines() {
        if let Ok(line) = line {
            if line == "" {
                break;
            }

            let line = parse_number(line.trim());
            let mut chars = line.chars();
            let first_digit = chars.find(|c| c.is_digit(10) && *c != '0').unwrap();
            let last_digit = line.chars().rev().find(|c| c.is_digit(10)).unwrap();

            let line_number = format!("{first_digit}{last_digit}");
            sum += line_number.parse::<i32>().expect("Could not parse line")
        } else {
            eprintln!("Error!");
        }
    }

    println!("{sum}");
}

fn parse_number(input: &str) -> String {
    let pairs = [
        ("4", "4"),
        ("6", "6"),
        ("7", "7"),
        ("9", "9"),
        ("5", "5"),
        ("1", "1"),
        ("3", "3"),
        ("8", "8"),
        ("2", "2"),
        ("four", "4"),
        ("six", "6"),
        ("seven", "7"),
        ("nine", "9"),
        ("five", "5"),
        ("one", "1"),
        ("three", "3"),
        ("eight", "8"),
        ("two", "2"),
    ];

    let mut result: String = String::new();

    for mut i in 0..=input.len() {
        for (s, d) in pairs {
            if input[i..].starts_with(s) {
                result.push_str(d);

                i += s.len();
            }
        }
    }

    result
}
