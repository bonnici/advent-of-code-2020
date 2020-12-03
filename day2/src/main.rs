extern crate regex;

use std::fmt;
use std::path::PathBuf;
use regex::Regex;

#[derive(Debug)]
struct Policy<'a> {
    min: &'a str,
    max: &'a str,
    char: &'a str,
    password: &'a str,
}

impl fmt::Display for Policy<'_> {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}-{} of {} in {}", self.min, self.max, self.char, self.password)
    }
}

fn main() {
    let input_path = PathBuf::from("input.txt");
    let content = std::fs::read_to_string(input_path).unwrap();

    for line in content.lines() {
        let re = Regex::new(r"(\d+)-(\d+) (\w): (\w+)").unwrap();

        let matches = re.captures_iter(line).filter_map(|cap| {
            let groups = (cap.get(0), cap.get(1), cap.get(2), cap.get(3));
            match groups {
                (Some(min), Some(max), Some(char), Some(password)) => Some(Policy {
                    min: min.as_str(),
                    max: max.as_str(),
                    char: char.as_str(),
                    password: password.as_str(),
                }),
                _ => None,
            }
        });

        let something = matches.map(|m| m.to_string()).collect::<Vec<_>>();
        dbg!(something);

        /*
        let rg = Regex::new(r"(\d+)-(\d+) (\w): (\w+)").unwrap();
        match rg.captures(line) {
            Some(x) => println!("{:?}", x.at(1)),
            None    => unreachable!()
        }
        */
    }
}
