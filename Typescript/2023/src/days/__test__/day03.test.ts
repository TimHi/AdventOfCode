import { SolvePartOne, SolvePartTwo } from "../day03/day03";
import { describe, expect, test } from "vitest";

describe("Day 03 Part 01", () => {
  test("Expected result", () => {
    expect(SolvePartOne()).toBe(4361);
  });
});

describe("Day 03 Part 02", () => {
  test("Expected result", () => {
    SolvePartOne();
    expect(SolvePartTwo()).toBe(467835);
  });
});
