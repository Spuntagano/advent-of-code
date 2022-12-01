use std::fs::File;
use std::io::BufReader;
use std::io::prelude::*;

#[derive(Debug)]
struct ParsingError;

fn main() {
    let contents = read_file();
    if !contents.is_ok() {
        println!("Error reading file");
        return;
    }

    let numbers = parse_file(contents.unwrap());
    if !numbers.is_ok() {
        println!("Error parsing file");
        return;
    }

    let numbers = numbers.unwrap();
    let mut current_number = 25;
    while current_number < numbers.len() {
        let window_start = current_number - 25;
        let window_end = current_number - 1;
        let window = &numbers[window_start..=window_end];
        let mut found = false;
        for (i, number1) in window.iter().enumerate() {
            for (j, number2) in window.iter().enumerate() {
                if i == j {
                    continue;
                }

                if number1 + number2 == numbers[current_number] {
                    found = true;
                }
            }
        }

        if !found {
            println!("{}", numbers[current_number]);
            break;
        }

        current_number = current_number + 1;
    }
}

fn read_file() -> std::io::Result<String> {
    let file = File::open("input.txt")?;
    let mut buf_reader = BufReader::new(file);
    let mut contents = String::new();
    buf_reader.read_to_string(&mut contents)?;

    return Ok(contents)
}

fn parse_file(contents: String) -> Result<Vec<u64>, ParsingError> {
    let mut numbers = vec![];
    for line in contents.split('\n') {
        if line == "" {
            continue;
        }

        numbers.push(line.parse::<u64>().map_err(|_| ParsingError)?);
    }

    return Ok(numbers);
}

