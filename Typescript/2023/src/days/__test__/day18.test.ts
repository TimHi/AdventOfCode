import { SolvePartOne, SolvePartTwo } from "../day18/day18";
import { describe, expect, test } from "vitest";

describe("Day 18 Part 01", () => {
  test("Expected result", () => {
    expect(SolvePartOne()).toBe(62);
  });
});

describe("Day 18 Part 02", () => {
  test("Expected result", () => {
    expect(SolvePartTwo()).toBe(952408144115);
  });
});
