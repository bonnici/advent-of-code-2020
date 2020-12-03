use std::path::PathBuf;

fn main() {
    let target = 2020;

    let input_path = PathBuf::from("input.txt");
    let content = std::fs::read_to_string(input_path).unwrap();
    let mut vec: Vec<i32> = content.lines()
        .map(|s| s.parse::<i32>().unwrap())
        .filter(|n| *n < target)
        .collect();
    vec.sort();

    part1(target, &vec);
    part2(target, &vec);
}

fn part1(target: i32, vec: &Vec<i32>) {
    for i in 1..vec.len() {
        let val1 = vec.get(i).unwrap();

        for j in (i..vec.len()).rev() {
            let val2 = vec.get(j).unwrap();

            if val1 + val2 == target {
                println!("Found match: {} * {} = {}", val1, val2, val1 * val2);
                return;
            } else if val1 + val2 < target {
                break;
            }
        }
    }
}


fn part2(target: i32, vec: &Vec<i32>) {
    for i in 1..vec.len() {
        let val1 = vec.get(i).unwrap();

        for j in (i..vec.len()).rev() {
            let val2 = vec.get(j).unwrap();

            if val1 + val2 < target {
                for k in ((i + 1)..(j - 1)).rev() {
                    let val3 = vec.get(k).unwrap();

                    if val1 + val2 + val3 == target {
                        println!("Found match: {} * {} * {} = {}",
                                 val1,
                                 val2,
                                 val3,
                                 val1 * val2 * val3
                        );
                        return;
                    } else if val1 + val2 + val3 > target {
                        break;
                    }
                }
            }
        }
    }
}