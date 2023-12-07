import { HandType, SolvePartOne, SolvePartTwo, getHandTypeWithJoker, getWinningHand, getWinningHandP2 } from "../day07/day07";
import { describe, expect, test } from "vitest";

describe("Day 07 Part 01", () => {
  test("Expected result", () => {
    expect(SolvePartOne()).toBe(6440);
  });
});

describe("Day 07 Part 02", () => {
  test("Expected result", () => {
    expect(SolvePartTwo()).toBe(5905);
  });
});

describe("Sorting of Hands", () => {
  const testData = [
    [
      { bid: 0, cards: ["Q", "Q", "Q", "A", "A"], type: HandType.FULL_HOUSE },
      { bid: 0, cards: ["Q", "Q", "Q", "K", "K"], type: HandType.FULL_HOUSE }
    ],
    [
      { bid: 0, cards: ["A", "A", "Q", "Q", "Q"], type: HandType.FULL_HOUSE },
      { bid: 0, cards: ["K", "K", "Q", "Q", "Q"], type: HandType.FULL_HOUSE }
    ],
    [
      { bid: 0, cards: ["3", "3", "3", "3", "2"], type: HandType.FOUR_OF_KIND },
      { bid: 0, cards: ["2", "A", "A", "A", "A"], type: HandType.FOUR_OF_KIND }
    ]
  ];
  test("Part 1: Sorting determined by highest card", () => {
    testData.forEach((data) => {
      const winner = getWinningHand(data[0], data[1]);
      expect(winner > 0).toBeTruthy();
    });
  });

  test("Part 2: Sorting determined by highest card", () => {
    testData.forEach((data) => {
      const winner = getWinningHandP2(data[0], data[1]);
      expect(winner > 0).toBeTruthy();
    });
  });
});

describe("Get Hand Type", () => {
  const testData = [
    { bid: 0, cards: ["Q", "Q", "Q", "A", "A"], type: HandType.FULL_HOUSE },
    { bid: 0, cards: ["A", "A", "Q", "Q", "Q"], type: HandType.FULL_HOUSE },
    { bid: 0, cards: ["3", "3", "3", "3", "2"], type: HandType.FOUR_OF_KIND },
    { bid: 0, cards: ["J", "J", "J", "J", "J"], type: HandType.FIVE_OF_KIND },
    { bid: 0, cards: ["3", "3", "3", "3", "J"], type: HandType.FIVE_OF_KIND },
    { bid: 0, cards: ["3", "3", "Q", "J", "J"], type: HandType.FOUR_OF_KIND },
    { bid: 0, cards: ["Q", "3", "Q", "6", "J"], type: HandType.THREE_OF_KIND },
    { bid: 0, cards: ["3", "Q", "T", "J", "J"], type: HandType.THREE_OF_KIND },
    { bid: 0, cards: ["3", "2", "T", "3", "K"], type: HandType.ONE_PAIR },
    { bid: 0, cards: ["K", "K", "6", "7", "7"], type: HandType.TWO_PAIR },
    { bid: 0, cards: ["T", "5", "5", "J", "5"], type: HandType.FOUR_OF_KIND },
    { bid: 0, cards: ["K", "T", "J", "J", "T"], type: HandType.FOUR_OF_KIND },
    { bid: 0, cards: ["Q", "Q", "Q", "J", "A"], type: HandType.FOUR_OF_KIND },
    { bid: 0, cards: ["K", "T", "J", "J", "T"], type: HandType.FOUR_OF_KIND }
  ];
  test("Part 2", () => {
    testData.forEach((data) => {
      const handType = getHandTypeWithJoker(data);
      expect(handType).toBe(data.type);
    });
  });
});
