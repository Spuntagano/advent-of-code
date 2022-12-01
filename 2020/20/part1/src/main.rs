use std::env;
use std::fs::File;
use std::io::BufReader;
use std::io::prelude::*;
use std::collections::HashMap;

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
    let file = File::open(args.get(1).unwrap_or(&String::from("input.txt")))?;
    let mut buf_reader = BufReader::new(file);
    let mut contents = String::new();
    buf_reader.read_to_string(&mut contents)?;

    return Ok(contents)
}

fn parse_file(contents: String) -> Result<i32, ParsingError> {
    let mut tiles = HashMap::new();
    for block in contents.split("\n\n") {

        let mut tile = vec![];
        let mut id = 0;
        for line in block.split('\n') {
            if line == "" {
                continue;
            }

            if line.starts_with("Tile") {
                id = line.chars().filter(|c| c.is_digit(10)).collect::<String>().parse::<i32>().map_err(|_| ParsingError)?;
            }

            let mut horizontal = vec![];
            for char in line.chars() {
                if char == '#' {
                    horizontal.push(true);
                } else {
                    horizontal.push(false);
                }
            }

            tile.push(horizontal);
        }

        tiles.insert(id, tile);
    }



    return Ok(0);
}
