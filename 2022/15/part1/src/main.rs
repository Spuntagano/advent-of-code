use std::collections::HashSet;
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
    let target_row = 2000000;
    let mut highest_value = 0;
    let mut lowest_value = 0;
    let mut row = vec![];
    let mut ranges = vec![];
    let mut sum = 0;
    let mut set = HashSet::new();
    for line in contents.lines() {
        let space_split = line.split_whitespace().collect::<Vec<&str>>();
        let sensor_x = space_split[2].get(2..space_split[2].len()-1).ok_or(ParsingError)?.parse::<i32>().map_err(|_| ParsingError)?;
        let sensor_y = space_split[3].get(2..space_split[3].len()-1).ok_or(ParsingError)?.parse::<i32>().map_err(|_| ParsingError)?;
        let beacon_x = space_split[8].get(2..space_split[8].len()-1).ok_or(ParsingError)?.parse::<i32>().map_err(|_| ParsingError)?;
        let beacon_y = space_split[9].get(2..space_split[9].len()).ok_or(ParsingError)?.parse::<i32>().map_err(|_| ParsingError)?;


        let manhattan_distance = calculate_manhattan_distance(sensor_x, sensor_y, beacon_x, beacon_y);
        let bottom = sensor_y + manhattan_distance;
        let top = sensor_y - manhattan_distance;

        if bottom >= target_row && top <= target_row {
            let distance = ((sensor_y - target_row).abs() - manhattan_distance).abs();
            ranges.push(sensor_x-distance..sensor_x+distance);
            if sensor_x + distance > highest_value {
                highest_value = sensor_x + distance
            }

            if sensor_x - distance > lowest_value {
                lowest_value = sensor_x - distance
            }
        }

        if beacon_y == target_row {
            set.insert(beacon_x);
        }
    }

    for _ in 0..highest_value + lowest_value.abs() {
        row.push(false);
    }

    for range in ranges {
        for x in range {
            row[(x + lowest_value) as usize] = true;
        }
    }

    for x in row {
        if x {
            sum += 1;
        }
    }

    return Ok(sum);
}

fn calculate_manhattan_distance(x1: i32, y1: i32, x2: i32, y2: i32) -> i32 {
    return (x1 - x2).abs() + (y1 - y2).abs();
}
