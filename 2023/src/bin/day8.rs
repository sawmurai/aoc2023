use std::{
    collections::HashMap,
    io::{self, BufRead},
};

#[cfg(feature = "part1")]
fn main() {
    use std::collections::HashMap;

    let instructions = "LRLRRRLRRLRLLRRRLRRLLRRRLLRLRRLLRRRLRLRRRLRRLRRLRRLLLLRRRLRRLRRRLRRRLRRRLRLRRRLRLLRRRLLRLRRRLRRRLRLRRLLRLLRRLRLLRRRLLRRLRLLLRLRLRLLRRRLRLRLRRLRRRLRRLRLRRRLRRRLRRRLLLLRLLRRLLRRRLRRLRRLLRRLRRRLLRRLLLRRRLRLRLLRRLRRRLRRLRRRLLRLRRRLRLLRLLRRRLRRLLRLRRRLRRLRRRLRRLRRLRRRLRRLRRRR";
    let mut map = HashMap::new();

    for line in io::stdin()
        .lock()
        .lines()
        .filter(Result::is_ok)
        .map(Result::unwrap)
    {
        let parts: Vec<String> = line.split(" = ").map(|p| p.to_owned()).collect();
        let lr: Vec<String> = parts[1]
            .strip_prefix("(")
            .unwrap()
            .strip_suffix(")")
            .unwrap()
            .split(", ")
            .map(|p| p.to_owned())
            .collect();
        map.insert(parts[0].clone(), lr.clone());
    }

    let steps = walk_map(&instructions, &map, "ZZZ");

    println!("{steps}");
}

#[cfg(feature = "part2")]
fn main() {
    let instructions = "LRLRRRLRRLRLLRRRLRRLLRRRLLRLRRLLRRRLRLRRRLRRLRRLRRLLLLRRRLRRLRRRLRRRLRRRLRLRRRLRLLRRRLLRLRRRLRRRLRLRRLLRLLRRLRLLRRRLLRRLRLLLRLRLRLLRRRLRLRLRRLRRRLRRLRLRRRLRRRLRRRLLLLRLLRRLLRRRLRRLRRLLRRLRRRLLRRLLLRRRLRLRLLRRLRRRLRRLRRRLLRLRRRLRLLRLLRRRLRRLLRLRRRLRRLRRRLRRLRRLRRRLRRLRRRR";
    let mut map = HashMap::new();

    for line in io::stdin()
        .lock()
        .lines()
        .filter(Result::is_ok)
        .map(Result::unwrap)
    {
        let parts: Vec<String> = line.split(" = ").map(|p| p.to_owned()).collect();
        let lr: Vec<String> = parts[1]
            .strip_prefix("(")
            .unwrap()
            .strip_suffix(")")
            .unwrap()
            .split(", ")
            .map(|p| p.to_owned())
            .collect();
        map.insert(parts[0].clone(), lr.clone());
    }

    let steps = walk_map(&instructions, &map);

    println!("{steps}");
}

#[cfg(feature = "part1")]
fn walk_map(instruction: &str, map: &HashMap<String, Vec<String>>, target: &str) -> usize {
    let mut current = "BLA";
    let mut steps: usize = 0;

    loop {
        for s in instruction.chars() {
            steps += 1;

            if s == 'L' {
                current = &map.get(current).unwrap()[0];
            } else if s == 'R' {
                current = &map.get(current).unwrap()[1];
            }

            if current == target {
                return steps;
            }
        }
    }
}

#[cfg(feature = "part2")]
fn walk_map(instruction: &str, map: &HashMap<String, Vec<String>>) -> usize {
    let mut currents: Vec<String> = map
        .iter()
        .filter_map(|(k, _)| {
            if k.ends_with("A") {
                Some(k.clone())
            } else {
                None
            }
        })
        .collect();
    let mut steps: usize = 0;

    'current: for o_current in currents.iter() {
        steps = 0;
        let mut current = o_current.clone();

        loop {
            for s in instruction.chars() {
                steps += 1;

                let p = map.get(&current).unwrap();

                if s == 'L' {
                    current = p[0].clone();
                } else if s == 'R' {
                    current = p[1].clone();
                }

                if current.ends_with("Z") {
                    // print these numbers, calculate their kgV and voila, your solution
                    eprintln!("{o_current} {steps}");

                    continue 'current;
                }
            }
        }
    }

    0
}
