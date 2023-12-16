import { SolvePartOne, SolvePartTwo } from "../day16/day16";
import { describe, expect, test } from "vitest";

describe("Day 16 Part 01", () => {
  test("Expected result", () => {
    expect(SolvePartOne()).toBe(46);
  });
});

describe("Day 16 Part 02", () => {
  test("Expected result", () => {
    expect(SolvePartTwo()).toBe(51);
  });
});
