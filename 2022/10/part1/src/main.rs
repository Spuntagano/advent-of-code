use std::env;
use std::fs::File;
use std::io::BufReader;
use std::io::prelude::*;
use std::path::Path;
use std::vec;

#[derive(Debug)]
struct ParsingError;

#[derive(Copy, Clone, PartialEq)]
enum Operation {
    Addx,
    Noop
}

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

fn increment_cycle(cycle: &mut i32, x: &mut i32, values: &mut Vec<i32>) {
    *cycle += 1;
    if cycle.to_owned() % 20 == 0 && cycle.to_owned() % 40 != 0 {
        println!("{} {} {}", cycle, x, cycle.to_owned() as i32 * x.to_owned());
        values.push(cycle.to_owned() as i32 * x.to_owned());
    }
}

fn parse_file(contents: String) -> Result<i32, ParsingError> {
    let mut values = vec![];
    let mut x = 1;
    let mut cycle = 1;
    for line in contents.lines() {
        let split_line = line.split(' ').collect::<Vec<&str>>();
        let operation = match split_line.get(0).ok_or(ParsingError)?.to_owned() {
            "addx" => Operation::Addx,
            "noop" => Operation::Noop,
            _ => panic!(":(")
        };

        match operation {
            Operation::Addx => {
                increment_cycle(&mut cycle, &mut x, &mut values);
                x += split_line.get(1).ok_or(ParsingError)?.parse::<i32>().map_err(|_| ParsingError)?;
                increment_cycle(&mut cycle, &mut x, &mut values)
            },
            Operation::Noop => {
                increment_cycle(&mut cycle, &mut x, &mut values)
            }
        }
    }

    return Ok(values.iter().sum());
}
