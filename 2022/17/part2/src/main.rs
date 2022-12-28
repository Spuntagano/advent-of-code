use std::collections::HashMap;
use std::env;
use std::fs::File;
use std::io::BufReader;
use std::io::prelude::*;
use std::path::Path;

#[derive(Debug)]
struct ParsingError;

const SHAPE_COUNT: i64 = 5;
const WIND_COUNT: i64 = 10;
const MAX_HEIGHT: i64 = 100000;
const BLOCK_NUMBER: i64 = 1000000000000;
const RESET_HEIGHT: i64 = SHAPE_COUNT * WIND_COUNT;

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

fn is_shape_inbound(grid: &Vec<Vec<bool>>, shape: &Vec<(i64, i64)>, x: i64, y: i64) -> bool {
    for pixel in shape {
        let x = x + pixel.1;
        let y = y - pixel.0;

        if x < 0 || y < 0 || x >= grid[0].len() as i64 || y >= grid.len() as i64 {
            return false;
        }
    }

    return true;
}

fn is_shape_overlap(grid: &Vec<Vec<bool>>, shape: &Vec<(i64, i64)>, x: i64, y: i64) -> bool {
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
    for row_index in 0..grid.len() {
        for pixel_index in 0..grid[row_index].len() {
            if grid[row_index as usize][pixel_index as usize] {
                print!("#");
            } else {
                print!(".");
            }
        }
        println!("");
    }
    println!("");
}

fn _print_grid_bottom(grid: &Vec<Vec<bool>>) {
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
    println!("");
}

fn _print_grid_top(grid: &Vec<Vec<bool>>, current_height: i64) {
    for row_index in grid.len()-current_height as usize-20..grid.len()-current_height as usize+20 {
        for pixel_index in 0..grid[row_index].len() {
            if grid[row_index as usize][pixel_index as usize] {
                print!("#");
            } else {
                print!(".");
            }
        }
        println!("");
    }
    println!("");
}

fn serialize (vec: &Vec<Vec<bool>>, current_height: i64) -> String {
    let mut str = "".to_string();
    for i in MAX_HEIGHT-current_height+1..=MAX_HEIGHT-current_height+4 {
        for j in 0..vec[0].len() {
            if i <= MAX_HEIGHT && vec[i as usize][j] {
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

    for i in vec.len()-4..vec.len() {
        for j in 0..vec[0].len() {
            if str.chars().nth((vec.len() as i64 - i as i64 - 4).abs() as usize * vec[0].len() + j).unwrap() == '1' {
                vec[i][j] = true;
            } else {
                vec[i][j] = false;
            }
        }
    }
}

fn get_height (vec: &Vec<Vec<bool>>) -> i64 {
    for i in (0..vec.len()).rev() {
        let mut row_is_empty = true;
        for j in 0..vec[0].len() {
            if vec[i][j] {
                row_is_empty = false;
                continue;
            }
        }

        if row_is_empty {
            return (vec.len() - i - 1) as i64;
        }
    }

    return vec.len() as i64;
}

fn parse_file(contents: String) -> Result<i64, ParsingError> {
    let mut block_count = 0;
    let mut total_height = 0;
    let mut cache: HashMap<String, (String, i64, i64)> = HashMap::new();
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

    while block_count < BLOCK_NUMBER {
        let current_height = get_height(&grid);
        let initial_key = serialize(&grid, current_height);
        let after_key;
        if cache.contains_key(&initial_key) {
            let res = cache.get(&initial_key).unwrap();
            after_key = res.0.to_string();
            total_height += res.1;
            block_count += res.2 as i64;
        } else {
            let res = run(&mut grid, &shapes, &winds, block_count, current_height);
            after_key = res.0.to_string();
            total_height += res.1;
            block_count += res.2 as i64;
            cache.insert(initial_key.to_string(), (after_key.to_string(), res.1, res.2));
        }
        // _print_grid_top(&grid, current_height);
        deserialize(&mut grid, &after_key);
        // _print_grid_bottom(&grid);
        _print_grid(&grid);
        // dbg!(&cache);
    }

    return Ok(total_height);
}

fn run (grid: &mut Vec<Vec<bool>>, shapes: &Vec<Vec<(i64, i64)>>, winds: &Vec<char>, block_count: i64, current_height: i64) -> (String, i64, i64) {
    let mut new_height = current_height;
    let mut new_blocks = 0;
    let mut current_shape_index = 0;
    let mut current_wind_index = 0;
    'outer: for _ in 0..RESET_HEIGHT {
        let mut x = 2;
        let mut y = MAX_HEIGHT - new_height - 3;

        let current_shape = &shapes[current_shape_index];
        current_shape_index += 1;
        if current_shape_index >= SHAPE_COUNT as usize {
            current_shape_index = 0;
        }

        loop {
            let current_wind = match winds[current_wind_index] {
                '<' => -1,
                '>' => 1,
                _ => panic!("wtf"),
            };
            current_wind_index += 1;
            if current_wind_index >= WIND_COUNT as usize {
                current_wind_index = 0;
            }

            if is_shape_inbound(&grid, &current_shape, x + current_wind, y) && !is_shape_overlap(&grid, &current_shape, x + current_wind, y) {
                x += current_wind;
            }

            if !is_shape_inbound(&grid, &current_shape, x, y + 1) || is_shape_overlap(&grid, &current_shape, x, y + 1) {
                for pixel in current_shape {
                    let new_y = y - pixel.0;
                    let new_x = x + pixel.1;

                    if MAX_HEIGHT - new_y + 1 > new_height {
                        new_height = MAX_HEIGHT - new_y + 1;
                    }

                    grid[new_y as usize][new_x as usize] = true;
                }

                new_blocks += 1;
                if block_count + new_blocks == BLOCK_NUMBER {
                    break 'outer;
                }

                break;
            }

            y += 1;
        }
    }
    let key = serialize(&grid, new_height);
    return (key, new_height - current_height, new_blocks);
}
