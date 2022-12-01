use std::fs::File;
use std::io::BufReader;
use std::io::prelude::*;
use std::collections::HashSet;

#[derive(Debug)]
struct ParsingError;

fn main() {
    let contents = read_file();
    if !contents.is_ok() {
        println!("Error reading file");
        return;
    }

    let answers_set = parse_file(contents.unwrap());
    if !answers_set.is_ok() {
        println!("Error parsing file");
    }

    let mut sum = 0;
    for answers in answers_set.unwrap() {
        sum += answers.len()
    }

    println!("{}", sum);
}

fn read_file() -> std::io::Result<String> {
    let file = File::open("input.txt")?;
    let mut buf_reader = BufReader::new(file);
    let mut contents = String::new();
    buf_reader.read_to_string(&mut contents)?;

    return Ok(contents)
}

fn parse_file(contents: String) -> Result<Vec<HashSet<char>>, ParsingError> {
    let mut vec: Vec<HashSet<char>> = vec![];
    for group in contents.split("\n\n") {
        if group == "" {
            continue;
        }

        let mut set = HashSet::new();
        for person in group.split('\n') {
            for answer in person.chars() {
                set.insert(answer);
            }
        }

        vec.push(set);
    }

    return Ok(vec);
}

