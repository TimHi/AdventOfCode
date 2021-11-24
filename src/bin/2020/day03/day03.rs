fn check_trees(input: Vec<String>, down: usize, right: usize) -> i64 {
    let mut tree_index = right;
    let mut tree_counter = 0;

    for i in (0..input.len()).step_by(down) {
        //Dont go out of bounds
        if i + down < input.len() {
        //One down, three to the right
        let char_row: Vec<char> = input.get(i + down).unwrap().chars().collect();
        let mut full_vec = char_row.clone();
        let mut n = 0;
        //Repeat until valid index is possible
        while full_vec.len() <= tree_index {
            full_vec = char_row.repeat(n);
            n = n + 1;
        }

        let c_one = full_vec.get(tree_index).unwrap();
        match c_one {
            '#' => tree_counter = tree_counter + 1,
            _ => tree_counter = tree_counter + 0, //TODO can this be deleted somehow?
        }
        tree_index = tree_index + right;
        }
    }
    return tree_counter;
}

fn main() {
    let start = std::time::Instant::now();
    let input = file_handler::read_lines_from_file("C:/Users/TimHi/Documents/GitHub/AdventOfCode/src/bin/2020/day03/input/input.txt");
    println!("Day 03 Part 01: {}", check_trees(input.clone(), 1, 3));
    let part_two : i64 = (check_trees(input.clone(), 1, 1) * check_trees(input.clone(), 1, 3) * check_trees(input.clone(), 1, 5) * check_trees(input.clone(), 1, 7) * check_trees(input.clone(), 2, 1)) as i64;
    println!("Day 03 Part 02: {}", part_two);
    println!("{:?}", start.elapsed());
}