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

    return Ok(contents);
}

fn parse_file(contents: String) -> Result<i32, ParsingError> {
    let mut sum = 0;
    for (index, block) in contents.split("\n\n").enumerate() {
        let line = block.lines().collect::<Vec<&str>>();
        let a = line.get(0).ok_or(ParsingError)?.chars().collect::<Vec<char>>();
        let b = line.get(1).ok_or(ParsingError)?.chars().collect::<Vec<char>>();
        let mut a_depth = 0;
        let mut b_depth = 0;
        let mut a_index = 0;
        let mut b_index = 0;


        loop {
            a_index += 1;
            b_index += 1;
        }
    }

    return Ok(sum as i32);
}
