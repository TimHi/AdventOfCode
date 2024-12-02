import { SolvePartOne, SolvePartTwo } from "../day02/day02";
import { describe, expect, test } from "vitest";

describe("Day 02 Part 01", () => {
  test("Expected result", () => {
    expect(SolvePartOne()).toBe(11);
  });
});

describe("Day 02 Part 02", () => {
  test("Expected result", () => {
    expect(SolvePartTwo()).toBe(-1);
  });
});
