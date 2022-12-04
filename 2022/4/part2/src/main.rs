use std::env;
use std::fs::File;
use std::io::BufReader;
use std::io::prelude::*;
use std::path::Path;

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

    let value = result.unwrap();

    println!("{}", value);
}

fn read_file() -> std::io::Result<String> {
    let args: Vec<String> = env::args().collect();
    let file = File::open(Path::new(args.get(1).unwrap_or(&String::from("../input.txt"))))?;
    let mut buf_reader = BufReader::new(file);
    let mut contents = String::new();
    buf_reader.read_to_string(&mut contents)?;

    return Ok(contents)
}

fn parse_file(contents: String) -> Result<i32, ParsingError> {
    let mut count = 0;
    for line in contents.split("\n") {
        if line == "" {
            continue;
        }

        let sections = line.split(',').collect::<Vec<&str>>();
        let first_section = sections.get(0).ok_or(ParsingError)?;
        let second_section = sections.get(1).ok_or(ParsingError)?;

        let first_section_split = first_section.split('-').collect::<Vec<&str>>();
        let second_section_split = second_section.split('-').collect::<Vec<&str>>();

        let first_section_low = first_section_split.get(0).ok_or(ParsingError)?.parse::<i32>().map_err(|_| ParsingError)?;
        let first_section_high = first_section_split.get(1).ok_or(ParsingError)?.parse::<i32>().map_err(|_| ParsingError)?;
        let second_section_low = second_section_split.get(0).ok_or(ParsingError)?.parse::<i32>().map_err(|_| ParsingError)?;
        let second_section_high = second_section_split.get(1).ok_or(ParsingError)?.parse::<i32>().map_err(|_| ParsingError)?;

        if (is_between(first_section_low, second_section_low, second_section_high) || is_between(first_section_high, second_section_low, second_section_high)) ||
            (is_between(second_section_low, first_section_low, first_section_high) || is_between(second_section_high, first_section_low, first_section_high)) {
            count +=1;
        }
    }

    return Ok(count);
}

fn is_between(val: i32, min: i32, max:i32) -> bool {
    return val >= min && val <= max;
}
