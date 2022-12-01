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

    let (card_pk, door_pk) = result.unwrap();

    let card_loop_size = calculate_loop_size(card_pk);
    // let door_loop_size = calculate_loop_size(door_pk);

    let encryption_key = calculate_encryption_key(door_pk, card_loop_size);
    // let encryption_key = calculate_encryption_key(card_pk, door_loop_size);

    println!("{}", encryption_key);
}

fn read_file() -> std::io::Result<String> {
    let args: Vec<String> = env::args().collect();
    let file = File::open(args.get(1).unwrap_or(&String::from("input.txt")))?;
    let mut buf_reader = BufReader::new(file);
    let mut contents = String::new();
    buf_reader.read_to_string(&mut contents)?;

    return Ok(contents)
}

fn parse_file(contents: String) -> Result<(u64, u64), ParsingError> {
    let lines = contents.split('\n')
        .filter(|x| !x.is_empty())
        .map(|x| x.parse::<u64>())
        .collect::<Vec<Result<u64, _>>>();

    let card_pk = lines.get(0).ok_or_else(|| ParsingError)?.to_owned().map_err(|_| ParsingError)?;
    let door_pk = lines.get(1).ok_or_else(|| ParsingError)?.to_owned().map_err(|_| ParsingError)?;

    return Ok((card_pk, door_pk));
}

fn calculate_loop_size(pk: u64) -> u64 {
    let mut loop_size = 1;
    let mut subject_number = 1;
    let initial_subject_number = 7;
    loop {
        subject_number = encryption_step(subject_number, initial_subject_number);

        if subject_number == pk {
            break;
        }

        loop_size += 1;
    }

    return loop_size;
}

fn calculate_encryption_key(pk: u64, loop_size: u64) -> u64 {
    let mut subject_number = pk;
    for _ in 1..loop_size {
        subject_number = encryption_step(subject_number, pk);
    }

    return subject_number;
}

fn encryption_step(subject_number: u64, initial_subject_number: u64) -> u64 {
    let mut subject_number = subject_number;
    subject_number *= initial_subject_number;
    subject_number %= 20201227;
    return subject_number;
}
