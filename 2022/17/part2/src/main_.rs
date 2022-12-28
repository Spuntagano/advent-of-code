use std::collections::HashMap;
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
    for row_index in grid.len()-10..grid.len() {
        for pixel_index in 0..grid[row_index].len() {
            if grid[row_index as usize][pixel_index as usize] {
                print!("#");
            } else {
                print!(".");
            }
        }
        println!("");
    }
}

fn serialize (vec: &Vec<Vec<bool>>, current_height: i32) -> String {
    let mut str = "".to_string();
    for i in current_height..=current_height+3 {
        for j in 0..vec[0].len() {
            if i >= vec.len() as i32 || vec[i as usize][j] {
                str.push_str("1");
            } else {
                str.push_str("0");
            }
        }
    }

    return str;
}

fn deserialize (vec: &mut Vec<Vec<bool>>, str: &String) {
    for i in 0..vec.len() {
        for j in 0..vec[0].len() {
            vec[i][j] = false;
        }
    }

    for i in vec.len()-3..vec.len() {
        for j in 0..vec[0].len() {
            if str.chars().nth((vec.len() as i32 - i as i32) as usize * vec[0].len() + j).unwrap() == '1' {
                vec[i][j] = true;
            } else {
                vec[i][j] = false;
            }
        }
    }
}

fn get_height (vec: &Vec<Vec<bool>>) -> i32 {
    for i in (0..vec.len()).rev() {
        let mut row_is_empty = true;
        for j in 0..vec[0].len() {
            if vec[i][j] {
                row_is_empty = false;
                continue;
            }
        }

        if row_is_empty {
            return i as i32;
        }
    }

    return 0;
}

fn parse_file(contents: String) -> Result<i32, ParsingError> {
    const MAX_HEIGHT: i32 = 100000;
    const RESET_NUMBER: i64 = 10091 * 5;
    const BLOCK_NUMBER: i64 = 1000000000000;
    let mut cache = HashMap::new();
    let mut current_height = MAX_HEIGHT;
    let mut current_shape_index = 0;
    let mut current_wind_index = 0;
    let mut overall_height = 0;
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

    let mut block_number = 0;
    while block_number < BLOCK_NUMBER {
        let initial_key = serialize(&grid, current_height);
        if block_number % RESET_NUMBER == 0 {
            if cache.contains_key(&initial_key) {
                let (height, new_key) = cache.get(&initial_key).unwrap();
                deserialize(&mut grid, &new_key);
                overall_height += MAX_HEIGHT - height;
                block_number += RESET_NUMBER;
                current_height = get_height(&grid);
                continue;
            }
        }

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

                if (block_number + 1) % RESET_NUMBER == 0 {
                    let new_key = serialize(&grid, current_height);
                    cache.insert(initial_key.to_string(), (current_height, new_key.to_string()));
                    deserialize(&mut grid, &new_key);
                    overall_height += MAX_HEIGHT - current_height;
                    current_height = get_height(&grid);
                }

                break;
            }

            y += 1;
        }

        block_number += 1;
    }

    // _print_grid(&grid);

    return Ok(overall_height);
}
