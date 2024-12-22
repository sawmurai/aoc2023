fn main() {
    #[cfg(feature = "part1")]
    let times = vec![48, 93, 84, 66];

    #[cfg(feature = "part1")]
    let distances = vec![261, 1192, 1019, 1063];

    #[cfg(feature = "part2")]
    let times: Vec<usize> = vec![48938466];

    #[cfg(feature = "part2")]
    let distances: Vec<usize> = vec![261119210191063];

    let num: usize = times
        .iter()
        .zip(distances.iter())
        .map(|(time, distance)| (0..=*time).filter(|t| t * (time - t) > *distance).count())
        .product();

    println!("{num}")
}
