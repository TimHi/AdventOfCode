import { SolvePartOne, SolvePartTwo } from "../../days/day02/day02";
import { describe, expect, test } from "vitest";

describe("Day 02 Part 01", () => {
  test("Expected result", () => {
    expect(SolvePartOne()).toBe(2);
  });
});

describe("Day 02 Part 02", () => {
  test("Expected result", () => {
    expect(SolvePartTwo()).toBe(4);
  });
});
