extern crate regex;

use std::path::PathBuf;
use regex::Regex;

fn main() {
    let input_path = PathBuf::from("input.txt");
    let content = std::fs::read_to_string(input_path).unwrap();

    let input_re = Regex::new(r"^(\d+)-(\d+) (\w): (\w+)$").unwrap();

    let mut valid_count_pt1 = 0;
    let mut valid_count_pt2 = 0;
    for line in content.lines() {
        // assert!(re.is_match(line));

        let cap = input_re.captures(line).unwrap();

        let min = &cap[1].parse::<usize>().unwrap();
        let max = &cap[2].parse::<usize>().unwrap();
        let ch = &cap[3].parse::<char>().unwrap();
        let text = &cap[4];

        println!("{}", line);
        println!("min: {}, max: {}, char: {}, input: {}", min, max, ch, text);

        let pass_pt1 = matches_pt1(min, max, ch, text);
        if pass_pt1 {
            println!("Matches part 1 rules");
            valid_count_pt1 += 1;
        } else {
            println!("Does not match part 1 rules");
        }

        let pass_pt2 = matches_pt2(min, max, ch, text);
        if pass_pt2 {
            println!("Matches part 2 rules");
            valid_count_pt2 += 1;
        } else {
            println!("Does not match part 2 rules");
        }
    }

    println!();
    println!("Part 1: found {} matches", valid_count_pt1);
    println!("Part 2: found {} matches", valid_count_pt2);
}


fn matches_pt1(min: &usize, max: &usize, ch: &char, text: &str) -> bool {
    /*
    let must_contain = std::iter::repeat(ch).take(*min).collect::<String>();
    let must_not_contain = std::iter::repeat(ch).take((*max) + 1).collect::<String>();

    let contains_min = text.contains(&must_contain);
    let contains_over_max = text.contains(&must_not_contain);
    contains_min && !contains_over_max;
    */

    /*
    let regex_str = format!("([^{ch}]|^){ch}{{{min},{max}}}([^{ch}]|$)", ch=ch, min=min, max=max);
    let valid_re = Regex::new(&regex_str).unwrap();
    valid_re.is_match(line)
    */

    // oops it's just occurrences, not consecutive

    let mut char_count: usize = 0;
    for cur_ch in text.chars() {
        if &cur_ch == ch {
            char_count += 1;
        }
    }

    println!("text: {} contains {} copies of {}", text, char_count, ch);
    char_count >= *min && char_count <= *max
}

fn matches_pt2(pos1: &usize, pos2: &usize, ch: &char, text: &str) -> bool {
    let mut match_count = 0;
    if text.chars().nth(pos1 + 1).unwrap() == *ch {
        match_count += 1;
    }
    if text.chars().nth(pos2 + 1).unwrap() == *ch {
        match_count += 1;
    }

    println!("match count: {}", &match_count);
    match_count == 1
}