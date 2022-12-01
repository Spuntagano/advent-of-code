use std::fs::File;
use std::io::BufReader;
use std::io::prelude::*;

fn main() -> std::io::Result<()> {
    let file = File::open("input.txt")?;
    let mut buf_reader = BufReader::new(file);
    let mut contents = String::new();
    buf_reader.read_to_string(&mut contents)?;

    const WIDTH: usize = 31;
    const HEIGHT: usize = 323;

    let mut x = 0;
    let mut y = 0;

    let mut tree_count = 0;
    let mut forest: [[bool; WIDTH]; HEIGHT] = [[false; WIDTH]; HEIGHT];

    for (i, line) in contents.split('\n').enumerate() {
        if line == "" {
            continue;
        }

        for (j, char) in line.chars().enumerate() {
            if char == '#' {
                forest[i][j] = true;
            }
        }
    }

    while y < HEIGHT {
        if forest[y][x] {
            tree_count = tree_count + 1;
        }

        y = y + 1;
        x = x + 3;
        x = x % WIDTH;
    }

    println!("{}", tree_count);

    Ok(())
}
