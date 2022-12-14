use std::env;
use std::fs::File;
use std::io::BufReader;
use std::io::prelude::*;
use std::path::Path;
use std::any::Any;

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

    return Ok(contents)
}

fn get_test() -> Vec<_> {
    let value = vec![
        (vec![1,1,3,1,1],
         vec![1,1,5,1,1]),

         (vec![vec![1],vec![2,3,4]],
          vec![vec![1],4]),

          (vec![9],
           vec![vec![8,7,6]]),

           (vec![vec![4,4],4,4],
            vec![vec![4,4],4,4,4]
           ),

           (vec![7,7,7,7],
            vec![7,7,7]),

            (vec![],
             vec![3]),

             (vec![vec![vec![]]],
              vec![vec![]]),

              (vec![1,vec![2,vec![3,vec![4,vec![5,6,7]]]],8,9],
               vec![1,vec![2,vec![3,vec![4,vec![5,6,0]]]],8,9]
              )];

    return value as &dyn Any;
}

fn parse_file(contents: String) -> Result<i32, ParsingError> {
    return Ok(0);
}
