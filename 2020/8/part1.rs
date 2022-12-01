use std::fs::File;
use std::io::BufReader;
use std::io::prelude::*;
use std::collections::HashSet;

#[derive(Debug)]
struct ParsingError;

#[derive(Debug)]
enum Op {
    Acc,
    Jmp,
    Nop,
    Unknown,
}

fn main() {
    let contents = read_file();
    if !contents.is_ok() {
        println!("Error reading file");
        return;
    }

    let operations = parse_file(contents.unwrap());
    if !operations.is_ok() {
        println!("Error parsing file");
        return;
    }

    let value = compute(operations.unwrap());
    println!("{}", value);
}

fn read_file() -> std::io::Result<String> {
    let file = File::open("input.txt")?;
    let mut buf_reader = BufReader::new(file);
    let mut contents = String::new();
    buf_reader.read_to_string(&mut contents)?;

    return Ok(contents)
}

fn parse_file(contents: String) -> Result<Vec<(Op, i32)>, ParsingError> {
    let mut operations: Vec<(Op, i32)> = vec![];
    for line in contents.split('\n') {
        if line == "" {
            continue;
        }

        let split_line = line.split(' ').collect::<Vec<&str>>();
        let op = match split_line.get(0).ok_or(ParsingError)? {
            &"acc" => Op::Acc,
            &"jmp" => Op::Jmp,
            &"nop" => Op::Nop,
            _ => Op::Unknown,
        };

        let count = split_line.get(1).ok_or(ParsingError)?.parse::<i32>().map_err(|_| ParsingError)?;

        operations.push((op, count));
    }


    return Ok(operations);
}

fn compute(operations: Vec<(Op, i32)>) -> i32 {
    let mut instruction_pointer = 0;
    let mut accumulator = 0;
    let mut executed_operation_lines = HashSet::new();

    while instruction_pointer < operations.len() as i32 {
        let inserted = executed_operation_lines.insert(instruction_pointer);
        if !inserted {
            break;
        }

        let (op, count) = &operations[instruction_pointer as usize];
        match op {
            Op::Acc => accumulator += count,
            Op::Jmp => instruction_pointer += count,
            Op::Nop => (),
            Op::Unknown => panic!("Unknown instruction")
        }

        if !matches!(op, Op::Jmp) {
            instruction_pointer = instruction_pointer + 1;
        }
    }

    return accumulator;
}

