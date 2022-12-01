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
    let mut calories_carried_amount = vec![];
    for elf in contents.split("\n\n") {
        let mut calories_carried = 0;
        for calorie_amount in elf.split("\n") {
            if calorie_amount == "" {
                continue;
            }

            calories_carried += calorie_amount.parse::<i32>().map_err(|_| ParsingError)?;
        }

        calories_carried_amount.push(calories_carried);
    }

    calories_carried_amount.sort();
    calories_carried_amount.reverse();

    return Ok(calories_carried_amount.get(0).ok_or(ParsingError)? + calories_carried_amount.get(1).ok_or(ParsingError) ?+ calories_carried_amount.get(2).ok_or(ParsingError)?);
}
