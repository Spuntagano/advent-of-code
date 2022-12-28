use std::collections::VecDeque;
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

    return Ok(contents);
}

fn parse_file(contents: String) -> Result<i32, ParsingError> {
    'outer: for (index, block) in contents.split("\n\n").enumerate() {
        let line = block.lines().collect::<Vec<&str>>();
        let a = line.get(0).ok_or(ParsingError)?;
        let b = line.get(1).ok_or(ParsingError)?;

        let mut stack_a = VecDeque::new();
        let mut stack_b = VecDeque::new();
        split_array(a, &mut stack_a);
        split_array(b, &mut stack_b);
        dbg!(&stack_a);
        dbg!(&stack_b);

        while stack_a.len() > 0 && stack_b.len() > 0 {
            let mut a = stack_a.pop_front().unwrap();
            let mut b = stack_b.pop_front().unwrap();

            if a == -1 {
                while stack_b.len() > 0 && b != -1 {
                    b = stack_b.pop_front().unwrap();
                }
            }

            if b == -1 {
                while stack_a.len() > 0 && a != -1 {
                    a = stack_a.pop_front().unwrap();
                }
            }

            println!("{} {}", a, b);
            if a > b {
                println!("{}", index);
                continue 'outer;
            }
        }
    }
    return Ok(0);
}

fn split_array(array: &str, stack: &mut VecDeque<i32>) {
    let mut bracket_count = 0;
    let mut inside = false;
    let mut commas_index = vec![];

    commas_index.push(0);
    for (index, char) in array.chars().enumerate() {
        if char == '[' {
            if !inside && bracket_count == 1 {
                inside = true;
            }
            bracket_count += 1;
        } else if char == ']' {
            if inside && bracket_count == 2 {
                inside = false;
            }
            bracket_count -= 1;
        } else if char == ',' && !inside {
            commas_index.push(index);
        }
    }
    commas_index.push(array.len() - 1);

    for (index, comma_index) in commas_index.iter().enumerate() {
        if index == 0 {
            continue;
        }
        let start = commas_index.get(index - 1).unwrap();
        let end = comma_index;
        let slice = array.get(*start+1..*end).unwrap();

        if slice.starts_with('[') && slice.ends_with(']') {
            split_array(slice, stack);
            stack.push_back(-1);
        } else if slice.len() != 0 {
            // dbg!(slice);
            stack.push_back(slice.to_string().parse::<i32>().unwrap());
        }
    }
}
