import { SolvePartOne, SolvePartTwo } from "../day13/day13";
import { describe, expect, test } from "vitest";

describe("Day 13 Part 01", () => {
  test("Expected result", () => {
    expect(SolvePartOne()).toBe(405);
  });
});

describe("Day 13 Part 02", () => {
  test("Expected result", () => {
    SolvePartOne();
    expect(SolvePartTwo()).toBe(400);
  });
});
