use std::collections::HashMap;
use std::env;
use std::fs::File;
use std::io::BufReader;
use std::io::prelude::*;

fn main() {
    let contents = read_file();
    if !contents.is_ok() {
        println!("Error reading file");
        return;
    }

    let result = parse_file(contents.unwrap());
    let mut map = HashMap::new();
    for (index, num) in result.iter().enumerate() {
        if index == result.len() - 1 {
            break;
        }

        map.insert(*num, index + 1);
    }

    let mut last_position = result.len();
    let mut last_digit = result[result.len() - 1];

    loop {
        if last_position % 300000 == 0 {
            println!("{}/100%", (last_position * 100 / 30000000));
        }

        if last_position == 30000000 {
            println!("{}", last_digit);
            break;
        }

        let count = map.get(&last_digit).unwrap_or(&0).clone();
        map.insert(last_digit, last_position);
        if count == 0 {
            last_digit = count as u32;
        } else {
            last_digit = last_position as u32 - count as u32;
        }
        last_position += 1;
    }
}

fn read_file() -> std::io::Result<String> {
    let args: Vec<String> = env::args().collect();
    let file = File::open(args.get(1).unwrap_or(&String::from("input.txt")))?;
    let mut buf_reader = BufReader::new(file);
    let mut contents = String::new();
    buf_reader.read_to_string(&mut contents)?;

    return Ok(contents)
}

fn parse_file(contents: String) -> Vec<u32> {
    return contents.split(',').map(|mut x| {
        if x.contains('\n') {
            x = x.strip_suffix('\n').unwrap();
        }
        x.parse::<u32>().unwrap()
    }).collect::<Vec<u32>>();
}
