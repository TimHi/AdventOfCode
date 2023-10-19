use string_util::StringUtils;
struct Password {
    min: i32,
    max: i32,
    character: String,
    password: String,
}

fn check_first_policy(pwd: &Password) -> bool {
    let occurence = pwd
        .password
        .matches(&pwd.character)
        .count()
        .try_into()
        .unwrap();
    let is_more_than_min = pwd.min <= occurence;
    let is_less_than_max = occurence <= pwd.max;
    return is_more_than_min && is_less_than_max;
}

fn check_second_policy(pwd: &Password) -> bool {
    let c_one = pwd.password.chars().nth(pwd.min as usize - 1).unwrap();
    let c_two = pwd.password.chars().nth(pwd.max as usize - 1).unwrap();
    let char = pwd.character.chars().nth(0).unwrap();
    if c_one == char && c_two != char {
        return true;
    }
    if c_one != char && c_two == char {
        return true;
    }
    return false;
}

fn get_valid_passwords(input: Vec<String>) {
    let mut password_counter_day_01 = 0;
    let mut password_counter_day_02 = 0;
    let mut password_list: Vec<Password> = Vec::new();

    for i in 0..input.len() {
        //lol
        let mut entry = String::from(input.get(i).unwrap());
        let mut end_bytes = entry.find("-").unwrap_or(0);
        let min_num = entry.substring(0, end_bytes);
        entry = entry.substring(end_bytes + 1, entry.len());
        end_bytes = entry.find(" ").unwrap_or(0);
        let max_num = entry.substring(0, end_bytes);
        entry = entry.substring(end_bytes + 1, entry.len());
        let char = entry.substring(0, 1);
        entry = entry.substring(1, entry.len());
        let pws = entry.substring(2, entry.len());

        let pwd = Password {
            min: min_num.parse::<i32>().unwrap(),
            max: max_num.parse::<i32>().unwrap(),
            character: char,
            password: pws,
        };

        password_list.push(pwd);
    }

    for o in 0..password_list.len() {
        if check_first_policy(password_list.get(o).unwrap()) {
            password_counter_day_01 = password_counter_day_01 + 1;
        }

        if check_second_policy(password_list.get(o).unwrap()) {
            password_counter_day_02 = password_counter_day_02 + 1;
        }
    }

    println!("Day 02 Part 01: {}", password_counter_day_01);
    println!("Day 02 Part 02: {}", password_counter_day_02);
}

fn main() {
    let input = file_handler::read_lines_from_file(
        "C:/Users/TimHi/Documents/GitHub/AdventOfCode/2020/src/bin/2020/day02/input/input.txt",
    );
    get_valid_passwords(input);
}
