use std::fs::File;
use std::io::BufReader;
use std::io::prelude::*;
use std::collections::HashMap;
use regex::Regex;

#[allow(dead_code)]
struct Passport {
    byr: Option<String>,
    iyr: Option<String>,
    eyr: Option<String>,
    hgt: Option<String>,
    hcl: Option<String>,
    ecl: Option<String>,
    pid: Option<String>,
    cid: Option<String>,
}

impl Passport {
    fn is_valid(&self) -> bool {
        if self.byr.is_none() ||
            self.iyr.is_none() ||
            self.eyr.is_none() ||
            self.hgt.is_none() ||
            self.hcl.is_none() ||
            self.ecl.is_none() ||
            self.pid.is_none() {
                return false;
        }

        if self.byr.unwrap().parse::<i32>().unwrap() < 1920 || self.byr.unwrap().parse::<i32>().unwrap() > 2002 {
            return false;
        }

        if self.iyr.unwrap().parse::<i32>().unwrap() < 2010 || self.iyr.unwrap().parse::<i32>().unwrap() > 2020 {
            return false;
        }

        if self.eyr.unwrap().parse::<i32>().unwrap() < 2020 || self.eyr.unwrap().parse::<i32>().unwrap() > 2030 {
            return false;
        }

        let height_collection = self.hgt.unwrap().chars().rev().collect::<String>().split_at(2);
        let height_unit = height_collection.0;
        let height_value = height_collection.1.parse::<i32>().unwrap();
        if height_unit == "cm" {
            if height_value < 150 || height_value > 193 {
                return false;
            }
        } else if height_unit == "in" {
            if height_value < 59 || height_value > 76 {
                return false;
            }
        } else {
            return false;
        }

        return true;
    }
}

fn main() -> std::io::Result<()> {
    let file = File::open("input.txt")?;
    let mut buf_reader = BufReader::new(file);
    let mut contents = String::new();
    buf_reader.read_to_string(&mut contents)?;
    let mut valid_passport_count = 0;

    for chunk in contents.split("\n\n") {
        let mut passport_fields = HashMap::new();
        for line in chunk.split('\n') {
            for field in line.split(' ') {
                if field == "" {
                    continue;
                }

                let field_collection = field.split(':').collect::<Vec<&str>>();
                passport_fields.insert(field_collection[0], field_collection[1]);
            }
        }

        let passport = Passport {
            byr: if passport_fields.get("byr").is_some() { Some(passport_fields.get("byr").unwrap().to_string()) } else { None },
            iyr: if passport_fields.get("iyr").is_some() { Some(passport_fields.get("iyr").unwrap().to_string()) } else { None },
            eyr: if passport_fields.get("eyr").is_some() { Some(passport_fields.get("eyr").unwrap().to_string()) } else { None },
            hgt: if passport_fields.get("hgt").is_some() { Some(passport_fields.get("hgt").unwrap().to_string()) } else { None },
            hcl: if passport_fields.get("hcl").is_some() { Some(passport_fields.get("hcl").unwrap().to_string()) } else { None },
            ecl: if passport_fields.get("ecl").is_some() { Some(passport_fields.get("ecl").unwrap().to_string()) } else { None },
            pid: if passport_fields.get("pid").is_some() { Some(passport_fields.get("pid").unwrap().to_string()) } else { None },
            cid: if passport_fields.get("cid").is_some() { Some(passport_fields.get("cid").unwrap().to_string()) } else { None },
        };

        if passport.is_valid() {
            valid_passport_count = valid_passport_count + 1;
        }
    }

    println!("{}", valid_passport_count);

    Ok(())
}
