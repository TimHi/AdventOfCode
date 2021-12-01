struct bag {
    color: String,
    vibrance: String,
    capacity: Vec<(i32, String, String)>,
    shiny_gold_capacity: i32,
}

impl Default for bag {
    fn default() -> bag {
        bag {
            color: "".to_string(),
            vibrance: "".to_string(),
            capacity: Vec::new(),
            shiny_gold_capacity: 0,
        }
    }
}

fn get_rule_count(bag_list: Vec<bag>) -> i32 {
    /*
    Iterate through bag list
    Iterate through cap vector and check for
    each sub-bag (get by vibrance & color) the shiny gold count
    Iterate through sub bags cap vector until its empty (repeat this)
    */
    let mut shiny_count = 0;

    return shiny_count;
}

fn get_color_count(rules: Vec<String>) -> i32 {
    let mut koffer_list: Vec<bag> = Vec::new();
    for rule in rules {
        let w = rule.split(" ");
        let words = w.collect::<Vec<&str>>();
        let vibrance = words.get(0).unwrap().to_string();
        let color = words.get(1).unwrap().to_string();
        let mut koffer = bag::default();

        let mut cap_vec: Vec<(i32, String, String)> = Vec::new();
        koffer.color = color;
        koffer.vibrance = vibrance;
        let mut shiny_counter = 0;
        for o in (4..words.len()).step_by(4) {
            let capacity = words.get(o).unwrap().to_string();
            if capacity == "no" {
                break;
            }
            let cap = capacity.parse().unwrap();
            let vibrance = words.get(o + 1).unwrap();
            let color = words.get(o + 2).unwrap();
            cap_vec.push((cap, vibrance.to_string(), color.to_string()));

            if vibrance.to_string() == "shiny" && color.to_string() == "gold" {
                shiny_counter = shiny_counter + 1;
            }
            println!("{}:{}:{}", cap, vibrance, color);
        }
        koffer.shiny_gold_capacity = shiny_counter;
        koffer.capacity = cap_vec;
        koffer_list.push(koffer);
    }
    let bag_rules = get_rule_count(koffer_list);
    return bag_rules;
}

//TODO Rework with Hashmap
fn main() {
    let input = file_handler::read_lines_from_file(
        "C:/Users/TimHi/Documents/GitHub/AdventOfCode/src/bin/2020/day07/input/input.txt",
    );
    let part_one = get_color_count(input);
    println!("Day 07 - Part 01: {}", part_one);
}
