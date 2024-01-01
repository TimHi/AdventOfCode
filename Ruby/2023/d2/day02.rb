# frozen_string_literal: true

def get_colors_num(input, color)
  input.scan(/\b(\d+) #{color}\b/).flatten.map(&:to_i)
end

def get_game_id(input)
  input.scan(/\bGame (\d+)\b/).flatten.map(&:to_i)
end

def valid?(line)
  line
    .split(';')
    .map do |split|
      get_colors_num(split, 'red').sum <= 12 &&
        get_colors_num(split, 'green').sum <= 13 &&
        get_colors_num(split, 'blue').sum <= 14
    end
        .all? { |el| el === true }
end

def solve
  data =
    (
      if true
        DATA.readlines
      else
        File
          .open(File.join(File.dirname(__FILE__), 'full.txt'))
          .readlines
          .map(&:chomp)
      end
    )

  puts data
    .select { |line| valid?(line) }
    .map { |l| get_game_id(l) }
    .flatten
    .sum

  data.map { |line| }
end
solve

__END__
Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green