import { SolvePartOne, SolvePartTwo } from "../day01/day01";
import { describe, expect, test } from "vitest";

describe("Day 01 Part 01", () => {
  test("Expected result", () => {
    expect(SolvePartOne()).toBe(142);
  });
});

describe("Day 01 Part 02", () => {
  test("Expected result", () => {
    expect(SolvePartTwo()).toBe(281);
  });
});
