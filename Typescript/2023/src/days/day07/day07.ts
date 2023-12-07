import * as fs from "fs";

export enum HandType {
  FIVE_OF_KIND = 6,
  FOUR_OF_KIND = 5,
  FULL_HOUSE = 4,
  THREE_OF_KIND = 3,
  TWO_PAIR = 2,
  ONE_PAIR = 1,
  HIGH_CARD = 0,
  UNKOWN = -1
}

export interface Hand {
  cards: string[];
  type: HandType;
  bid: number;
}

const CARD_VALUES: Map<string, number> = new Map<string, number>([
  ["A", 12],
  ["K", 11],
  ["Q", 10],
  ["J", 9],
  ["T", 8],
  ["9", 7],
  ["8", 6],
  ["7", 5],
  ["6", 4],
  ["5", 3],
  ["4", 2],
  ["3", 1],
  ["2", 0]
]);

const CARD_VALUES_P2: Map<string, number> = new Map<string, number>([
  ["A", 12],
  ["K", 11],
  ["Q", 10],
  ["T", 9],
  ["9", 8],
  ["8", 7],
  ["7", 6],
  ["6", 5],
  ["5", 4],
  ["4", 3],
  ["3", 2],
  ["2", 1],
  ["J", 0]
]);

export function ParseHands(): Hand[] {
  const isSample = true;
  const fileName = isSample ? "/src/days/day07/sample.txt" : "/src/days/day07/full.txt";
  const hands: Hand[] = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((line) => line.split(" "))
    .map((line) => {
      return { bid: Number(line[1]), cards: line[0].split(""), type: HandType.UNKOWN };
    });
  return hands;
}

export function SolvePartOne(): number {
  const hands = ParseHands();
  hands.forEach((hand) => {
    hand.type = getHandType(hand);
  });
  hands.sort((a, b) => getWinningHand(a, b, true));
  let sum = 0;
  hands.forEach((h, i) => {
    sum = sum + h.bid * (i + 1);
  });
  return sum;
}

export function SolvePartTwo(): number {
  const hands = ParseHands();
  hands.forEach((hand) => {
    hand.type = getHandTypeWithJoker(hand);
  });
  hands.sort((a, b) => getWinningHand(a, b, false));
  let sum = 0;
  hands.forEach((h, i) => {
    sum = sum + h.bid * (i + 1);
  });
  return sum;
}

export function getWinningHand(a: Hand, b: Hand, isPartOne: boolean): number {
  if (a.type === b.type) {
    for (let i = 0; i < a.cards.length; i++) {
      const aCard = isPartOne ? CARD_VALUES.get(a.cards[i]) : CARD_VALUES_P2.get(a.cards[i]);
      const bCard = isPartOne ? CARD_VALUES.get(b.cards[i]) : CARD_VALUES_P2.get(b.cards[i]);
      if (aCard === undefined || bCard === undefined) throw new Error("Card not found");
      if (aCard !== bCard) return aCard - bCard;
    }
    throw new Error("No winner found");
  } else {
    return a.type - b.type;
  }
}

export function getHandTypeWithJoker(hand: Hand): HandType {
  let foundType = HandType.HIGH_CARD;
  const sortedCards = getSortedCopy(hand.cards);
  const map = sortedCards.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());
  const jokerCount: number = map.get("J") ?? 0;
  if (jokerCount === 0) {
    //Reuse Part 1
    return getHandType(hand);
  } else if (jokerCount === 5) {
    return HandType.FIVE_OF_KIND;
  } else {
    map.delete("J");
  }
  const foundTypes: HandType[] = [];

  map.forEach((v) => {
    if (v === 5) foundTypes.push(HandType.FIVE_OF_KIND);
    if (v === 4) foundTypes.push(HandType.FOUR_OF_KIND);
    if (v === 3) foundTypes.push(HandType.THREE_OF_KIND);
    if (v === 2) foundTypes.push(HandType.ONE_PAIR);
  });
  if (foundTypes.includes(6)) return HandType.FIVE_OF_KIND;
  if (foundTypes.includes(5)) {
    return jokerCount === 0 ? HandType.FOUR_OF_KIND : HandType.FIVE_OF_KIND;
  }

  const secondMap = foundTypes.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());

  const threeOfKind = secondMap.get(HandType.THREE_OF_KIND);
  if (threeOfKind !== undefined && threeOfKind === 1) {
    if (jokerCount === 2) {
      return HandType.FIVE_OF_KIND;
    }
    if (jokerCount === 1) {
      return HandType.FOUR_OF_KIND;
    }
    foundType = HandType.THREE_OF_KIND;
  }

  const onePairCheck = secondMap.get(HandType.ONE_PAIR);
  if (onePairCheck !== undefined && onePairCheck === 1) {
    if (jokerCount === 3) {
      return HandType.FIVE_OF_KIND;
    }
    if (jokerCount === 2) {
      return HandType.FOUR_OF_KIND;
    }
    if (jokerCount === 1) {
      return HandType.THREE_OF_KIND;
    }

    if (foundType !== HandType.THREE_OF_KIND && jokerCount === 0) return HandType.ONE_PAIR;
    foundType = HandType.ONE_PAIR;
  }

  const twoPairCheck = secondMap.get(HandType.ONE_PAIR);
  if (twoPairCheck !== undefined && twoPairCheck === 2) {
    if (jokerCount === 1) {
      return HandType.FULL_HOUSE;
    } else {
      return HandType.TWO_PAIR;
    }
  }

  if (jokerCount === 4) {
    return HandType.FIVE_OF_KIND;
  }
  if (jokerCount === 3) {
    return HandType.FOUR_OF_KIND;
  }
  if (jokerCount === 2) {
    return HandType.THREE_OF_KIND;
  }
  if (jokerCount === 1) {
    return HandType.ONE_PAIR;
  }

  return foundType;
}

function getHandType(hand: Hand): HandType {
  let foundType = HandType.HIGH_CARD;
  const sortedCards = getSortedCopy(hand.cards);
  const map = sortedCards.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());

  const foundTypes: HandType[] = [];

  map.forEach((v) => {
    if (v === 5) foundTypes.push(HandType.FIVE_OF_KIND);
    if (v === 4) foundTypes.push(HandType.FOUR_OF_KIND);
    if (v === 3) foundTypes.push(HandType.THREE_OF_KIND);
    if (v === 2) foundTypes.push(HandType.ONE_PAIR);
  });
  if (foundTypes.includes(6)) return HandType.FIVE_OF_KIND;
  if (foundTypes.includes(5)) return HandType.FOUR_OF_KIND;

  const secondMap = foundTypes.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());

  const threeOfKind = secondMap.get(HandType.THREE_OF_KIND);
  if (threeOfKind !== undefined && threeOfKind === 1) {
    foundType = HandType.THREE_OF_KIND;
  }

  const onePairCheck = secondMap.get(HandType.ONE_PAIR);
  if (onePairCheck !== undefined && onePairCheck === 1) {
    if (foundType !== HandType.THREE_OF_KIND) return HandType.ONE_PAIR;
    else return HandType.FULL_HOUSE;
  }

  const twoPairCheck = secondMap.get(HandType.ONE_PAIR);
  if (twoPairCheck !== undefined && twoPairCheck === 2) {
    return HandType.TWO_PAIR;
  }

  return foundType;
}

function handTypeToReadable(handType: HandType) {
  switch (handType) {
    case HandType.FIVE_OF_KIND:
      return "Five of a Kind";
    case HandType.FOUR_OF_KIND:
      return "Four of a Kind";
    case HandType.FULL_HOUSE:
      return "Full House";
    case HandType.THREE_OF_KIND:
      return "Three of a Kind";
    case HandType.TWO_PAIR:
      return "Two Pairs";
    case HandType.ONE_PAIR:
      return "One Pair";
    case HandType.HIGH_CARD:
      return "High Card";
    case HandType.UNKOWN:
      return "Fucked";
  }
}

function getSortedCopy(original: string[]): string[] {
  const copy = [...original];
  return copy.sort((a, b) => {
    const aValue = CARD_VALUES.get(a) ?? 0;
    const bValue = CARD_VALUES.get(b) ?? 0;
    return bValue - aValue;
  });
}
