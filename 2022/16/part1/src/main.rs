use std::collections::HashMap;
use std::env;
use std::fs::File;
use std::io::BufReader;
use std::io::prelude::*;
use std::path::Path;
use petgraph::graph::{UnGraph,NodeIndex};

#[derive(Debug)]
struct ParsingError;

struct NodeInfo {
    node_index: NodeIndex,
    name: String,
    pressure: i32,
    best_states: HashMap<String, i32>
}

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

fn parse_file(contents: String) -> Result<i32, ParsingError> {
    let mut graph = UnGraph::<String, i32>::new_undirected();
    let mut node_infos = vec![];
    let mut nodes = HashMap::new();
    for line in contents.lines() {
        let mut connections = vec![];
        let split_line = line.split_whitespace().collect::<Vec<&str>>();
        let name = split_line.get(1).unwrap().to_string();
        let rate = split_line.get(4).unwrap().split('=').collect::<Vec<&str>>().get(1).unwrap().split(';').collect::<Vec<&str>>().get(0).unwrap().parse::<i32>().unwrap();
        for split_line_item in split_line.iter().skip(9) {
            connections.push(split_line_item.split(',').collect::<Vec<&str>>().get(0).unwrap().to_string());
        }

        node_infos.push((name, rate, connections));
    }

    for node_info in node_infos.iter() {
        nodes.insert(&node_info.0, NodeInfo {
            node_index: graph.add_node(node_info.0.to_string()),
            name: node_info.0.clone(),
            pressure: node_info.1,
            best_states: HashMap::new()
        });
    }

    for node_info in node_infos.iter() {
        for connection in node_info.2.iter() {
            graph.add_edge(nodes.get(&node_info.0).unwrap().node_index, nodes.get(&connection).unwrap().node_index, 1);
        }
    }

    let mut pressures = vec![];
    step(nodes.get_mut(&"AA".to_string()).unwrap(), 0, 30, vec![], &mut pressures, &graph, &mut nodes);
    pressures.sort();
    pressures.reverse();
    return Ok(pressures.get(0).unwrap().to_owned());
}

fn step(current_node: &mut NodeInfo, total_pressure: i32, time_left: i32, opened_valves: Vec<String>, pressures: &mut Vec<i32>, graph: &UnGraph<String, i32>, nodes: &mut HashMap<&String, NodeInfo>) {
    if time_left == 0 {
        pressures.push(total_pressure);
        return;
    }

    let opened_valves_key = opened_valves.join("-");
    if !current_node.best_states.contains_key(&opened_valves_key) {
        current_node.best_states.insert(opened_valves_key.to_string(), time_left);
    }

    if current_node.best_states.get(&opened_valves_key).unwrap() < &time_left {
        current_node.best_states.insert(opened_valves_key.to_string(), time_left);
    }

    if !opened_valves.contains(&current_node.name) {
        let mut new_opened_valves = opened_valves.clone();
        new_opened_valves.push(current_node.name.clone());
        step(current_node, total_pressure, time_left-1, new_opened_valves, pressures, graph, nodes);
    }

    for node in graph.neighbors(current_node.node_index) {
        step(nodes.get_mut(graph.node_weight(node).unwrap()).unwrap(), total_pressure, time_left-1, opened_valves.clone(), pressures, graph, nodes);
    }
}
