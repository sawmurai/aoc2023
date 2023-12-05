use std::{
    cmp::max,
    cmp::min,
    io::{self, BufRead, Lines, StdinLock},
};

#[derive(Debug)]
struct Mapping {
    dest_range_start: usize,
    source_range_start: usize,
    range_len: usize,
}

fn main() {
    let stdin = io::stdin();

    let mut lines = stdin.lock().lines().into_iter();
    let line = lines.next().unwrap().unwrap();

    let seeds: Vec<usize> = if let Some(line) = line.strip_prefix("seeds: ") {
        line.split(" ").map(|n| n.parse().unwrap()).collect()
    } else {
        eprintln!("Shit");

        return;
    };

    // Drop empty line
    lines.next().unwrap().unwrap();

    let mut seed_to_soil: Vec<Mapping> = parse_map(&mut lines, "seed-to-soil map");
    seed_to_soil.sort_by_key(|m| m.dest_range_start);

    let mut soil_to_fertilizer: Vec<Mapping> = parse_map(&mut lines, "soil-to-fertilizer map");
    soil_to_fertilizer.sort_by_key(|m| m.dest_range_start);

    let mut fertilizer_to_water: Vec<Mapping> = parse_map(&mut lines, "fertilizer-to-water map");
    fertilizer_to_water.sort_by_key(|m| m.dest_range_start);

    let mut water_to_light: Vec<Mapping> = parse_map(&mut lines, "water-to-light map");
    water_to_light.sort_by_key(|m| m.dest_range_start);

    let mut light_to_temperature: Vec<Mapping> = parse_map(&mut lines, "light-to-temperature map");
    light_to_temperature.sort_by_key(|m| m.dest_range_start);

    let mut temperature_to_humidity: Vec<Mapping> =
        parse_map(&mut lines, "temperature-to-humidity map");
    temperature_to_humidity.sort_by_key(|m| m.dest_range_start);

    let mut humidity_to_location: Vec<Mapping> = parse_map(&mut lines, "humidity-to-location map");
    humidity_to_location.sort_by_key(|m| m.dest_range_start);

    let mut locations = Vec::new();

    #[cfg(feature = "part1")]
    for seed in seeds {
        let soil = if let Some(soil) = find_destination(&seed_to_soil, seed) {
            soil
        } else {
            continue;
        };

        let fertilizer = if let Some(fertilizer) = find_destination(&soil_to_fertilizer, soil) {
            fertilizer
        } else {
            continue;
        };

        let water = if let Some(water) = find_destination(&fertilizer_to_water, fertilizer) {
            water
        } else {
            continue;
        };

        let light = if let Some(light) = find_destination(&water_to_light, water) {
            light
        } else {
            continue;
        };

        let temperature = if let Some(temperature) = find_destination(&light_to_temperature, light)
        {
            temperature
        } else {
            continue;
        };

        let humidity =
            if let Some(humidity) = find_destination(&temperature_to_humidity, temperature) {
                humidity
            } else {
                continue;
            };

        if let Some(location) = find_destination(&humidity_to_location, humidity) {
            locations.push(location);
        }
    }

    #[cfg(feature = "part2")]
    for seed_chunk in seeds.chunks(2) {
        dbg!(".");
        let from = seed_chunk[0];
        let to = seed_chunk[1];

        for seed in from..=(from + to) {
            let soil = if let Some(soil) = find_destination(&seed_to_soil, seed) {
                soil
            } else {
                continue;
            };

            let fertilizer = if let Some(fertilizer) = find_destination(&soil_to_fertilizer, soil) {
                fertilizer
            } else {
                continue;
            };

            let water = if let Some(water) = find_destination(&fertilizer_to_water, fertilizer) {
                water
            } else {
                continue;
            };

            let light = if let Some(light) = find_destination(&water_to_light, water) {
                light
            } else {
                continue;
            };

            let temperature =
                if let Some(temperature) = find_destination(&light_to_temperature, light) {
                    temperature
                } else {
                    continue;
                };

            let humidity =
                if let Some(humidity) = find_destination(&temperature_to_humidity, temperature) {
                    humidity
                } else {
                    continue;
                };

            if let Some(location) = find_destination(&humidity_to_location, humidity) {
                locations.push(location);
            }
        }
    }

    eprint!("\n{}", locations.iter().min().unwrap());
}

fn parse_map(lines: &mut Lines<StdinLock<'_>>, expected: &str) -> Vec<Mapping> {
    if lines.next().unwrap().expect(expected).starts_with(expected) {
        lines
            .map_while(|line| {
                if let Ok(line) = line {
                    if line.is_empty() {
                        return None;
                    }

                    let parts: Vec<usize> = line
                        .split(" ")
                        .map(|n| n.parse::<usize>().unwrap())
                        .collect();
                    Some(Mapping {
                        dest_range_start: parts[0],
                        source_range_start: parts[1],
                        range_len: parts[2],
                    })
                } else {
                    None
                }
            })
            .collect()
    } else {
        eprintln!("Shit: {expected}");

        return vec![];
    }
}

fn find_destination(mappings: &Vec<Mapping>, source_index: usize) -> Option<usize> {
    if let Some(mapping) = mappings.iter().find(|m| {
        source_index >= m.source_range_start && source_index <= (m.source_range_start + m.range_len)
    }) {
        Some(mapping.dest_range_start + source_index - mapping.source_range_start)
    } else {
        None
    }
}
