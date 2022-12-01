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

    let mut result = parse_file(contents.unwrap());

    loop {
        let last_digit = result[result.len() - 1];
        if result.len() == 2020 {
            println!("{}", last_digit);
            break
        }


        let mut last_position = result.len();
        for (index, num) in result.iter().enumerate() {
            if num == &last_digit && index != result.len() - 1 {
                last_position = index + 1;
            }
        }

        result.push((result.len() - last_position) as u32);
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
