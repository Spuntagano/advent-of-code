use std::fs::File;
use std::io::BufReader;
use std::io::prelude::*;

#[derive(Debug)]
struct ParsingError;

enum Action {
    North,
    East,
    South,
    West,
    Left,
    Right,
    Forward,
}

struct Ship {
    x: i32,
    y: i32,
    orientation: i32
}

impl Ship {
    fn navigate(&mut self, action: Action, value: i32) {
        match action {
            Action::North => self.y += value,
            Action::East => self.x += value,
            Action::South => self.y -= value,
            Action::West => self.x -= value,
            Action::Left => self.orientation = (self.orientation - value + 360) % 360,
            Action::Right => self.orientation = (self.orientation + value) % 360,
            Action::Forward => {
                match self.orientation {
                    0 => self.navigate(Action::North, value),
                    90 => self.navigate(Action::East, value),
                    180 => self.navigate(Action::South, value),
                    270 => self.navigate(Action::West, value),
                    _ => panic!("Bad orientation {}", self.orientation),
                }
            }
        }
    }

    fn get_distance(&self) -> i32 {
        return self.x.abs() + self.y.abs();
    }
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

    println!("{}", result.unwrap());
}

fn read_file() -> std::io::Result<String> {
    let file = File::open("input.txt")?;
    let mut buf_reader = BufReader::new(file);
    let mut contents = String::new();
    buf_reader.read_to_string(&mut contents)?;

    return Ok(contents)
}

fn parse_file(contents: String) -> Result<i32, ParsingError> {
    let mut ship = Ship {
        x: 0,
        y: 0,
        orientation: 90,
    };

    for line in contents.split('\n') {
        if line == "" {
            continue;
        }

        let (action_str, value_str) = line.split_at(1);
        let value = value_str.parse::<i32>().map_err(|_| ParsingError)?;
        let action = match action_str {
            "N" => Action::North,
            "E" => Action::East,
            "S" => Action::South,
            "W" => Action::West,
            "L" => Action::Left,
            "R" => Action::Right,
            "F" => Action::Forward,
            _ => return Err(ParsingError)
        };

        ship.navigate(action, value);
    }

    return Ok(ship.get_distance());
}
