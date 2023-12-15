import { Lens, Operation, SolvePartOne, SolvePartTwo, VerifyLenses } from "../day15/day15";
import { describe, expect, test } from "vitest";

describe("Day 15 Part 01", () => {
  test("Expected result", () => {
    expect(SolvePartOne()).toBe(1320);
  });
});

describe("Day 15 Part 02", () => {
  test("Expected result", () => {
    expect(SolvePartTwo()).toBe(145);
  });

  test("Verify Lenses with Sample", () => {
    const boxMap = new Map<number, Lens[]>([
      [
        0,
        [
          { label: "rn", operation: Operation.SET, focalLength: 1, box: 0 },
          { label: "cm", operation: Operation.SET, focalLength: 2, box: 0 }
        ]
      ],
      [
        3,
        [
          { label: "ot", operation: Operation.SET, focalLength: 7, box: 3 },
          { label: "ab", operation: Operation.SET, focalLength: 5, box: 3 },
          { label: "pc", operation: Operation.SET, focalLength: 6, box: 3 }
        ]
      ]
    ]);
    const sum = VerifyLenses(boxMap);
    expect(sum).toBe(145);
  });
});
