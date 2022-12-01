use std::fs::File;
use std::io::BufReader;
use std::io::prelude::*;

fn main() -> std::io::Result<()> {
    let file = File::open("input.txt")?;
    let mut buf_reader = BufReader::new(file);
    let mut contents = String::new();
    buf_reader.read_to_string(&mut contents)?;

    let lines = contents.split('\n');
    let mut valid_password_count = 0;
    for line in lines {
        if line == "" {
            continue;
        }

        let split_line = line.split(' ').collect::<Vec<&str>>();

        let split_values = split_line[0].split('-').collect::<Vec<&str>>();
        let minimum_value = split_values[0].parse::<i32>().unwrap();
        let maximum_value = split_values[1].parse::<i32>().unwrap();

        let character = split_line[1].chars().nth(0).unwrap();
        let password = split_line[2];

        let mut character_count = 0;
        for current_password_character in password.chars() {
            if current_password_character == character {
                character_count = character_count + 1;
            }
        }

        if character_count >= minimum_value && character_count <= maximum_value {
            valid_password_count = valid_password_count + 1;
        }
    }

    println!("{}", valid_password_count);
    Ok(())
}
