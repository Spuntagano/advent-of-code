use std::fs::File;
use std::io::BufReader;
use std::io::prelude::*;

#[derive(Debug)]
struct ParsingError;

#[derive(Debug)]
struct NumberNotFoundError;

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
    let number = find_first_invalid_number(&numbers);
    if !number.is_ok() {
        println!("No number found");
        return;
    }

    let number = number.unwrap();
    let mut range_found = None;
    let mut window_start = 0;
    while window_start < numbers.len() {
        let mut window_end = window_start + 1;
        let mut sum = 0;
        while sum < number {
            let window = &numbers[window_start..=window_end];
            sum = get_sum(window);

            if sum == number {
                range_found = Some(window);
                break;
            }

            window_end = window_end + 1;
        }

        if range_found.is_some() {
            break;
        }

        window_start = window_start + 1;
    }

    if range_found.is_none() {
        println!("Not found");
    }

    let range_found = range_found.unwrap();
    let min = range_found.iter().min().unwrap();
    let max = range_found.iter().max().unwrap();
    println!("{}", min + max);
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

fn find_first_invalid_number(numbers: &Vec<u64>) -> Result<u64, NumberNotFoundError> {
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
            return Ok(numbers[current_number]);
        }

        current_number = current_number + 1;
    }

    return Err(NumberNotFoundError);
}

fn get_sum(numbers: &[u64]) -> u64 {
    return numbers.iter().sum::<u64>();
}
