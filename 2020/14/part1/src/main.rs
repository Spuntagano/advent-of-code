use std::env;
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

    let value = result.unwrap();

    println!("{}", value);
}

fn read_file() -> std::io::Result<String> {
    let args: Vec<String> = env::args().collect();
    let file = File::open(args.get(1).unwrap_or(&String::from("input.txt")))?;
    let mut buf_reader = BufReader::new(file);
    let mut contents = String::new();
    buf_reader.read_to_string(&mut contents)?;

    return Ok(contents)
}

fn parse_file(contents: String) -> Result<i32, ParsingError> {
    let mut mask = "";
    let mut memory = HashMap::new();
    for line in contents.split('\n') {
        if line == "" {
            continue;
        }

        let line_content = line.split(' ').collect::<Vec<&str>>();
        let action = line_content.get(0).ok_or(ParsingError)?;

        if action == &"mask" {
           mask = line_content.get(2).ok_or(ParsingError)?
        } else {
            let address = action.chars().filter(|c| c.is_digit(10)).collect::<String>().parse::<u32>().map_err(|_| ParsingError)?;
            let value = line_content.get(2).ok_or(ParsingError)?.parse::<u32>().map_err(|_| ParsingError)?;
            memory.insert(address, value);
            let bytes = value.to_le_bytes();
        }
    }

    return Ok(0);
}
