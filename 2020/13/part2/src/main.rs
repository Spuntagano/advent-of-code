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

    let (_, departures, highest_id, highest_id_index) = result.unwrap();

    let mut current_offset = highest_id;
    let mut is_found = false;
    while !is_found {

        if current_offset % (highest_id * 100000) == 0 {
            println!("{}", current_offset);
        }

        let mut current_index = highest_id_index;
        is_found = true;
        loop {
            if departures[current_index] == -1 {
                current_index -= 1;
                continue;
            }

            if (current_offset - (highest_id_index - current_index) as i64) % departures[current_index] != 0 {
                is_found = false;
                break;
            }

            if current_index == 0 {
                break;
            }

            current_index -= 1;
        }

        current_index = highest_id_index + 1;
        while is_found && current_index < departures.len() {
            if departures[current_index] == -1 {
                current_index += 1;
                continue;
            }

            if (current_offset + current_index as i64) % departures[current_index] != 0 {
                is_found = false;
                break;
            }

            current_index += 1;
        }

        if !is_found {
            current_offset += highest_id;
        }
    }

    println!("{}", current_offset - highest_id_index as i64);
}

fn read_file() -> std::io::Result<String> {
    let args: Vec<String> = env::args().collect();
    let file = File::open(args.get(1).unwrap_or(&String::from("input.txt")))?;
    let mut buf_reader = BufReader::new(file);
    let mut contents = String::new();
    buf_reader.read_to_string(&mut contents)?;

    return Ok(contents)
}

fn parse_file(contents: String) -> Result<(i64, Vec<i64>, i64, usize), ParsingError> {
    let lines = contents.split('\n').collect::<Vec<&str>>();
    let timestamp = lines.get(0).ok_or(ParsingError)?.parse::<i64>().map_err(|_| ParsingError)?;
    let departures = lines.get(1).ok_or(ParsingError)?
        .split(',')
        .map(|value| value.parse::<i64>().unwrap_or(-1))
        .collect::<Vec<i64>>();

    let highest_id = *departures.iter().max().ok_or(ParsingError)?;
    let highest_id_index = departures.iter().position(|value| value == &highest_id).ok_or(ParsingError)?;
    return Ok((timestamp, departures, highest_id, highest_id_index));
}
