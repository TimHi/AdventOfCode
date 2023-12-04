import { SolvePartOne, SolvePartTwo } from "../day04/day04";
import { describe, expect, test } from "vitest";

describe("Day 04 Part 01", () => {
  test("Expected result", () => {
    expect(SolvePartOne()).toBe(13);
  });
});

describe("Day 04 Part 02", () => {
  test("Expected result", () => {
    expect(SolvePartTwo()).toBe(30);
  });
});
