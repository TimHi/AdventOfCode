import { SolvePartOne, SolvePartTwo } from "../day17/day17";
import { describe, expect, test } from "vitest";

describe("Day 17 Part 01", () => {
  test("Expected result", () => {
    expect(SolvePartOne()).toBe(102);
  });
});

describe("Day 17 Part 02", () => {
  test("Expected result", () => {
    expect(SolvePartTwo()).toBe(94);
  });
});
