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

fn is_touching(h_i: i32, h_j: i32, t_i: i32, t_j: i32) -> bool {
    let h_di = h_i - t_i;
    let h_dj = h_j - t_j;

    if h_dj.abs() <= 1 && h_di.abs() <= 1 {
        return true;
    }

    return false;
}

fn parse_file(contents: String) -> Result<i32, ParsingError> {
    let size = contents.lines().collect::<Vec<&str>>().len() as i32 * 5;
    let mut positions = vec![
        (size / 2, size / 2),
        (size / 2, size / 2),
        (size / 2, size / 2),
        (size / 2, size / 2),
        (size / 2, size / 2),
        (size / 2, size / 2),
        (size / 2, size / 2),
        (size / 2, size / 2),
        (size / 2, size / 2),
        (size / 2, size / 2),
    ];
    let mut grid = vec![];
    for i in 0..size {
        grid.push(vec![]);
        for _ in 0..size {
            grid[i as usize].push(false);
        }
    }

    for line in contents.lines() {
        let vec = line.split(' ').collect::<Vec<&str>>();
        let mut length = vec[1].parse::<i32>().map_err(|_| ParsingError)?;

        while length > 0 {
            match vec[0] {
                "L" => { positions[0].1 -= 1 },
                "R" => { positions[0].1 += 1 },
                "U" => { positions[0].0 += 1 },
                "D" => { positions[0].0 -= 1 },
                _ => panic!("tf")
            }
            for index in 0..=8 {
                if !is_touching(positions[index].0, positions[index].1, positions[index + 1].0, positions[index + 1].1) {
                    if positions[index].0 != positions[index + 1].0 && positions[index].1 != positions[index + 1].1 {
                        'outer: for i in -1..=1 {
                            for j in -1..=1 {
                                if i == 0 || j == 0 {
                                    continue;
                                }

                                if is_touching(positions[index].0, positions[index].1, positions[index + 1].0 + i, positions[index + 1].1 + j) {
                                    positions[index + 1].0 += i;
                                    positions[index + 1].1 += j;
                                    break 'outer;
                                }
                            }
                        }
                    } else {
                        'outer2: for i in -1..=1 {
                            for j in -1..=1 {
                                if ((i as i32).abs() == (j as i32).abs()) || (i == 0 && j == 0) {
                                    continue;
                                }

                                if is_touching(positions[index].0, positions[index].1, positions[index + 1].0 + i,positions[index + 1].1 + j) {
                                    positions[index + 1].0 += i;
                                    positions[index + 1].1 += j;
                                    break 'outer2;
                                }
                            }
                        }
                    }
                }

                if index == positions.len() - 2 {
                    grid[positions[index + 1].0 as usize][positions[index + 1].1 as usize] = true;
                }

            }

            length -= 1;
        }
    }

    let mut count = 0;
    for line in grid {
        for position in line {
            if position {
                count += 1;
            }
        }
    }

    return Ok(count);
}
