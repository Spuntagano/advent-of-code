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
    let mut height_grid = vec![];
    for (i, line) in contents.lines().enumerate() {
        height_grid.push(vec![]);
        for char in line.chars() {
            height_grid[i].push(char.to_digit(10).ok_or(ParsingError)? as i32);
        }
    }

    let directions = vec![
        (0,1),
        (1,0),
        (-1,0),
        (0,-1)
    ];

    let mut highest_score = 0;
    for (i, line) in height_grid.iter().enumerate() {
        for (j, this_tree) in line.iter().enumerate() {
            let mut scores = vec![];
            for direction in &directions {
                let mut score = 0;
                let mut i = i as i32 + direction.0;
                let mut j = j as i32 + direction.1;
                while i >= 0 && i < height_grid.len() as i32 && j >= 0 && j < height_grid[0].len() as i32 {
                    score += 1;
                    let tree = height_grid[i as usize][j as usize];
                    if tree >= this_tree.to_owned() {
                        break;
                    }

                    i += direction.0;
                    j += direction.1;
                }
                scores.push(score);
            }

            let multiplied_score = scores.iter().fold(1, |acc, val| acc * val);

            if multiplied_score > highest_score {
                highest_score = multiplied_score;
            }
        }
    }

    return Ok(highest_score);
}
