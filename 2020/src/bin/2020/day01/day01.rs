fn part_one(input: Vec<String>) {
    for o in 0..input.len() {
        for i in 0..input.len() {
            let first = input.get(o).unwrap().parse::<i32>().unwrap();
            let second = input.get(i).unwrap().parse::<i32>().unwrap();
            if first + second == 2020 {
                println!("Part 01 Day 01: {}", first * second);
                return;
            }
        }
    }
}

fn part_two(input: Vec<String>) {
    for o in 0..input.len() {
        for i in 0..input.len() {
            for u in 0..input.len() {
                let first = input.get(o).unwrap().parse::<i32>().unwrap();
                let second = input.get(i).unwrap().parse::<i32>().unwrap();
                let third = input.get(u).unwrap().parse::<i32>().unwrap();
                if first + second + third == 2020 {
                    println!("Part 02 Day 01: {}", first * second * third);
                    return;
                }
            }
        }
    }
}

fn main() {
    let start = std::time::Instant::now();
    let input = file_handler::read_lines_from_file(
        "C:/Users/TimHi/Documents/GitHub/AdventOfCode/2020/src/bin/2020/day01/input/input.txt",
    );
    part_one(input.clone());
    part_two(input);
    println!("{:?}", start.elapsed());
}
