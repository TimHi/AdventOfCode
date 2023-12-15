import { SolvePartOne, SolvePartTwo } from "../day12/day12";
import { describe, expect, test } from "vitest";

describe("Day 12 Part 01", () => {
  test("Expected result", () => {
    expect(SolvePartOne()).toBe(21);
  });
});

describe("Day 12 Part 02", () => {
  test("Expected result", () => {
    expect(SolvePartTwo()).toBe(525152);
  });
});
