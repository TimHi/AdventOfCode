import pathlib
import sys
import os

def format_input(raw_data):
    return ""

def part1(data):
    return ""

def part2(data):
    return ""

def solve(raw_01, raw_02):
    data_01 = format_input(raw_01)
    data_02 = format_input(raw_02)
    solution1 = part1(data_01)
    solution2 = part2(data_02)
    return solution1, solution2


def setup_and_solve():
    current_path = os.path.dirname(os.path.realpath(__file__))

    read_raw_01 = pathlib.Path(current_path + '/example01.txt').read_text().strip()
    read_raw_02 = pathlib.Path(current_path + '/example02.txt').read_text().strip()

    solutions = solve(read_raw_01,read_raw_02)
    print("\n".join(str(solution) for solution in solutions))

setup_and_solve()