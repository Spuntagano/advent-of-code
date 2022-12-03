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
    let mut score = 0;
    for line in contents.split("\n") {
        if line == "" {
            continue;
        }

        let choices = line.split(' ').collect::<Vec<&str>>();
        let opponent = choices.get(0).ok_or(ParsingError)?.to_owned();
        let me = choices.get(1).ok_or(ParsingError)?.to_owned();

        let points = match me {
            "X" => match opponent {
                "A" => 3,
                "B" => 1,
                "C" => 2,
                _ => panic!("")
            },
            "Y" => match opponent {
                "A" => 4,
                "B" => 5,
                "C" => 6,
                _ => panic!("")
            },
            "Z" => match opponent {
                "A" => 8,
                "B" => 9,
                "C" => 7,
                _ => panic!("")
            },
            _ => panic!("")
        };

        score += points;
    }

    return Ok(score);
}
