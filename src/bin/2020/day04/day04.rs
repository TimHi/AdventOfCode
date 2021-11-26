use std::collections::HashMap;

//ecl:gry pid:860033327 eyr:2020 hcl:#fffffd
//byr:1937 iyr:2017 cid:147 hgt:183cm

struct Passport {
    ecl: String,
    pid: String,
    eyr: i32,
    hcl: String,
    byr: i32,
    iyr: i32,
    cid: i32,
    hgt: String,
}

impl Default for Passport {
    fn default() -> Passport {
        Passport {
            ecl: "".to_string(),
            pid: "".to_string(),
            eyr: 0,
            hcl: "".to_string(),
            byr: 0,
            iyr: 0,
            cid: 0,
            hgt: "".to_string(),
        }
    }
}

fn one_liner(string: &str) -> HashMap<&str, &str> {
    string
        .split_whitespace()
        .map(|s| s.split_at(s.find(":").unwrap()))
        .map(|(key, val)| (key, &val[1..]))
        .collect()
}

use regex::Regex;
fn is_valid_haircolor(hair_color: &str) -> bool {
    let hair_color_regex = Regex::new(r"^#([0-9a-f]){6}$").unwrap();
    return hair_color_regex.is_match(hair_color);
}

fn is_valid_height(height: &str) -> bool {
    if height == "" {
        return false;
    }

    let mut height_value = 0;
    let mut height_value_temp = "".to_string();
    let mut height_unit = "".to_string();
    let chars = height.chars();

    for c in chars {
        if c.is_numeric() {
            height_value_temp.push(c);
        } else {
            height_unit.push(c);
        }
    }
    height_value = height_value_temp.parse::<i32>().unwrap();

    if height_unit == "cm" {
        if height_value > 193 || height_value < 150 {
            return false;
        }
    }

    if height_unit == "in" {
        if height_value > 76 || height_value < 59 {
            return false;
        }
    }
    return true;
}

fn has_all_fields(passport: &Passport) -> bool {
    let eye_colors = ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"];
    if passport.ecl == "" || !eye_colors.contains(&&*passport.ecl) {
        //println!("ecl wrong was: {}", passport.ecl);
        return false;
    }

    if passport.pid == "" || passport.pid.len() != 9 {
        //println!("Pid wrong was: {}", passport.pid);
        return false;
    }

    if passport.eyr == 0
        || passport.eyr < 2020
        || passport.eyr > 2030
        || passport.eyr.to_string().len() > 4
    {
        //println!("eyr wrong was: {}", passport.eyr);
        return false;
    }

    if passport.hcl == "" || !is_valid_haircolor(&passport.hcl) {
        //println!("hcl wrong was: {}", passport.hcl);
        return false;
    }

    if passport.byr == 0
        || passport.byr > 2002
        || passport.byr < 1921
        || passport.byr.to_string().len() > 4
    {
        //println!("byr wrong was: {}", passport.byr);
        return false;
    }

    if passport.iyr == 0
        || passport.iyr < 2010
        || passport.iyr > 2020
        || passport.iyr.to_string().len() > 4
    {
        //println!("iyr wrong was: {}", passport.iyr);
        return false;
    }

    if !is_valid_height(&passport.hgt) {
        //println!("hgt wrong was: {}", passport.hgt);
        return false;
    }

    return true;
}

fn check_passports(input: Vec<String>) {
    let mut passport = Passport::default();
    let mut valid_passports = 0;
    let mut checked_passports = 0;
    input.iter().for_each(|item| {
        if item == "" {
            checked_passports = checked_passports + 1;
            if has_all_fields(&passport) {
                println!(
                    "Was correct byr: {} iyr: {} eyr: {} hgt: {} hcl: {} ecl: {} pid: {}",
                    &passport.byr,
                    &passport.iyr,
                    &passport.eyr,
                    &passport.hgt,
                    &passport.hcl,
                    &passport.ecl,
                    &passport.pid
                );
                valid_passports = valid_passports + 1;
            }
            passport = Passport::default();
        }

        let line = one_liner(item);
        for (key, value) in line {
            match key {
                "ecl" => passport.ecl = value.to_string(),
                "pid" => passport.pid = value.parse().unwrap(),
                "eyr" => passport.eyr = value.parse().unwrap(),
                "hcl" => passport.hcl = value.to_string(),
                "byr" => passport.byr = value.parse().unwrap(),
                "iyr" => passport.iyr = value.parse().unwrap(),
                "cid" => passport.cid = value.parse().unwrap(),
                "hgt" => passport.hgt = value.to_string(),
                _ => println!("Wtf"),
            }
        }
    });

    checked_passports = checked_passports + 1;
    if has_all_fields(&passport) {
        println!(
            "Was correct byr: {} iyr: {} eyr: {} hgt: {} hcl: {} ecl: {} pid: {}",
            &passport.byr,
            &passport.iyr,
            &passport.eyr,
            &passport.hgt,
            &passport.hcl,
            &passport.ecl,
            &passport.pid
        );
        valid_passports = valid_passports + 1;
    }
    println!("Day 04 Part 02: {}/{}", valid_passports, checked_passports);
}
fn main() {
    let input = file_handler::read_lines_from_file(
        "C:/Users/TimHi/Documents/GitHub/AdventOfCode/src/bin/2020/day04/input/input.txt",
    );
    check_passports(input);
}
