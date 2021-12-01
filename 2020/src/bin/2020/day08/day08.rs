use arrayvec::ArrayVec;

fn get_instruction(instruction: String) -> (String, i32) {}

fn get_duplicate(input: Vec<String>) {
    let mut acc = 0;
    let array: ArrayVec<_, 9> = input.into_iter().collect();
    let array: [String; 9] = array.into_inner().unwrap();
    println!("{:?}", array);
}

fn main() {
    let input = file_handler::read_lines_from_file(
        "C:/Users/TimHi/Documents/GitHub/AdventOfCode/src/bin/2020/day08/input/input.txt",
    );
    get_duplicate(input);
}
