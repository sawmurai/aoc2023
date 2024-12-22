use std::{
    cmp::Ordering,
    collections::HashMap,
    io::{self, BufRead},
};

#[derive(Debug)]
pub struct Draw {
    hand: Vec<char>,
    price: usize,
}

#[cfg(feature = "part1")]
fn main() {
    use std::cmp::{self, Ordering};

    let stdin = io::stdin();
    let mut cards = HashMap::new();

    cards.insert('A', 13);
    cards.insert('K', 12);
    cards.insert('Q', 11);
    cards.insert('J', 10);
    cards.insert('T', 9);
    cards.insert('9', 8);
    cards.insert('8', 7);
    cards.insert('7', 6);
    cards.insert('6', 5);
    cards.insert('5', 4);
    cards.insert('4', 3);
    cards.insert('3', 2);
    cards.insert('2', 1);

    let mut hands: Vec<Draw> = stdin
        .lock()
        .lines()
        .filter_map(|line| {
            if let Ok(line) = line {
                let parts: Vec<&str> = line.split(" ").collect();

                let hand: Vec<char> = parts[0].chars().collect();

                let price: usize = parts[1].parse().unwrap();

                Some(Draw { hand, price })
            } else {
                None
            }
        })
        .collect();

    hands.sort_by(|hand1, hand2| {
        let mut hand1_has_2 = 0;
        let mut hand2_has_2 = 0;
        let mut hand1_has_3 = false;
        let mut hand2_has_3 = false;
        let mut hand1_has_4 = false;
        let mut hand2_has_4 = false;
        let mut hand1_has_5 = false;
        let mut hand2_has_5 = false;

        for (card, _) in cards.iter() {
            let num_hand1 = hand1
                .hand
                .iter()
                .filter(|inner_card| card == *inner_card)
                .count();

            let num_hand2 = hand2
                .hand
                .iter()
                .filter(|inner_card| card == *inner_card)
                .count();

            if num_hand1 == 5 {
                hand1_has_5 = true;
            }
            if num_hand2 == 5 {
                hand2_has_5 = true;
            }

            if num_hand1 == 4 {
                hand1_has_4 = true;
            }
            if num_hand2 == 4 {
                hand2_has_4 = true;
            }

            if num_hand1 == 3 {
                hand1_has_3 = true;
            } else if num_hand1 == 2 {
                hand1_has_2 += 1;
            }

            if num_hand2 == 3 {
                hand2_has_3 = true;
            } else if num_hand2 == 2 {
                hand2_has_2 += 1;
            }
        }

        if hand1_has_5 && !hand2_has_5 {
            return Ordering::Greater;
        } else if !hand1_has_5 && hand2_has_5 {
            return Ordering::Less;
        }

        if hand1_has_4 && !hand2_has_4 {
            return Ordering::Greater;
        } else if !hand1_has_4 && hand2_has_4 {
            return Ordering::Less;
        }

        let hand1_fullhouse = hand1_has_3 && hand1_has_2 > 0;
        let hand2_fullhouse = hand2_has_3 && hand2_has_2 > 0;
        if hand1_fullhouse && !hand2_fullhouse {
            return Ordering::Greater;
        } else if !hand1_fullhouse && hand2_fullhouse {
            return Ordering::Less;
        }

        if hand1_has_3 && !hand2_has_3 {
            return Ordering::Greater;
        } else if !hand1_has_3 && hand2_has_3 {
            return Ordering::Less;
        }

        let c = hand1_has_2.cmp(&hand2_has_2);
        if c != Ordering::Equal {
            return c;
        }

        for (c1, c2) in hand1.hand.iter().zip(hand2.hand.iter()) {
            if c1 == c2 {
                continue;
            }

            let c = cards.get(c1).unwrap().cmp(cards.get(c2).unwrap());

            return c;
        }

        Ordering::Equal
    });

    let sum: usize = hands
        .iter()
        .enumerate()
        .map(|(pos, draw)| draw.price * (pos + 1))
        .sum();

    println!("{sum}");
}

#[cfg(feature = "part2")]
fn main() {
    let stdin = io::stdin();
    let cards = get_cards();

    let mut hands: Vec<Draw> = stdin
        .lock()
        .lines()
        .filter_map(|line| {
            if let Ok(line) = line {
                let parts: Vec<&str> = line.split(" ").collect();

                let hand: Vec<char> = parts[0].chars().collect();

                let price: usize = parts[1].parse().unwrap();

                Some(Draw { hand, price })
            } else {
                None
            }
        })
        .collect();

    hands.sort_by(|a, b| sort(a, b, &cards));

    let sum: usize = hands
        .iter()
        .enumerate()
        .map(|(pos, draw)| draw.price * (pos + 1))
        .sum();

    for hand in hands {
        for c in hand.hand {
            eprint!("{c}");
        }
        eprintln!("");
    }
    println!("{sum}");
}

pub fn get_cards() -> HashMap<char, i32> {
    let mut cards = HashMap::new();

    cards.insert('A', 13);
    cards.insert('K', 12);
    cards.insert('Q', 11);
    cards.insert('T', 9);
    cards.insert('9', 8);
    cards.insert('8', 7);
    cards.insert('7', 6);
    cards.insert('6', 5);
    cards.insert('5', 4);
    cards.insert('4', 3);
    cards.insert('3', 2);
    cards.insert('2', 1);
    cards.insert('J', 0);

    cards
}

fn sort(hand1: &Draw, hand2: &Draw, cards: &HashMap<char, i32>) -> Ordering {
    let hand1_j = hand1
        .hand
        .iter()
        .filter(|inner_card| 'J' == **inner_card)
        .count();
    let hand2_j = hand2
        .hand
        .iter()
        .filter(|inner_card| 'J' == **inner_card)
        .count();

    let mut hand1_has_2 = 0;
    let mut hand2_has_2 = 0;
    let mut hand1_has_3 = false;
    let mut hand2_has_3 = false;
    let mut hand1_has_4 = false;
    let mut hand2_has_4 = false;
    let mut hand1_has_5 = false;
    let mut hand2_has_5 = false;

    for (card, _) in cards.iter() {
        if card == &'J' {
            continue;
        }

        let num_hand1 = hand1
            .hand
            .iter()
            .filter(|inner_card| card == *inner_card)
            .count();

        let num_hand2 = hand2
            .hand
            .iter()
            .filter(|inner_card| card == *inner_card)
            .count();

        if num_hand1 + hand1_j == 5 {
            hand1_has_5 = true;
        }
        if num_hand2 + hand2_j == 5 {
            hand2_has_5 = true;
        }

        if num_hand1 + hand1_j == 4 {
            hand1_has_4 = true;
        }
        if num_hand2 + hand2_j == 4 {
            hand2_has_4 = true;
        }

        if num_hand1 == 3 {
            hand1_has_3 = true;
        }
        if num_hand2 == 3 {
            hand2_has_3 = true;
        }

        if num_hand1 == 2 {
            hand1_has_2 += 1;
        }

        if num_hand2 == 2 {
            hand2_has_2 += 1;
        }
    }

    if hand1_has_5 && !hand2_has_5 {
        return Ordering::Greater;
    } else if !hand1_has_5 && hand2_has_5 {
        return Ordering::Less;
    }

    if !(hand1_has_5 || hand2_has_5) {
        if hand1_has_4 && !hand2_has_4 {
            return Ordering::Greater;
        } else if !hand1_has_4 && hand2_has_4 {
            return Ordering::Less;
        }

        if !(hand1_has_4 || hand2_has_4) {
            let hand1_has_3_w_joker = hand1_has_3
                || hand1_has_2 == 1 && hand1_j > 0
                || hand1_has_2 == 2 && hand1_j == 1
                || hand1_has_2 == 0 && hand1_j > 1;
            let hand2_has_3_w_joker = hand2_has_3
                || hand2_has_2 == 1 && hand2_j > 0
                || hand2_has_2 == 2 && hand2_j == 1
                || hand2_has_2 == 0 && hand2_j > 1;

            let hand1_fullhouse =
                hand1_has_3_w_joker && hand1_has_2 == 2 || hand1_has_3 && hand1_has_2 == 1;
            let hand2_fullhouse =
                hand2_has_3_w_joker && hand2_has_2 == 2 || hand2_has_3 && hand2_has_2 == 1;

            if hand1_fullhouse && !hand2_fullhouse {
                return Ordering::Greater;
            } else if !hand1_fullhouse && hand2_fullhouse {
                return Ordering::Less;
            }

            if !(hand1_fullhouse || hand2_fullhouse) {
                if hand1_has_3_w_joker && !hand2_has_3_w_joker {
                    return Ordering::Greater;
                } else if !hand1_has_3_w_joker && hand2_has_3_w_joker {
                    return Ordering::Less;
                }

                if !(hand1_has_3_w_joker || hand2_has_3_w_joker) {
                    let c = (hand1_has_2 + hand1_j).cmp(&(hand2_has_2 + hand2_j));
                    if c != Ordering::Equal {
                        return c;
                    }
                }
            }
        }
    }

    for (c1, c2) in hand1.hand.iter().zip(hand2.hand.iter()) {
        if c1 == c2 {
            continue;
        }
        let c = cards.get(c1).unwrap().cmp(cards.get(c2).unwrap());

        return c;
    }

    Ordering::Equal
}

#[cfg(test)]
mod tests {
    use std::cmp::Ordering;

    use crate::{get_cards, sort, Draw};

    fn get_hand(s: &str) -> Draw {
        Draw {
            hand: s.chars().collect(),
            price: 1,
        }
    }

    #[test]
    fn it_ranks_fives_highest() {
        let g = Ordering::Greater;
        let l = Ordering::Less;
        let h = get_cards();

        assert_eq!(g, sort(&get_hand("AAAAA"), &get_hand("AAAKK"), &h));
        assert_eq!(g, sort(&get_hand("AAAAA"), &get_hand("KAAAA"), &h));
        assert_eq!(g, sort(&get_hand("AAAAA"), &get_hand("AAAKK"), &h));
        assert_eq!(g, sort(&get_hand("AAAAA"), &get_hand("AAKKK"), &h));
        assert_eq!(g, sort(&get_hand("AAAAA"), &get_hand("AKKKK"), &h));

        assert_eq!(g, sort(&get_hand("AAAAA"), &get_hand("AAAKQ"), &h));

        assert_eq!(g, sort(&get_hand("AAAAA"), &get_hand("JAAAA"), &h));
        assert_eq!(l, sort(&get_hand("JAAAA"), &get_hand("AAAAA"), &h));
    }

    #[test]
    fn it_ranks_fours_after_fives() {
        let g = Ordering::Greater;
        let l = Ordering::Less;
        let h = get_cards();

        assert_eq!(g, sort(&get_hand("AAAAQ"), &get_hand("AAAKK"), &h));
        assert_eq!(g, sort(&get_hand("AAAAQ"), &get_hand("KAAAA"), &h));
        assert_eq!(g, sort(&get_hand("AAAAQ"), &get_hand("AAAKK"), &h));
        assert_eq!(g, sort(&get_hand("AAAAQ"), &get_hand("AAKKK"), &h));
        assert_eq!(g, sort(&get_hand("AAAAQ"), &get_hand("AKKKK"), &h));

        assert_eq!(g, sort(&get_hand("AAAAQ"), &get_hand("JAAAQ"), &h));
        assert_eq!(l, sort(&get_hand("JAAAQ"), &get_hand("AAAAA"), &h));
    }

    #[test]
    fn it_ranks_full_house_after_fours() {
        let g = Ordering::Greater;
        let h = get_cards();

        assert_eq!(g, sort(&get_hand("AAAQQ"), &get_hand("AAAQK"), &h));
        assert_eq!(g, sort(&get_hand("QQAAA"), &get_hand("AAAQK"), &h));
        assert_eq!(g, sort(&get_hand("22333"), &get_hand("AAAQK"), &h));
        assert_eq!(g, sort(&get_hand("22J33"), &get_hand("22265"), &h));
    }

    #[test]
    fn it_ranks_tripples_after_full_house() {
        let g = Ordering::Greater;
        let h = get_cards();

        assert_eq!(g, sort(&get_hand("AAAQK"), &get_hand("23456"), &h));
        assert_eq!(g, sort(&get_hand("AAAQK"), &get_hand("22334"), &h));
        assert_eq!(g, sort(&get_hand("AAAQK"), &get_hand("22265"), &h));
        assert_eq!(g, sort(&get_hand("AAJQK"), &get_hand("22265"), &h));
        assert_eq!(g, sort(&get_hand("JAQKJ"), &get_hand("AA233"), &h));
    }

    #[test]
    fn it_ranks_two_pair_after_tripples() {
        let g = Ordering::Greater;
        let h = get_cards();

        assert_eq!(g, sort(&get_hand("AAQKK"), &get_hand("23456"), &h));
        assert_eq!(g, sort(&get_hand("AAQ33"), &get_hand("AAQK9"), &h));
        assert_eq!(g, sort(&get_hand("AAAKQ"), &get_hand("AA233"), &h));

        assert_eq!(g, sort(&get_hand("AAQKJ"), &get_hand("AA233"), &h));
    }
    #[test]
    fn it_ranks_one_pair_after_two_pairs() {
        let g = Ordering::Greater;
        let h = get_cards();

        assert_eq!(g, sort(&get_hand("AA123"), &get_hand("23456"), &h));
        assert_eq!(g, sort(&get_hand("AJ123"), &get_hand("23456"), &h));
        assert_eq!(g, sort(&get_hand("ATQ8J"), &get_hand("22A6K"), &h));
    }
    #[test]
    fn it_ranks_by_card() {
        let g = Ordering::Greater;
        let h = get_cards();

        assert_eq!(g, sort(&get_hand("AAJAA"), &get_hand("J8JJJ"), &h));
        assert_eq!(g, sort(&get_hand("AAAAT"), &get_hand("AAKAA"), &h));
    }
}
