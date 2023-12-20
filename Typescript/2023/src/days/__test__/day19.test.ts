import { SolvePartOne, SolvePartTwo } from "../day19/day19";
import { describe, expect, test } from "vitest";

describe("Day 19 Part 01", () => {
  test("Expected result", () => {
    expect(SolvePartOne()).toBe(19114);
  });
});

describe("Day 19 Part 02", () => {
  test("Expected result", () => {
    expect(SolvePartTwo()).toBe(167409079868000);
  });
});
