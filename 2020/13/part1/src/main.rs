use std::env;
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

    let (timestamp, departures) = result.unwrap();

    let mut earliest = u32::max_value();
    let mut id = 0;
    for departure in departures {
        let time = timestamp - (timestamp % departure) + departure;
        if time < earliest {
            earliest = time;
            id = departure;
        }
    }

    let waiting_time = earliest - timestamp;
    println!("{}", waiting_time * id);
}

fn read_file() -> std::io::Result<String> {
    let args: Vec<String> = env::args().collect();
    let file = File::open(args.get(1).unwrap_or(&String::from("input.txt")))?;
    let mut buf_reader = BufReader::new(file);
    let mut contents = String::new();
    buf_reader.read_to_string(&mut contents)?;

    return Ok(contents)
}

fn parse_file(contents: String) -> Result<(u32, Vec<u32>), ParsingError> {
    let lines = contents.split('\n').collect::<Vec<&str>>();
    let timestamp = lines.get(0).ok_or(ParsingError)?.parse::<u32>().map_err(|_| ParsingError)?;
    let departures = lines.get(1).ok_or(ParsingError)?
        .split(',')
        .filter_map(|value| value.parse::<u32>().ok())
        .collect::<Vec<u32>>();

    return Ok((timestamp, departures));
}
