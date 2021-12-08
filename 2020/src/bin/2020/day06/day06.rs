fn count_answers(answers: String) -> i32 {
    let mut answer_vec = answers.chars().collect::<Vec<char>>();
    answer_vec.sort();
    answer_vec.dedup();
    return answer_vec.len().try_into().unwrap();
}

fn get_question_count(input: Vec<String>) -> i32 {
    let mut tmp: String = String::from("");
    let mut dupped_answers = 0;
    input.iter().for_each(|item| {
        tmp = tmp.clone() + item;
        if item == "" {
            dupped_answers = dupped_answers + count_answers(tmp.clone());
            tmp = "".to_string();
        }
    });

    dupped_answers = dupped_answers + count_answers(tmp.clone());
    return dupped_answers;
}

fn get_unique_count(group_answers: Vec<String>) -> i32 {
    let persons_in_group = group_answers.len();
    let mut collected_answers: String = String::from("");
    let mut answer_count = 0;
    group_answers.iter().for_each(|item| {
        collected_answers = collected_answers.clone() + item;
    });

    let mut collected_answers_vec = collected_answers.chars().collect::<Vec<char>>();
    collected_answers_vec.sort();
    collected_answers_vec.dedup();
    for c in collected_answers_vec {
        let count = collected_answers.matches(c).count();
        if count == persons_in_group {
            answer_count = answer_count + 1;
        }
    }

    return answer_count;
}

fn get_all_yes_questions(input: Vec<String>) -> i32 {
    let mut group_answers: Vec<String> = Vec::new();
    let mut unique_answers = 0;
    input.iter().for_each(|item| {
        if item == "" {
            unique_answers = unique_answers + get_unique_count(group_answers.clone());
            group_answers = Vec::new();
        }
        if item != "" {
            group_answers.push(item.to_string());
        }
    });
    unique_answers = unique_answers + get_unique_count(group_answers.clone());

    return unique_answers;
}

fn main() {
    let input = file_handler::read_lines_from_file(
        "C:/Users/TimHi/Documents/GitHub/AdventOfCode/2020/src/bin/2020/day06/input/input.txt",
    );
    let part_one = get_question_count(input.clone());
    println!("Day 06 Part 01: {}", part_one);
    let part_two = get_all_yes_questions(input);
    println!("Day 06 Part 02: {}", part_two);
}
