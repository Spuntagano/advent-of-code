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
    let mut diff1 = 0;
    let mut diff3 = 0;
    let mut numbers = vec![0];
    for line in contents.split('\n') {
        if line == "" {
            continue;
        }

        numbers.push(line.parse::<u64>().map_err(|_| ParsingError)?);
    }

    numbers.sort();
    for (index, number) in numbers.iter().enumerate() {
        if index != 0 {
            let diff = number - numbers[index - 1];
            match diff {
                1 => diff1 += 1,
                2 => (),
                3 => diff3 += 1,
                _ => panic!("Yikes"),
            };
        }
    }

    diff3 += 1;

    return Ok(diff1 * diff3);
}
