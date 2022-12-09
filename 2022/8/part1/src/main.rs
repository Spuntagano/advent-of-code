use std::env;
use std::fs::File;
use std::io::BufReader;
use std::io::prelude::*;
use std::path::Path;

#[derive(Debug)]
struct ParsingError;

struct Direction {
    depth: (i32, i32),
    width: (i32, i32),
    start: (i32, i32)
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

fn parse_file(contents: String) -> Result<i32, ParsingError> {
    let mut height_grid = vec![];
    let mut visibiliy_grid = vec![];
    for (i, line) in contents.lines().enumerate() {
        height_grid.push(vec![]);
        visibiliy_grid.push(vec![]);
        for char in line.chars() {
            height_grid[i].push(char.to_digit(10).ok_or(ParsingError)? as i32);
            visibiliy_grid[i].push(false);
        }
    }

    let directions = vec![
        Direction { // N
            width: (0, 1),
            depth: (1, 0),
            start: (0, 0)
        },
        Direction { // E
            width: (1, 0),
            depth: (0, -1),
            start: (0, height_grid[0].len() as i32 -1)
        },
        Direction { // S
            width: (0, -1),
            depth: (-1, 0),
            start: (height_grid.len() as i32 -1, height_grid[0].len() as i32 -1)
        },
        Direction { // W
            width: (-1, 0),
            depth: (0, 1),
            start: (height_grid.len() as i32 -1, 0)
        },
    ];

    for direction in directions {
        let mut i = direction.start.0;
        let mut j = direction.start.1;
        while i >= 0 && i < height_grid.len() as i32 && j >= 0 && j < height_grid[0].len() as i32 {
            let mut highest_tree = -1;
            while i >= 0 && i < height_grid.len() as i32 && j >= 0 && j < height_grid[0].len() as i32 {
                let tree = height_grid[i as usize][j as usize];
                if tree > highest_tree {
                    highest_tree = tree;
                    visibiliy_grid[i as usize][j as usize] = true;
                }

                i += direction.depth.0;
                j += direction.depth.1;
            }

            if direction.width.0 == 0 {
                i = direction.start.0;
            } else {
                i += direction.width.0;
            }

            if direction.width.1 == 0 {
                j = direction.start.1;
            } else {
                j += direction.width.1;
            }
        }
    }

    let mut str = String::from("");
    let mut visible_tree_count = 0;
    for line in visibiliy_grid {
        for point in line {
            if point {
                str.push('O');
                visible_tree_count += 1;
            } else {
                str.push('X');
            }
        }
        str.push('\n')
    }

    // println!("{}", str);

    return Ok(visible_tree_count);
}
