use std::fs::File;
use std::io::BufReader;
use std::io::prelude::*;
use std::collections::HashMap;

#[derive(Debug)]
struct ParsingError;

#[derive(Debug, Clone)]
struct Node {
    name: String,
    amount_countained: u32,
    children: Vec<Node>,
}

impl Node {
    fn insert(&mut self, node: Node) {
        self.children.push(node);
    }

    fn count(&self) -> u32 {
        let mut child_total = 0;
        for child in &self.children {
            child_total += self.amount_countained * child.count();
        }

        return self.amount_countained + child_total;
    }
}

fn main() {
    let contents = read_file();
    if !contents.is_ok() {
        println!("Error reading file");
        return;
    }

    let node = parse_file(contents.unwrap());
    if !node.is_ok() {
        println!("Error parsing file");
    }

    println!("{}", node.unwrap().count() - 1);
}

fn read_file() -> std::io::Result<String> {
    let file = File::open("input.txt")?;
    let mut buf_reader = BufReader::new(file);
    let mut contents = String::new();
    buf_reader.read_to_string(&mut contents)?;

    return Ok(contents)
}

fn insert_node(mut node: Node, hashmap: &HashMap<String, Vec<(String, u32)>>) -> Node {
    let value = hashmap.get(&node.name).unwrap();
    for (name, amount_countained) in value {
        let new_node = Node {
            name: name.to_string(),
            amount_countained: *amount_countained,
            children: vec![],
        };
        node.insert(insert_node(new_node, &hashmap));
    }

    return node;
}

fn parse_file(contents: String) -> Result<Node, ParsingError> {
    let mut hashmap: HashMap<String, Vec<(String, u32)>> = HashMap::new();
    for line in contents.split('\n') {
        if line == "" {
            continue;
        }

        let mut vec: Vec<(String, u32)> = vec![];
        let split_line = line.split(" contain ").collect::<Vec<&str>>();
        let name = split_line[0].replace("bags", "bag");
        let bag_contents = split_line[1].replace(".", "").replace("bags", "bag");
        if bag_contents != "no other bag" {
            for bag_content in bag_contents.split(", ") {
                let bag_content_amount = bag_content[0..1].parse::<u32>().unwrap();
                let bag_content_name = &bag_content[2..];
                vec.push((bag_content_name.to_string(), bag_content_amount));
            }
        }

        hashmap.insert(name.to_string(), vec);
    }

    let mut node = Node {
        name: "shiny gold bag".to_string(),
        amount_countained: 1,
        children: vec![],
    };
    node = insert_node(node, &hashmap);

    return Ok(node);
}

