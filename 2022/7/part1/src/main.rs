use std::collections::HashMap;
use std::env;
use std::fs::File;
use std::io::BufReader;
use std::io::prelude::*;
use std::path::Path;
use std::rc::Rc;
use std::cell::RefCell;

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

struct TreeNode {
    pub value: String,
    pub children: HashMap<String, Rc<RefCell<TreeNode>>>,
    pub parent: Option<Rc<RefCell<TreeNode>>>,
}

impl TreeNode {
    pub fn new(value: String) -> TreeNode {
        return TreeNode {
            value,
            children: HashMap::new(),
            parent: None,
        };
    }

    pub fn add_child(&mut self, value: String) {
        let node = TreeNode::new(value);
        node.parent = Some(Rc::new(RefCell::new(self)));
        self.children.insert(value, Rc::new(RefCell::new(node)));
    }
}

fn parse_file(contents: String) -> Result<i32, ParsingError> {
    let mut most_calories_carried = 0;
    let mut root = Rc::new(RefCell::new(TreeNode::new(String::from("/"))));

    for line in contents.lines() {
        let split_line = line.split(" ").collect::<Vec<&str>>();
        if split_line.get(0).ok_or(ParsingError)?.to_owned() == "$" {
            match split_line.get(1).ok_or(ParsingError)?.to_owned() {
                "cd" => {
                },
                "ls" => {},
                _ => {}
            }
        } else {
            if split_line.get(0).ok_or(ParsingError)?.to_owned() == "dir" {
            
            } else {}
        }
    }

    return Ok(most_calories_carried);
}
