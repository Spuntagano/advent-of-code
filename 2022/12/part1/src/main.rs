use std::collections::VecDeque;
use std::env;
use std::fs::File;
use std::io::BufReader;
use std::io::prelude::*;
use std::path::Path;
use std::vec;

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
    let mut grid = vec![];
    let mut distance_grid = vec![];
    let mut starting_position = (0, 0);
    let mut ending_position = (0, 0);
    let mut queue = VecDeque::new();
    let mut shortest_step_count = -1;
    let directions: Vec<(i32, i32)> = vec![(0,1), (1,0), (-1,0), (0,-1)];
    for (y, line) in contents.lines().enumerate() {
        let mut grid_line = vec![];
        let mut distance_grid_line = vec![];
        for (x, char) in line.chars().enumerate() {
            match char {
                'S' => {
                    grid_line.push('a' as u32 - 96);
                    distance_grid_line.push(0);
                    starting_position.0 = y as i32;
                    starting_position.1 = x as i32;
                },
                'E' => {
                    grid_line.push('z' as u32 - 96);
                    distance_grid_line.push(99999999);
                    ending_position.0 = y as i32;
                    ending_position.1 = x as i32;
                },
                _ => {
                    grid_line.push(char as u32 - 96);
                    distance_grid_line.push(99999999);
                }
            };
        }
        grid.push(grid_line);
        distance_grid.push(distance_grid_line);
    }

    queue.push_back((starting_position.0, starting_position.1));
    'outer: while !queue.is_empty() {
        let position = queue.pop_front().unwrap();
        let y = position.0;
        let x = position.1;
        for direction in &directions {
            let new_y = y + direction.0;
            let new_x = x + direction.1;

            if new_x >= 0 && new_x < grid[0].len() as i32 && new_y >= 0 && new_y < grid.len() as i32 {
                if grid[y as usize][x as usize] >= grid[new_y as usize][new_x as usize] - 1 {
                    if distance_grid[y as usize][x as usize] + 1 < distance_grid[new_y as usize][new_x as usize] {
                        distance_grid[new_y as usize][new_x as usize] = distance_grid[y as usize][x as usize] + 1;
                        queue.push_back((new_y, new_x));
                    }

                    if new_y == ending_position.0 && new_x == ending_position.1 {
                        shortest_step_count = distance_grid[new_y as usize][new_x as usize];
                        break 'outer;
                    }
                }
            }
        }
    }

    return Ok(shortest_step_count);
}
