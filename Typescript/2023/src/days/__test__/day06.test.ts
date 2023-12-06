import { SolvePartOne, SolvePartTwo } from "../day06/day06";
import { describe, expect, test } from "vitest";

describe("Day 06 Part 01", () => {
  test("Expected result", () => {
    expect(SolvePartOne()).toBe(288);
  });
});

describe("Day 06 Part 02", () => {
  test("Expected result", () => {
    expect(SolvePartTwo()).toBe(71503);
  });
});
