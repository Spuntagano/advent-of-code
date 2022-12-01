use std::fs::File;
use std::io::BufReader;
use std::io::prelude::*;

const WIDTH: usize = 31;
const HEIGHT: usize = 323;

fn main() -> std::io::Result<()> {
    let file = File::open("input.txt")?;
    let mut buf_reader = BufReader::new(file);
    let mut contents = String::new();
    buf_reader.read_to_string(&mut contents)?;

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

    let total_tree_count = count_trees(1, 1, forest) * count_trees(3, 1, forest) * count_trees(5, 1, forest) * count_trees(7, 1, forest) * count_trees(1, 2, forest);

    println!("{}", total_tree_count);

    Ok(())
}

fn count_trees(x_slope: usize, y_slope: usize, forest: [[bool; WIDTH]; HEIGHT]) -> i32 {
    let mut x = 0;
    let mut y = 0;
    let mut tree_count = 0;
    while y < HEIGHT {
        if forest[y][x] {
            tree_count = tree_count + 1;
        }

        y = y + y_slope;
        x = x + x_slope;
        x = x % WIDTH;
    }

    return tree_count;
}
