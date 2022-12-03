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
    let mut modu = 0;
    let mut current = vec![];
    let mut hashset = HashSet::new();
    for line in contents.split("\n") {
        if line == "" {
            continue;
        }

        current.push(line);
        if modu == 2 {
            let first = current[0];
            let second = current[1];
            let third = current[2];
            for char1 in first.chars() {
                for char2 in second.chars() {
                    for char3 in third.chars() {
                        if char1 == char2 && char2 == char3 {
                            hashset.insert(char1);
                            break;
                        }
                    }
                }
            }

            for char in &hashset {
                if char.is_uppercase() {
                    sum += char.to_owned() as u32 - 38;
                } else {
                    sum += char.to_owned() as u32 - 96;
                }
            }

            hashset.clear();
            current.clear();
            modu = 0;
        } else {
            modu += 1;
        }
    }


    return Ok(sum as i32);
}
