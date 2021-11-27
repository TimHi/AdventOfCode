/*
For example, consider just the first seven characters of FBFBBFFRLR:
    Start by considering the whole range, rows 0 through 127.
    F means to take the lower half, keeping rows 0 through 63.
    B means to take the upper half, keeping rows 32 through 63.
    F means to take the lower half, keeping rows 32 through 47.
    B means to take the upper half, keeping rows 40 through 47.
    B keeps rows 44 through 47.
    F keeps rows 44 through 45.
    The final F keeps the lower of the two, row 44.
*/
use string_util::StringUtils;

pub fn div_up(a: i32, b: i32) -> i32 {
    (a + (b - 1)) / b
}

//Could be unified with colum
fn get_row(pass: String) -> i32 {
    let mut max_row = 127;
    let mut min_row = 0;
    let mut counter = 0;
    let mut row = 0;
    let row_code = pass.substring(0, 7);
    let pass_chars = row_code.chars();
    let max_loop_count = row_code.chars().count(); //Better check if element is last?
    for c in pass_chars {
        if counter == max_loop_count - 1 {
            if c == 'F' {
                row = min_row;
            }
            if c == 'B' {
                row = max_row;
            }
        } else {
            if c == 'F' {
                max_row = max_row - div_up(max_row - min_row, 2);
            }
            if c == 'B' {
                min_row = min_row + div_up(max_row - min_row, 2);
            }
        }
        counter = counter + 1;
    }
    return row;
}

fn get_column(pass: String) -> i32 {
    let column_code = pass.substring(7, pass.len());
    let mut max_row = 7;
    let mut min_row = 0;
    let mut counter = 0;
    let mut column_number = 0;
    let pass_chars = column_code.chars();
    let max_loop_count = column_code.chars().count(); //Better check if element is last?
    for c in pass_chars {
        if counter == max_loop_count - 1 {
            if c == 'L' {
                column_number = min_row;
            }
            if c == 'R' {
                column_number = max_row;
            }
        } else {
            if c == 'L' {
                max_row = max_row - div_up(max_row - min_row, 2);
            }
            if c == 'R' {
                min_row = min_row + div_up(max_row - min_row, 2);
            }
        }
        counter = counter + 1;
    }

    return column_number;
}

fn get_seat_id(row_number: i32, column_number: i32) -> i32 {
    return row_number * 8 + column_number;
}

fn get_boarding(input: Vec<String>) {
    let mut id_list: Vec<i32> = Vec::new();
    let mut highest_id = 0;
    for line in input {
        let row_number = get_row(line.clone());
        let column_number = get_column(line);
        let seat_id = get_seat_id(row_number, column_number);
        //println!("Row: {}", row_number);
        //println!("Column: {}", column_number);
        //println!("Seat ID: {}", seat_id);
        id_list.push(seat_id);
        if seat_id > highest_id {
            highest_id = seat_id;
        }
    }
    println!("Day 05 Part 01: {}", highest_id);
    let own_id = get_own_id(id_list);
    println!("Day 05 Part 02: {}", own_id);
}

fn get_own_id(mut id_list: Vec<i32>) -> i32 {
    id_list.sort();
    let mut own_id = 0;
    for i in 1..id_list.len() - 1 {
        let checker = id_list.get(i).unwrap();
        let lower = id_list.get(i - 1).unwrap();
        let upper = id_list.get(i + 1).unwrap();

        if (checker - 1 == *lower && checker + 1 != *upper)
            || (checker - 1 != *lower && checker + 1 == *upper)
        {
            own_id = *checker;
        }
    }
    return own_id - 1;
}

fn main() {
    let input = file_handler::read_lines_from_file(
        "C:/Users/TimHi/Documents/GitHub/AdventOfCode/src/bin/2020/day05/input/input.txt",
    );
    get_boarding(input);
}
