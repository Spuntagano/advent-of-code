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

fn is_shape_inbound(grid: &Vec<Vec<bool>>, shape: &Vec<(i32, i32)>, x: i32, y: i32) -> bool {
    for pixel in shape {
        let x = x + pixel.1;
        let y = y - pixel.0;

        if x < 0 || y < 0 || x >= grid[0].len() as i32 || y >= grid.len() as i32 {
            return false;
        }
    }

    return true;
}

fn is_shape_overlap(grid: &Vec<Vec<bool>>, shape: &Vec<(i32, i32)>, x: i32, y: i32) -> bool {
    for pixel in shape {
        let x = x + pixel.1;
        let y = y - pixel.0;

        if grid[y as usize][x as usize] {
            return true;
        }
    }

    return false;
}

fn _print_grid(grid: &Vec<Vec<bool>>) {
    for row in grid {
        for pixel in row {
            if *pixel {
                print!("#");
            } else {
                print!(".");
            }
        }
        println!("");
    }
}

fn parse_file(contents: String) -> Result<i32, ParsingError> {
    const MAX_HEIGHT: i32 = 10000;
    const BLOCK_NUMBER: i32 = 2022;
    let mut current_height = MAX_HEIGHT;
    let winds = contents.trim_end().chars().collect::<Vec<char>>();
    let shapes = vec![
        vec![(0, 0), (0, 1), (0, 2), (0, 3)],
        vec![(0, 1), (1, 0), (1, 1), (1, 2), (2, 1)],
        vec![(0, 0), (0, 1), (0, 2), (1, 2), (2, 2)],
        vec![(0, 0), (1, 0), (2, 0), (3, 0)],
        vec![(0, 0), (0, 1), (1, 0), (1, 1)],
    ];

    let mut grid = vec![];
    for _ in 0..=MAX_HEIGHT {
        let row = vec![false, false, false, false, false, false, false];
        grid.push(row);
    }

    let mut current_shape_index = 0;
    let mut current_wind_index = 0;
    for _ in 0..BLOCK_NUMBER {
        let mut x = 2;
        let mut y = current_height - 3;

        let current_shape = &shapes[current_shape_index];
        current_shape_index += 1;
        if current_shape_index >= shapes.len() {
            current_shape_index = 0;
        }

        loop {
            let current_wind = match winds[current_wind_index] {
                '<' => -1,
                '>' => 1,
                _ => panic!("wtf"),
            };
            current_wind_index += 1;
            if current_wind_index >= winds.len() {
                current_wind_index = 0;
            }

            if is_shape_inbound(&grid, &current_shape, x + current_wind, y) && !is_shape_overlap(&grid, &current_shape, x + current_wind, y) {
                x += current_wind;
            }

            if !is_shape_inbound(&grid, &current_shape, x, y + 1) || is_shape_overlap(&grid, &current_shape, x, y + 1) {
                for pixel in current_shape {
                    let new_y = y - pixel.0;
                    let new_x = x + pixel.1;

                    if new_y - 1 < current_height {
                        current_height = new_y - 1;
                    }

                    grid[new_y as usize][new_x as usize] = true;
                }

                break;
            }

            y += 1;
        }
    }

    // print_grid(&grid);

    return Ok(MAX_HEIGHT - current_height);
}
