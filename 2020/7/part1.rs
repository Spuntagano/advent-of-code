use std::fs::File;
use std::io::BufReader;
use std::io::prelude::*;
use std::collections::HashMap;

#[derive(Debug)]
struct ParsingError;

#[derive(Debug, Clone)]
struct Node {
    name: String,
    children: Vec<Node>,
}

impl Node {
    fn insert(&mut self, node: Node) {
        self.children.push(node);
    }

    fn search(&self, search_name: String) -> bool {
        if self.name == search_name {
            return true;
        }

        for child in &self.children {
            if child.search(search_name.to_string()) {
               return true;
            };
        }

        return false;
    }
}

fn main() {
    let contents = read_file();
    if !contents.is_ok() {
        println!("Error reading file");
        return;
    }

    let roots = parse_file(contents.unwrap());
    if !roots.is_ok() {
        println!("Error parsing file");
    }

    let bag_name = "shiny gold bag";
    let mut count = 0;
    for root in roots.unwrap() {
        if root.name == String::from(bag_name) {
            continue;
        }

        if root.search(String::from(bag_name)) {
            count = count + 1;
        }
    }

    println!("{}", count);
}

fn read_file() -> std::io::Result<String> {
    let file = File::open("input.txt")?;
    let mut buf_reader = BufReader::new(file);
    let mut contents = String::new();
    buf_reader.read_to_string(&mut contents)?;

    return Ok(contents)
}

fn insert_node(mut node: Node, hashmap: &HashMap<String, Vec<String>>) -> Node {
    let value = hashmap.get(&node.name).unwrap();
    for val in value {
        let new_node = Node {
            name: val.to_string(),
            children: vec![],
        };
        node.insert(insert_node(new_node, &hashmap));
    }

    return node;
}

fn parse_file(contents: String) -> Result<Vec<Node>, ParsingError> {
    let mut roots: Vec<Node> = vec![];
    let mut hashmap: HashMap<String, Vec<String>> = HashMap::new();
    for line in contents.split('\n') {
        if line == "" {
            continue;
        }

        let mut vec: Vec<String> = vec![];
        let split_line = line.split(" contain ").collect::<Vec<&str>>();
        let name = split_line[0].replace("bags", "bag");
        let bag_contents = split_line[1].replace(".", "").replace("bags", "bag");
        if bag_contents != "no other bag" {
            for bag_content in bag_contents.split(", ") {
                let bag_content_name = &bag_content[2..];
                vec.push(bag_content_name.to_string());
            }
        }

        hashmap.insert(name.to_string(), vec);
    }

    for key in hashmap.keys() {
        let mut node = Node {
            name: key.to_string(),
            children: vec![],
        };
        node = insert_node(node.clone(), &hashmap);
        roots.push(node);
    }

    return Ok(roots);
}

