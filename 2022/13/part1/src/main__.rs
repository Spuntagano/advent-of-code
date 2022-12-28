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
    let mut sum = 0;
    for (index, block) in contents.split("\n\n").enumerate() {
        let line = block.lines().collect::<Vec<&str>>();
        let a = line.get(0).ok_or(ParsingError)?;
        let b = line.get(1).ok_or(ParsingError)?;

        if split_array(a.to_string(), b.to_string()) {
            sum += index + 1;
        }
    }

    return Ok(sum as i32);
}

fn get_commas_index(array: &str) -> Vec<usize> {
    let mut inside = false;
    let mut bracket_count = 0;
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
    return commas_index;
}

fn split_string(str: &str) -> Vec<String> {
    let mut vec = vec![];
    let commas_index = get_commas_index(&str);

    for (index, comma_index) in commas_index.iter().enumerate() {
        if index == 0 {
            continue;
        }
        let start = commas_index.get(index - 1).unwrap();
        let end = comma_index;
        let slice = str.get(*start+1..*end).unwrap();
        let mut split_str = slice.to_string();
        if !slice.starts_with("[") && !slice.ends_with("]") {
            split_str.insert_str(0, "[");
            split_str.push_str("]");
        }

        vec.push(split_str);
    }

    return vec;
}

fn split_string_to_number(str: &str) -> Vec<i32> {
    let mut vec = vec![];
    let commas_index = get_commas_index(&str);

    for (index, comma_index) in commas_index.iter().enumerate() {
        if index == 0 {
            continue;
        }
        let start = commas_index.get(index - 1).unwrap();
        let end = comma_index;
        let number = str.get(*start+1..*end).unwrap().parse::<i32>();

        if number.is_ok() {
            vec.push(number.unwrap());
        }
    }

    return vec;
}

fn is_flat(str: &str) -> bool {
    let mut left_bracket_count = 0;
    let mut right_bracket_count = 0;
    for char in str.chars() {
        if char == '[' {
            left_bracket_count += 1;
        } else if char == ']' {
            right_bracket_count += 1;
        }
    }

    if left_bracket_count == 1 && right_bracket_count == 1 {
        return true;
    }

    return false;
}

fn empty_array_depth(str: &str) -> i32 {
    let mut bracket_count = 0;
    let mut is_empty = true;
    for char in str.chars() {
        if char == '[' || char == ']' {
            bracket_count += 1;
        } else {
            is_empty = false;
        }
    }

    if !is_empty {
        return -1;
    }

    return bracket_count / 2;
}

fn split_array(a: String, b: String) -> bool {
    if empty_array_depth(&a) != -1 && empty_array_depth(&b) != -1 && empty_array_depth(&a) > empty_array_depth(&b) {
        return false;
    }

    let vec_a = split_string(&a);
    let vec_b = split_string(&b);

    if vec_a.len() > vec_b.len() {
        return false;
    }

    for i in  0..vec_a.len() {
        if is_flat(&vec_a[i]) && is_flat(&vec_b[i]) {
            let mut j = 0;
            let aa = split_string_to_number(&vec_a[i]);
            let bb = split_string_to_number(&vec_b[i]);

            while j < aa.len() && j < bb.len() {
                if aa[j] > bb[j] {
                    return false;
                }

                j += 1;
            }
        } else {
            if !split_array(vec_a[i].to_owned(), vec_b[i].to_owned()) {
                return false;
            }
        }
    }

    return true;
}
