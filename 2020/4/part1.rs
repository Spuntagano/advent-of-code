use std::fs::File;
use std::io::BufReader;
use std::io::prelude::*;
use std::collections::HashMap;

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
        let mut is_valid = false;

        if self.byr.is_some() &&
            self.iyr.is_some() &&
            self.eyr.is_some() &&
            self.hgt.is_some() &&
            self.hcl.is_some() &&
            self.ecl.is_some() &&
            self.pid.is_some() {
                is_valid = true;
        }

        return is_valid;
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
