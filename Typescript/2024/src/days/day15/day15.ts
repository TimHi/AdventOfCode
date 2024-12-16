import * as fs from "fs";
import { getAllNumbersInString, GetPointKey, Point } from "aoc-util";

const isSample = true;

interface Robot {
  pos: Point;
  dir: Point;
  final: Point;
}

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

function moveRobots(robots: Robot[], fieldSize: number[], ticks: number) {
  robots.forEach((robot) => {
    robot.final = { X: robot.pos.X + robot.dir.X * ticks, Y: robot.pos.Y + robot.dir.Y * ticks };
    robot.final.X = mod(robot.final.X, fieldSize[0]);
    robot.final.Y = mod(robot.final.Y, fieldSize[1]);
  });
}
interface Quadrant {
  xLower: number;
  xUpper: number;
  yLower: number;
  yUpper: number;
  robots: number;
}

function isInQuadrant(robot: Robot, q1: Quadrant) {
  const xBound = robot.final.X >= q1.xLower && robot.final.X <= q1.xUpper;
  const yBound = robot.final.Y >= q1.yLower && robot.final.Y <= q1.yUpper;
  return xBound && yBound;
}

function calculateSafetyFactor(robots: Robot[], fieldSize: number[]): number {
  const xQuadLength = Math.floor(fieldSize[0] / 2);
  const yQuadLength = Math.floor(fieldSize[1] / 2);
  const q1: Quadrant = { xLower: 0, xUpper: xQuadLength - 1, yLower: 0, yUpper: yQuadLength - 1, robots: 0 };
  const q2: Quadrant = { xLower: xQuadLength + 1, xUpper: xQuadLength * 2, yLower: 0, yUpper: yQuadLength - 1, robots: 0 };
  const q3: Quadrant = { xLower: 0, xUpper: xQuadLength - 1, yLower: yQuadLength + 1, yUpper: yQuadLength * 2, robots: 0 };
  const q4: Quadrant = { xLower: xQuadLength + 1, xUpper: xQuadLength * 2, yLower: yQuadLength + 1, yUpper: yQuadLength * 2, robots: 0 };
  robots.forEach((robot) => {
    if (isInQuadrant(robot, q1)) {
      q1.robots++;
    }
    if (isInQuadrant(robot, q2)) {
      q2.robots++;
    }
    if (isInQuadrant(robot, q3)) {
      q3.robots++;
    }
    if (isInQuadrant(robot, q4)) {
      q4.robots++;
    }
  });
  const r1 = q1.robots === 0 ? 1 : q1.robots;
  const r2 = q2.robots === 0 ? 1 : q2.robots;
  const r3 = q3.robots === 0 ? 1 : q3.robots;
  const r4 = q4.robots === 0 ? 1 : q4.robots;
  return r1 * r2 * r3 * r4;
}

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day14/sample.txt" : "/src/days/day14/full.txt";
  const fieldSize = isSample ? [11, 7] : [101, 103];
  const robots = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((l) => {
      const nums = getAllNumbersInString(l);
      const robot: Robot = { pos: { X: nums[0], Y: nums[1] }, dir: { X: nums[2], Y: nums[3] }, final: { X: nums[0], Y: nums[1] } };
      return robot;
    });
  moveRobots(robots, fieldSize, 100);
  return calculateSafetyFactor(robots, fieldSize);
}

function noDuplicatePos(robots: Robot[]): boolean {
  const posMap: string[] = [];
  let dupFound = false;
  robots.forEach((robot) => {
    if (!posMap.includes(GetPointKey(robot.final))) {
      posMap.push(GetPointKey(robot.final));
    } else {
      dupFound = true;
    }
  });
  return dupFound;
}

export function SolvePartTwo(): number {
  const fileName = isSample ? "/src/days/day14/sample.txt" : "/src/days/day14/full.txt";
  const fieldSize = isSample ? [11, 7] : [101, 103];
  const robots = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((l) => {
      const nums = getAllNumbersInString(l);
      const robot: Robot = { pos: { X: nums[0], Y: nums[1] }, dir: { X: nums[2], Y: nums[3] }, final: { X: nums[0], Y: nums[1] } };
      return robot;
    });
  let tick = 0;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    moveRobots(robots, fieldSize, tick);
    if (!noDuplicatePos(robots)) {
      break;
    }
    tick++;
  }
  return tick;
}
