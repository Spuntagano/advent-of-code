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
    const WIDTH: i32 = 1000;
    const HEIGHT: i32 = 159;
    let mut grid = vec![];
    for _ in 0..WIDTH {
        let mut row = vec![];
        for _ in 0..HEIGHT {
            row.push('.');
        }
        grid.push(row);
    }

    for line in contents.lines() {
        let coords = line.split(" -> ")
            .map(|x| x.split(',')
                .map(|x| x.parse::<i32>().unwrap())
                .collect::<Vec<i32>>())
            .collect::<Vec<Vec<i32>>>();

        for index in 0..coords.len()-1 {
            let x1 = coords[index][0];
            let y1 = coords[index][1];
            let x2 = coords[index+1][0];
            let y2 = coords[index+1][1];

            if x1 == x2 {
                for y in y1..=y2 {
                    grid[x1 as usize][y as usize] = '#';
                }
                for y in y2..=y1 {
                    grid[x1 as usize][y as usize] = '#';
                }
            } else if y1 == y2 {
                for x in x1..=x2 {
                    grid[x as usize][y1 as usize] = '#';
                }
                for x in x2..=x1 {
                    grid[x as usize][y1 as usize] = '#';
                }
            } else {
                panic!("oof");
            }
        }
    }

    let mut sand_count = 0;
    let start_x = 500;
    let start_y = 0;
    while grid[start_x][start_y] == '.' {
        let mut sand_coord = vec![start_x, start_y];
        loop {
            if sand_coord[1] as i32 == HEIGHT - 1 {
                grid[sand_coord[0]][sand_coord[1]] = 'o';
                sand_count += 1;
                break;
            } else if grid[sand_coord[0]][sand_coord[1] + 1] == '.' {
                sand_coord[1] += 1;
            } else if grid[sand_coord[0] - 1][sand_coord[1] + 1] == '.' {
                sand_coord[0] -= 1;
                sand_coord[1] += 1;
            } else if grid[sand_coord[0] + 1][sand_coord[1] + 1] == '.' {
                sand_coord[0] += 1;
                sand_coord[1] += 1;
            } else {
                sand_count += 1;
                grid[sand_coord[0]][sand_coord[1]] = 'o';
                break;
            }
        }
    }

    // for x in 0..WIDTH {
    //     for y in 0..HEIGHT {
    //         print!("{}", grid[x as usize][y as usize]);
    //     }
    //     print!("\n");
    // }

    return Ok(sand_count);
}
