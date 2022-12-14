use std::env;
use std::fs::File;
use std::io::BufReader;
use std::io::prelude::*;
use std::path::Path;
use std::vec;

#[derive(Debug)]
struct ParsingError;

struct Monkey {
    item_inspected: i32,
    items: Vec<i32>,
    operation: fn(&i32) -> i32,
    test: fn(&i32) -> i32
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

fn get_input() -> Vec<Monkey> {
    let mut monkeys = vec![];
    monkeys.push(Monkey {
        item_inspected: 0,
        items: vec![57],
        operation:|value: &i32| -> i32 {
            return value * 13;
        },
        test: |value: &i32| -> i32 {
            if value % 11 == 0 {
                return 3;
            }

            return 2;
        }
    });

    monkeys.push(Monkey {
        item_inspected: 0,
        items: vec![58, 93, 88, 81, 72, 73, 65],
        operation:|value: &i32| -> i32 {
            return value + 2;
        },
        test: |value: &i32| -> i32 {
            if value % 7 == 0 {
                return 6;
            }

            return 7;
        }
    });

    monkeys.push(Monkey {
        item_inspected: 0,
        items: vec![65, 95],
        operation:|value: &i32| -> i32 {
            return value + 6;
        },
        test: |value: &i32| -> i32 {
            if value % 13 == 0 {
                return 3;
            }

            return 5;
        }
    });

    monkeys.push(Monkey {
        item_inspected: 0,
        items: vec![58, 80, 81, 83],
        operation:|value: &i32| -> i32 {
            return value * value;
        },
        test: |value: &i32| -> i32 {
            if value % 5 == 0 {
                return 4;
            }

            return 5;
        }
    });

    monkeys.push(Monkey {
        item_inspected: 0,
        items: vec![58, 89, 90, 96, 55],
        operation:|value: &i32| -> i32 {
            return value + 3;
        },
        test: |value: &i32| -> i32 {
            if value % 3 == 0 {
                return 1;
            }

            return 7;
        }
    });

    monkeys.push(Monkey {
        item_inspected: 0,
        items: vec![66, 73, 87, 58, 62, 67],
        operation:|value: &i32| -> i32 {
            return value * 7;
        },
        test: |value: &i32| -> i32 {
            if value % 17 == 0 {
                return 4;
            }

            return 1;
        }
    });
    monkeys.push(Monkey {
        item_inspected: 0,
        items: vec![85, 55, 89],
        operation:|value: &i32| -> i32 {
            return value + 4;
        },
        test: |value: &i32| -> i32 {
            if value % 2 == 0 {
                return 2;
            }

            return 0;
        }
    });

    monkeys.push(Monkey {
        item_inspected: 0,
        items: vec![73, 80, 54, 94, 90, 52, 69, 58],
        operation:|value: &i32| -> i32 {
            return value + 7;
        },
        test: |value: &i32| -> i32 {
            if value % 19 == 0 {
                return 6;
            }

            return 0;
        }
    });

    return monkeys;
}

fn _get_test() -> Vec<Monkey> {
    let mut monkeys = vec![];
    monkeys.push(Monkey {
        item_inspected: 0,
        items: vec![79, 98],
        operation:|value: &i32| -> i32 {
            return value * 19;
        },
        test: |value: &i32| -> i32 {
            if value % 23 == 0 {
                return 2;
            }

            return 3;
        }
    });

    monkeys.push(Monkey {
        item_inspected: 0,
        items: vec![54, 65, 75, 74],
        operation:|value: &i32| -> i32 {
            return value + 6;
        },
        test: |value: &i32| -> i32 {
            if value % 19 == 0 {
                return 2;
            }

            return 0;
        }
    });

    monkeys.push(Monkey {
        item_inspected: 0,
        items: vec![79, 60, 97],
        operation:|value: &i32| -> i32 {
            return value * value;
        },
        test: |value: &i32| -> i32 {
            if value % 13 == 0 {
                return 1;
            }

            return 3;
        }
    });

    monkeys.push(Monkey {
        item_inspected: 0,
        items: vec![74],
        operation:|value: &i32| -> i32 {
            return value + 3;
        },
        test: |value: &i32| -> i32 {
            if value % 17 == 0 {
                return 0;
            }

            return 1;
        }
    });

    return monkeys;
}

fn parse_file(_contents: String) -> Result<i32, ParsingError> {
    let mut monkeys = get_input();
    for _ in 0..20 {
        for monkey_index in 0..monkeys.len() {
            let monkey = &mut monkeys[monkey_index];
            let mut buff = vec![];
            for item_index in 0..monkey.items.len() {
                monkey.item_inspected += 1;
                let item = &monkey.items[item_index];
                let value = *&monkey.operation.to_owned()(item) / 3;
                let index = monkey.test.to_owned()(&value);
                buff.push((index, value));
            }
            monkey.items.clear();
            for val in buff {
                monkeys[val.0 as usize].items.push(val.1);
            }
        }
    }

    let mut items_inspected_by_monkey = monkeys.iter().map(|val| val.item_inspected).collect::<Vec<i32>>();
    items_inspected_by_monkey.sort();
    items_inspected_by_monkey.reverse();

    return Ok(items_inspected_by_monkey[0] * items_inspected_by_monkey[1]);
}
