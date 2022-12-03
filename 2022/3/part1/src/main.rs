use std::collections::HashSet;
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
    let mut sum = 0;
    for line in contents.split("\n") {
        let mut hashset = HashSet::new();
        if line == "" {
            continue;
        }

        let (first, second) = line.split_at(line.len()/2);
        for char1 in first.chars() {
            for char2 in second.chars() {
                if char1 == char2 {
                    hashset.insert(char1);
                    break;
                }
            }
        }

        for char in hashset {
            if char.is_uppercase() {
                sum += char as u32 - 38;
            } else {
                sum += char as u32 - 96;
            }
        }
    }


    return Ok(sum as i32);
}
