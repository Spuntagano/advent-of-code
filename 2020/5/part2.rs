use std::fs::File;
use std::io::BufReader;
use std::io::prelude::*;

fn main() {
    let contents = read_file();
    if !contents.is_ok() {
        println!("Error reading file");
        return;
    }

    parse_file(contents.unwrap());
}

fn read_file() -> std::io::Result<String> {
    let file = File::open("input.txt")?;
    let mut buf_reader = BufReader::new(file);
    let mut contents = String::new();
    buf_reader.read_to_string(&mut contents)?;

    return Ok(contents)
}

fn parse_file(contents: String) {
    let mut vec: Vec<i32> = vec![];
    for line in contents.split('\n') {
        if line == "" {
            continue;
        }

        let front: &mut i32 = &mut 0;
        let back: &mut i32 = &mut 127;
        let left: &mut i32 = &mut 0;
        let right: &mut i32 = &mut 7;
        for char in line.chars() {
            match char {
                'F' => search(front, back, true),
                'B' => search(front, back, false),
                'L' => search(left, right, true),
                'R' => search(left, right, false),
                _ => ()
            };
        }

        vec.push((*front * 8) + *left);
    }

    vec.sort();

    for (index, id) in vec.iter().enumerate() {
        if index != 0 && vec[index - 1] != id - 1 {
            println!("{}", id - 1);
        }
    }
}

fn search(start: &mut i32, end: &mut i32, is_low: bool) {
    if is_low {
        *end = (*start + *end) / 2;
    } else {
        if (*start + *end) % 2 != 0 {
            *start = (*start + *end + 1) / 2;
        } else {
            *start = (*start + *end) / 2;
        }
    }
    return;
}
