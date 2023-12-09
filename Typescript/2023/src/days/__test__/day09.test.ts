import { EstimateNextReading, SolvePartOne, SolvePartTwo } from "../day09/day09";
import { describe, expect, test } from "vitest";

describe("Day 09 Part 01", () => {
  test("Expected result", () => {
    expect(SolvePartOne()).toBe(114);
  });
});

describe("Day 09 Part 02", () => {
  test("Expected result", () => {
    expect(SolvePartTwo()).toBe(2);
  });
});

describe("Day 09 Part 02", () => {
  const testData = [
    { input: [0, 3, 6, 9, 12, 15], expectedResult: 18 },
    { input: [1, 3, 6, 10, 15, 21], expectedResult: 28 },
    { input: [10, 13, 16, 21, 30, 45], expectedResult: 68 }
  ];

  test("Estimate next reading", () => {
    testData.forEach((data) => {
      expect(EstimateNextReading(data.input)).toBe(data.expectedResult);
    });
  });
});
