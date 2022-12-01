use std::fs::File;
use std::io::BufReader;
use std::io::prelude::*;
use std::collections::HashMap;

#[derive(Debug)]
struct ParsingError;

fn main() {
    let contents = read_file();
    if !contents.is_ok() {
        println!("Error reading file");
        return;
    }

    let result = parse_file(contents.unwrap());
    if !result.is_ok() {
        println!("Error parsing file");
        return;
    }

    println!("{}", result.unwrap());
}

fn read_file() -> std::io::Result<String> {
    let file = File::open("input.txt")?;
    let mut buf_reader = BufReader::new(file);
    let mut contents = String::new();
    buf_reader.read_to_string(&mut contents)?;

    return Ok(contents)
}

fn parse_file(contents: String) -> Result<u64, ParsingError> {
    let mut end = 0;
    let mut numbers = vec![0];
    let mut permutations_by_number = HashMap::new();
    for line in contents.split('\n') {
        if line == "" {
            continue;
        }

        numbers.push(line.parse::<u64>().map_err(|_| ParsingError)?);
    }

    numbers.sort();

    for number in &numbers {
        let mut sum = 0;
        for max_range in 1..=3 {
            if number >= &max_range {
                if let Some(perm) = permutations_by_number.get(&(number - &max_range)) {
                    sum += perm
                }
            }
        }

        if sum == 0 {
            sum += 1;
        }

        permutations_by_number.insert(number, sum);
        end = sum;
    }

    return Ok(end);
}
