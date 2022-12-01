use std::fs::File;
use std::io::BufReader;
use std::io::prelude::*;

#[derive(Debug)]
struct ParsingError;

#[derive(Debug, Clone, PartialEq)]
enum SeatStatus {
    Occupied,
    Empty,
    Floor,
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

    let mut seats = result.unwrap();
    while !step(&mut seats) {
        // print_seats(&seats);
    }

    println!("{}", count_occupied_seats(&seats));
}

fn read_file() -> std::io::Result<String> {
    let file = File::open("input.txt")?;
    let mut buf_reader = BufReader::new(file);
    let mut contents = String::new();
    buf_reader.read_to_string(&mut contents)?;

    return Ok(contents)
}

fn parse_file(contents: String) -> Result<Vec<Vec<SeatStatus>>, ParsingError> {
    let mut seats = vec![];
    for (index, line) in contents.split('\n').enumerate() {
        if line == "" {
            continue;
        }

        seats.push(vec![]);
        for char in line.chars() {
            let seat_status = match char {
                'L' => SeatStatus::Empty,
                '#' => SeatStatus::Occupied,
                '.' => SeatStatus::Floor,
                _ => return Err(ParsingError),
            };

            seats[index].push(seat_status);
        }
    }

    return Ok(seats)
}

fn step(seats: &mut Vec<Vec<SeatStatus>>) -> bool {
    let initial_seats = seats.clone();
    for (row_index, row) in initial_seats.iter().enumerate() {
        for (column_index, _) in row.iter().enumerate() {
            let occupied_seat_count = count_adjecant_seats(&initial_seats, row_index as i32, column_index as i32);
            if (*seats)[row_index][column_index] == SeatStatus::Empty && occupied_seat_count == 0 {
                (*seats)[row_index][column_index] = SeatStatus::Occupied;
            } else if (*seats)[row_index][column_index] == SeatStatus::Occupied && occupied_seat_count >= 4 {
                (*seats)[row_index][column_index] = SeatStatus::Empty
            }
        }
    }

    return compare_seats(&initial_seats, seats);
}

fn count_adjecant_seats(initial_seats: &Vec<Vec<SeatStatus>>, row_index: i32, column_index: i32) -> i32 {
    let mut occupied_seat_count = 0;
    for i in -1..=1 as i32 {
        for j in -1..=1 as i32 {
            let check_row_index = row_index + i;
            let check_column_index = column_index + j;
            if
                (i == 0 && j == 0) ||
                check_row_index < 0 ||
                check_column_index < 0 ||
                check_row_index >= initial_seats.len() as i32 ||
                check_column_index >= initial_seats[0].len() as i32 {
                    continue;
            }

            match initial_seats[check_row_index as usize][check_column_index as usize] {
                SeatStatus::Empty => (),
                SeatStatus::Occupied => occupied_seat_count += 1,
                SeatStatus::Floor => (),
            }
        }
    }

    return occupied_seat_count;
}

fn compare_seats(initial_seats: &Vec<Vec<SeatStatus>>, seats: &Vec<Vec<SeatStatus>>) -> bool {
    let mut is_same = true;
    for (row_index, row) in seats.iter().enumerate() {
        for (column_index, seat) in row.iter().enumerate() {
            if seat != &initial_seats[row_index][column_index] {
                is_same = false;
            }
        }
    }

    return is_same;
}

fn count_occupied_seats(seats: &Vec<Vec<SeatStatus>>) -> u32 {
    let mut occupied_seat_count = 0;
    for row in seats {
        for seat in row {
            if matches!(seat, SeatStatus::Occupied) {
                occupied_seat_count += 1;
            }
        }
    }

    return occupied_seat_count;
}

#[allow(dead_code)]
fn print_seats(seats: &Vec<Vec<SeatStatus>>) {
    let mut seats_string = String::new();
    for row in seats {
        for seat in row {
            let char = match seat {
                SeatStatus::Empty => 'L',
                SeatStatus::Occupied => '#',
                SeatStatus::Floor => '.',
            };

            seats_string.push(char);
        }

        seats_string.push('\n');
    }

    print!("{}", seats_string);
}
