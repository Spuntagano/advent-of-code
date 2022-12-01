use std::fs::File;
use std::io::BufReader;
use std::io::prelude::*;
use std::f64::consts::PI;

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
    waypoint_dx: i32,
    waypoint_dy: i32,
}

impl Ship {
    fn navigate(&mut self, action: Action, value: i32) {
        match action {
            Action::North => self.waypoint_dy += value,
            Action::East => self.waypoint_dx += value,
            Action::South => self.waypoint_dy -= value,
            Action::West => self.waypoint_dx -= value,
            Action::Left => {
                let radian = degree_to_radian(value as f64);
                let new_waypoint_dx = ((self.waypoint_dx as f64)*radian.cos()) as i32 - ((self.waypoint_dy as f64)*radian.sin()) as i32;
                let new_waypoint_dy = ((self.waypoint_dx as f64)*radian.sin()) as i32 + ((self.waypoint_dy as f64)*radian.cos()) as i32;
                self.waypoint_dx = new_waypoint_dx;
                self.waypoint_dy = new_waypoint_dy;
            },
            Action::Right => {
                let radian = degree_to_radian(value as f64);
                let new_waypoint_dx = ((self.waypoint_dy as f64)*radian.sin()) as i32 + ((self.waypoint_dx as f64)*radian.cos()) as i32;
                let new_waypoint_dy = ((self.waypoint_dy as f64)*radian.cos()) as i32 - ((self.waypoint_dx as f64)*radian.sin()) as i32;
                self.waypoint_dx = new_waypoint_dx;
                self.waypoint_dy = new_waypoint_dy;
            },
            Action::Forward => {
                self.x += self.waypoint_dx * value;
                self.y += self.waypoint_dy * value;
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

    return Ok(contents);
}

fn parse_file(contents: String) -> Result<i32, ParsingError> {
    let mut ship = Ship {
        x: 0,
        y: 0,
        waypoint_dx: 10,
        waypoint_dy: 1,
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

fn degree_to_radian(degree: f64) -> f64 {
    return (degree * PI) / 180_f64;
}
