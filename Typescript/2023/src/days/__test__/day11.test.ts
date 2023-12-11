import { SolvePartOne, SolvePartTwo } from "../day11/day11";
import { describe, expect, test } from "vitest";

describe("Day 11 Part 01", () => {
  test("Expected result", () => {
    expect(SolvePartOne()).toBe(374);
  });
});

describe("Day 11 Part 02", () => {
  test("Expected result", () => {
    expect(SolvePartTwo()).toBe(1030);
  });
});
