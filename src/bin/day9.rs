use std::io::{self, BufRead};

#[cfg(feature = "part1")]
fn main() {
    let sequences: Vec<Vec<i64>> = io::stdin()
        .lock()
        .lines()
        .filter(Result::is_ok)
        .map(Result::unwrap)
        .map(|line| line.split(" ").map(|p| p.parse().unwrap()).collect())
        .collect();

    let res: i64 = sequences
        .iter()
        .map(|sequence| {
            let mut start_seq = sequence.to_owned();
            let mut calculated_sequences = vec![start_seq.clone()];
            loop {
                start_seq = seq_of_diff(&start_seq);
                calculated_sequences.push(start_seq.clone());

                if all_zeros(&start_seq) {
                    break;
                }
            }

            calculated_sequences.reverse();

            let mut last = 0;

            for calc_seq in calculated_sequences.iter_mut() {
                // last = append_last(calc_seq, last);
                last = prepend_first(calc_seq, last);
            }

            calculated_sequences
                .last()
                .unwrap()
                // .last()
                .first()
                .unwrap()
                .to_owned()
        })
        .sum();

    println!("{res}");
}

fn seq_of_diff(seq: &[i64]) -> Vec<i64> {
    let mut diff_seq = Vec::new();

    seq.iter().enumerate().skip(1).for_each(|(i, item)| {
        diff_seq.push(item - seq[i - 1]);
    });

    diff_seq
}

fn all_zeros(seq: &[i64]) -> bool {
    seq.iter().all(|num| *num == 0)
}

fn append_last(seq: &mut Vec<i64>, last: i64) -> i64 {
    let n = seq.last().unwrap() + last;

    seq.push(n);

    n
}

fn prepend_first(seq: &mut Vec<i64>, last: i64) -> i64 {
    let n = seq.first().unwrap() - last;

    seq.insert(0, n);

    n
}
