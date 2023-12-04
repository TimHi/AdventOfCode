import * as fs from "fs";
import _ from "lodash";

const isSample = true;
const fileName = isSample ? "/src/days/day04/sample.txt" : "/src/days/day04/full.txt";

const numReg = new RegExp("[0-9]+", "g");

interface Game {
  id: number;
  winningNumbers: number[];
  ownNumbers: number[];
  wonCards: number;
}

const scoreMap = new Map<number, number[]>();
function parseGames(): Game[] {
  return fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((line) => line.substring(line.indexOf(":"), line.length))
    .map((line) => line.split("|"))
    .map((nums, gameIndex) => {
      const winningNumbers = nums[0].match(numReg)?.map((v) => Number(v)) ?? [];
      const ownNumbers = nums[1].match(numReg)?.map((v) => Number(v)) ?? [];
      const wonCards = _.intersection(winningNumbers, ownNumbers).length;

      const game: Game = { id: gameIndex, winningNumbers: winningNumbers, ownNumbers: ownNumbers, wonCards: wonCards };
      scoreMap.set(
        gameIndex,
        Array.from({ length: wonCards }, (_, index) => gameIndex + index + 1)
      );
      return game;
    });
}

export function SolvePartOne(): number {
  return fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((line) => line.substring(line.indexOf(":"), line.length))
    .map((line) => line.split("|"))
    .map((nums) => {
      let points = 0;
      const winningNumbers = nums[0].match(numReg)?.map((v) => Number(v));
      const ownNumbers = nums[1].match(numReg)?.map((v) => Number(v));
      _.intersection(winningNumbers, ownNumbers).forEach((_, index) => {
        if (index === 0) points = 1;
        else points = points * 2;
      });
      return points;
    })
    .reduce((sum, current) => sum + current);
}

export function SolvePartTwo(): number {
  const games = parseGames();
  const copies: number[] = [];
  games.forEach((game) => {
    const toCheck: number[] = [game.id];
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const id = toCheck.pop();
      if (id !== undefined) {
        const score = scoreMap.get(id);
        if (score !== undefined && score.length > 0) {
          copies.push(...score);
          toCheck.push(...score);
        }
      } else break;
    }
  });
  return copies.length + games.length;
}
