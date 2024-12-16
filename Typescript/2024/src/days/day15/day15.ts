import * as fs from "fs";
import { DirectedPoint, Direction, GetPointKey, Point } from "aoc-util";

const isSample = true;

function getStartPosition(map: string[][]): Point {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === "@") return { X: x, Y: y };
    }
  }
  throw new Error("Start not found");
}

const WALL = "#";
const BOX = "O";
const EMPTY = ".";
const PLAYER = "@";
const DOUBLE_BOX = ["[", "]"];

function getDirection(inst: string): DirectedPoint {
  switch (inst) {
    case ">":
      return { X: 1, Y: 0, direction: Direction.E };
    case "<":
      return { X: -1, Y: 0, direction: Direction.W };
    case "^":
      return { X: 0, Y: -1, direction: Direction.N };
    case "v":
      return { X: 0, Y: 1, direction: Direction.S };
    default:
      throw new Error("Unknown Direction");
  }
}

//Go through the horizontal/vertical line and check if a free space is coming up, if yes we can movePlayer towards that dir
function canMove(map: string[][], dir: DirectedPoint, currentPos: Point) {
  let canMove = false;

  if (dir.direction === Direction.N) {
    for (let y = currentPos.Y; y >= 0; y--) {
      if (map[y][currentPos.X] === EMPTY) canMove = true;
      if (map[y][currentPos.X] === WALL && !canMove) return false;
    }
  }
  if (dir.direction === Direction.S) {
    for (let y = currentPos.Y; y < map.length; y++) {
      if (map[y][currentPos.X] === EMPTY) canMove = true;
      if (map[y][currentPos.X] === WALL && !canMove) return false;
    }
  }
  if (dir.direction === Direction.E) {
    for (let x = currentPos.X; x < map[0].length; x++) {
      if (map[currentPos.Y][x] === EMPTY) canMove = true;
      if (map[currentPos.Y][x] === WALL && !canMove) return false;
    }
  }
  if (dir.direction === Direction.W) {
    for (let x = currentPos.X; x >= 0; x--) {
      if (map[currentPos.Y][x] === EMPTY) canMove = true;
      if (map[currentPos.Y][x] === WALL && !canMove) return false;
    }
  }
  return canMove;
}

function nextEmptyField(map: string[][], dir: DirectedPoint, currentPos: Point): Point {
  if (dir.direction === Direction.N) {
    for (let y = currentPos.Y; y >= 0; y--) {
      if (map[y][currentPos.X] === EMPTY) return { X: currentPos.X, Y: y };
    }
  }
  if (dir.direction === Direction.S) {
    for (let y = currentPos.Y; y < map.length; y++) {
      if (map[y][currentPos.X] === EMPTY) return { X: currentPos.X, Y: y };
    }
  }
  if (dir.direction === Direction.E) {
    for (let x = currentPos.X; x < map[0].length; x++) {
      if (map[currentPos.Y][x] === EMPTY) return { X: x, Y: currentPos.Y };
    }
  }
  if (dir.direction === Direction.W) {
    for (let x = currentPos.X; x >= 0; x--) {
      if (map[currentPos.Y][x] === EMPTY) return { X: x, Y: currentPos.Y };
    }
  }
  return { X: -1, Y: -1 };
}

function moveBox(map: string[][], dir: DirectedPoint, currentPos: { X: number; Y: number }) {
  const nextFreeField = nextEmptyField(map, dir, currentPos);

  if (nextFreeField.X === -1) {
    throw new Error("Unable to move boxes i dont think this should happen");
  }
  map[nextFreeField.Y][nextFreeField.X] = BOX;
  //MOVE Box to free field
}

function movePlayer(map: string[][], currentMove: string, current: Point): Point {
  const dir = getDirection(currentMove);
  const currentPos = { X: current.X, Y: current.Y };
  const nextPos = { X: currentPos.X + dir.X, Y: currentPos.Y + dir.Y };
  const nextField = map[nextPos.Y][nextPos.X];

  if (nextField === BOX) {
    if (canMove(map, dir, currentPos)) {
      moveBox(map, dir, nextPos);
      //Should move the player one field
      map[nextPos.Y][nextPos.X] = map[currentPos.Y][currentPos.X];
      //Afterward there is a free field
      map[currentPos.Y][currentPos.X] = EMPTY;
      //Return the now pos of the player
      return nextPos;
    }
  } else if (nextField === EMPTY) {
    map[nextPos.Y][nextPos.X] = map[currentPos.Y][currentPos.X];
    map[currentPos.Y][currentPos.X] = EMPTY;
    return nextPos;
  }
  //Wall or boxes that cant be moved anymore
  return currentPos;
}

function play(field: string[][], instructions: string[]): string[][] {
  const map: string[][] = JSON.parse(JSON.stringify(field));
  let player = getStartPosition(field);
  instructions.reverse();
  while (instructions.length > 0) {
    const currentMove = instructions.pop()!;
    player = movePlayer(map, currentMove, player);
    //print2D(map);
  }
  return map;
}
interface DoubleBox {
  left: Point;
  right: Point;
}

function getDirectNeighbour(dir: DirectedPoint, box: DoubleBox): DoubleBox {
  switch (dir.direction) {
    case Direction.N:
      return {
        left: { X: box.left.X, Y: box.left.Y - 1 },
        right: { X: box.right.X, Y: box.right.Y - 1 }
      };
    case Direction.S:
      return {
        left: { X: box.left.X, Y: box.left.Y + 1 },
        right: { X: box.right.X, Y: box.right.Y + 1 }
      };
    case Direction.E:
      return {
        left: { X: box.left.X + 2, Y: box.left.Y },
        right: { X: box.right.X + 2, Y: box.right.Y }
      };
    case Direction.W:
      return {
        left: { X: box.left.X - 2, Y: box.left.Y },
        right: { X: box.right.X - 2, Y: box.right.Y }
      };
  }
  throw new Error("Well fuck");
}

function checkNeighbourBothFields(neighbour: DoubleBox, map: string[][], fieldToTest: string): boolean {
  const leftPos = map[neighbour.left.Y][neighbour.left.X];
  const rightPos = map[neighbour.right.Y][neighbour.right.X];
  return leftPos === fieldToTest || rightPos === fieldToTest;
}

function shiftDoubleBoxHorizontal(box: DoubleBox, dir: number): DoubleBox {
  return {
    left: { X: box.left.X + dir, Y: box.left.Y },
    right: {
      X: box.right.X + dir,
      Y: box.right.Y
    }
  };
}

function getBoxesToMove(map: string[][], dir: DirectedPoint, currentPos: Point): number {
  let boxesToMove: DoubleBox[] = [];
  const Q: DoubleBox[] = [{ left: currentPos, right: { X: currentPos.X + 1, Y: currentPos.Y } }];

  while (Q.length > 0) {
    const currentBox = Q.pop()!;
    boxesToMove.push(currentBox);
    const neighbour = getDirectNeighbour(dir, currentBox);

    //If a wall is a neighbour nothing can move
    if (checkNeighbourBothFields(neighbour, map, WALL)) {
      boxesToMove = [];
      break;
    }
    if (currentPos.X === 6 && currentPos.Y === 4) {
      console.log("Stop here its fucked");
    }
    switch (dir.direction) {
      case Direction.N:
      case Direction.S:
        if (!checkNeighbourBothFields(neighbour, map, EMPTY)) {
          if (map[neighbour.left.Y][neighbour.left.X] === "[") {
            Q.push(neighbour);
          }
          if (map[neighbour.left.Y][neighbour.left.X] === "]") {
            const shiftOneLeft = shiftDoubleBoxHorizontal(neighbour, -1);
            Q.push(shiftOneLeft);
          }
          if (map[neighbour.right.Y][neighbour.right.X] === "[") {
            const shiftOneRight = shiftDoubleBoxHorizontal(neighbour, 1);
            Q.push(shiftOneRight);
          }
          if (map[neighbour.right.Y][neighbour.right.X] === "]") {
            Q.push(neighbour);
          }
        }
        break;
      case Direction.E:
        if (checkNeighbourHorizontal(map, dir, currentBox, EMPTY)) {
          break;
        }
        if (checkNeighbourHorizontal(map, dir, currentBox, "[")) {
          Q.push(neighbour);
        }
        break;
      case Direction.W:
        if (checkNeighbourHorizontal(map, dir, currentBox, EMPTY)) {
          break;
        }
        if (checkNeighbourHorizontal(map, dir, currentBox, "]")) {
          Q.push(neighbour);
        }
        break;
    }
  }
  moveBoxes(map, dir, boxesToMove.reverse());
  return boxesToMove.length;
}

function checkNeighbourHorizontal(map: string[][], dir: DirectedPoint, box: DoubleBox, field: string): boolean {
  if (dir.direction === Direction.E) {
    const rightMost = map[box.right.Y][box.right.X + 1];
    return rightMost === field;
  }
  if (dir.direction === Direction.W) {
    const leftMost = map[box.left.Y][box.left.X - 1];
    return leftMost === field;
  }
  throw new Error("Can only check horizontal");
}

function moveBoxes(map: string[][], dir: DirectedPoint, boxes: DoubleBox[]) {
  const pointsUsed: string[] = [];
  boxes.forEach((box) => {
    map[box.left.Y + dir.Y][box.left.X + dir.X] = DOUBLE_BOX[0];
    map[box.right.Y + dir.Y][box.right.X + dir.X] = DOUBLE_BOX[1];
    pointsUsed.push(GetPointKey({ X: box.left.X + dir.X, Y: box.left.Y + dir.Y }));
    pointsUsed.push(GetPointKey({ X: box.right.X + dir.X, Y: box.right.Y + dir.Y }));
  });
  boxes.forEach((box) => {
    if (!pointsUsed.includes(GetPointKey(box.left))) {
      map[box.left.Y][box.left.X] = EMPTY;
    }
    if (!pointsUsed.includes(GetPointKey(box.right))) {
      map[box.right.Y][box.right.X] = EMPTY;
    }
  });
}

function movePlayerInflated(map: string[][], currentMove: string, current: Point): Point {
  const dir = getDirection(currentMove);

  const nextPos = { X: current.X + dir.X, Y: current.Y + dir.Y };
  const nextField = map[nextPos.Y][nextPos.X];
  let boxesMoved = 0;
  //[ Top and Left
  if (nextField === DOUBLE_BOX[0]) {
    boxesMoved = getBoxesToMove(map, dir, nextPos);
  }
  //] Top and Right
  else if (nextField === DOUBLE_BOX[1]) {
    boxesMoved = getBoxesToMove(map, dir, { X: nextPos.X - 1, Y: nextPos.Y });
  }
  if (boxesMoved > 0 || map[nextPos.Y][nextPos.X] === EMPTY) {
    map[nextPos.Y][nextPos.X] = PLAYER;
    map[current.Y][current.X] = EMPTY;
    return nextPos;
  } else {
    return current;
  }
  //Wall or boxes that cant be moved anymore
}

function playInflatedField(field: string[][], instructions: string[]): string[][] {
  const map: string[][] = JSON.parse(JSON.stringify(field));
  let player = getStartPosition(field);
  instructions.reverse();

  while (instructions.length > 0) {

    const currentMove = instructions.pop()!;
    if(instructions.length === 505){
      console.log("Fuc");
    }
    if (player.Y === 3 && player.X === 7 && currentMove === "^") {
      console.log("");
    }
    player = movePlayerInflated(map, currentMove, player);

    print2D(map);
  }
  return map;
}

function calculateGPS(cMap: string[][]) {
  let gps = 0;
  for (let y = 0; y < cMap.length; y++) {
    for (let x = 0; x < cMap[0].length; x++) {
      if (cMap[y][x] === BOX) {
        gps += 100 * y + x;
      }
    }
  }
  return gps;
}

function calculateBigGPS(cMap: string[][]) {
  let gps = 0;
  for (let y = 0; y < cMap.length; y++) {
    for (let x = 0; x < cMap[0].length; x++) {
      if (cMap[y][x] === DOUBLE_BOX[0]) {
        gps += 100 * y + x;
      }
    }
  }
  return gps;
}

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day15/sample.txt" : "/src/days/day15/full.txt";

  const field: string[][] = [];
  const instructions: string[] = [];
  let isField = true;
  fs.readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .forEach((l) => {
      if (l === "\n" || l === "\r") isField = false;
      if (isField) {
        field.push(l.split("").filter((x) => x !== "\r"));
      } else if (!isField && l !== "\n" && l !== "\r") {
        instructions.push(...l.split(""));
      }
    });

  const m = play(
    field,
    instructions.filter((x) => x !== "\r")
  );
  return calculateGPS(m);
}

/*
    If the tile is #, the new map contains ## instead.
    If the tile is O, the new map contains [] instead.
    If the tile is ., the new map contains .. instead.
    If the tile is @, the new map contains @. instead.
 */
function inflateField(field: string[][]): string[][] {
  const inf: string[][] = [];
  for (let y = 0; y < field.length; y++) {
    const row: string[] = [];
    for (let x = 0; x < field[0].length; x++) {
      const currentField = field[y][x];
      if (currentField === WALL) {
        row.push(...["#", "#"]);
      }
      if (currentField === EMPTY) {
        row.push(...[".", "."]);
      }
      if (currentField === PLAYER) {
        row.push(...["@", "."]);
      }
      if (currentField === BOX) {
        row.push(...["[", "]"]);
      }
    }
    inf.push(row);
  }
  return inf;
}

export function SolvePartTwo(): number {
  const fileName = isSample ? "/src/days/day15/sample.txt" : "/src/days/day15/full.txt";

  const field: string[][] = [];
  const instructions: string[] = [];
  let isField = true;
  fs.readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .forEach((l) => {
      if (l === "\n" || l === "\r") isField = false;
      if (isField) {
        field.push(l.split("").filter((x) => x !== "\r"));
      } else if (!isField && l !== "\n" && l !== "\r") {
        instructions.push(...l.split(""));
      }
    });

  const inflatedField: string[][] = inflateField(field);
  //const inflatedField = field;
  print2D(inflatedField);
  const m = playInflatedField(
    inflatedField,
    instructions.filter((x) => x !== "\r")
  );
  return calculateBigGPS(m);
}

function print2D(cMap: string[][]) {
  for (let y = 0; y < cMap.length; y++) {
    let result = "";
    for (let x = 0; x < cMap[0].length; x++) {
      result += cMap[y][x];
    }
    console.log(result);
  }
}
