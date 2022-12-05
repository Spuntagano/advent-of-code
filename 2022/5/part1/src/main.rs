use std::collections::VecDeque;
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

fn parse_file(contents: String) -> Result<String, ParsingError> {
    let mut stacks = vec![];
    let blocks = contents.split("\n\n").collect::<Vec<&str>>();
    for line in blocks.get(0).ok_or(ParsingError)?.split('\n') {
        let mut i = 0;
        let mut string_index = 1;
        let chars = line.chars().collect::<Vec<char>>();
        while chars.get(string_index).is_some() {
            let char = chars[string_index];
            if char != ' ' && !char.is_digit(10) {
                while stacks.get(i).is_none() {
                    stacks.push(VecDeque::new());
                }

                stacks[i].push_back(char);
            }

            i += 1;
            string_index = (i * 4) + 1
        }
    }

    for line in blocks.get(1).ok_or(ParsingError)?.split('\n') {
        if line == "" {
            continue;
        }

        let words = line.split(' ').collect::<Vec<&str>>();
        let mut count = words.get(1).ok_or(ParsingError)?.parse::<i32>().map_err(|_| ParsingError)?;
        let from = words.get(3).ok_or(ParsingError)?.parse::<usize>().map_err(|_| ParsingError)? - 1;
        let to = words.get(5).ok_or(ParsingError)?.parse::<usize>().map_err(|_| ParsingError)? - 1;

        while count > 0 {
            let char = stacks[from].pop_front().ok_or(ParsingError)?;
            stacks[to].push_front(char);
            count -= 1;
        }
    }

    let mut string = String::from("");
    for stack in &stacks {
        string.push(stack.get(0).ok_or(ParsingError)?.to_owned());
    }

    return Ok(string);
}
