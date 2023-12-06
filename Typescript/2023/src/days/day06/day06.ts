import * as fs from "fs";
import { getAllNumbersInString } from "../../util/regex";

const isSample = true;

interface Race {
  distRecord: number;
  duration: number;
}

function parseRaces(): Race[] {
  const fileName = isSample ? "/src/days/day06/sample.txt" : "/src/days/day06/full.txt";
  const lines = fs.readFileSync(process.cwd() + fileName, "utf8").split("\n");
  const times = getAllNumbersInString(lines[0]);
  const distances = getAllNumbersInString(lines[1]);
  const games: Race[] = [];
  for (let i = 0; i < times.length; i++) {
    games.push({ distRecord: distances[i], duration: times[i] });
  }
  return games;
}

export function SolvePartOne(): number {
  const games = parseRaces();
  const possibleSolutions: number[] = [];
  games.forEach((race) => possibleSolutions.push(getPossible(race)));
  return possibleSolutions.reduce((sum, current) => sum * current);
}

function getPossible(race: Race): number {
  let possibleCombinations = 0;
  for (let i = 0; i <= race.duration; i++) {
    const timeDriving = race.duration - i;
    if (timeDriving * i > race.distRecord) possibleCombinations++;
  }
  return possibleCombinations;
}

export function SolvePartTwo(): number {
  const race = isSample ? ({ distRecord: 940200, duration: 71530 } as Race) : ({ distRecord: 553101014731074, duration: 62649190 } as Race);
  return getPossible(race);
}
