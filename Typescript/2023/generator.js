const nunjucks = require("nunjucks");
const fs = require("fs");
const path = require("path");

// Check if filename and day are provided as command-line arguments
const args = process.argv.slice(2);

if (args.length < 1) {
  console.error("Usage: node generateFiles.js <day>");
  process.exit(1);
}

const dayValue = args[0];
console.log(dayValue);

const dayTemplate = `
/// AOC 2023 Day {$day}
console.log("Day {$day} Part 01:" + SolvePartOne());
console.log("Day {$day} Part 02:" + SolvePartTwo());

export function SolvePartOne(): number {
  console.log("TBD");
  return 0;
}

export function SolvePartTwo(): number {
  console.log("TBD");
  return 0;
}
`;

const createTypeScriptFile = (day) => {
  const renderedTemplate = nunjucks.renderString(dayTemplate, { day });
  const filename = path.join("src", "days", `${day}.ts`);
  console.log(filename);
  fs.writeFileSync(filename, renderedTemplate);
  console.log(`Created TypeScript file: ${day}.ts`);
};

const createTestFile = (filename) => {
  const testTemplate = `
import { SolvePartOne, SolvePartTwo } from "../{$day}";
import { describe, expect, test } from "vitest";

describe("Day {$day} Part 01", () => {
  test("Expected result", () => {
    expect(SolvePartOne()).toBe(-1);
  });
});

describe("Day {$day} Part 02", () => {
  test("Expected result", () => {
    expect(SolvePartTwo()).toBe(-1);
  });
});
`;

  const testFilename = path.join("src", "__test__", `${filename}.test.ts`);
  console.log(testFilename);
  fs.writeFileSync(testFilename, testTemplate);
  console.log(`Created test file: ${testFilename}`);
};

const createDirectories = (filename) => {
  const dir = path.dirname(filename);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

createDirectories(path.join("src", "days", `${dayValue}`));
createDirectories(path.join("src", "days", "__test__", `${dayValue}.test.ts`));
// Create TypeScript file
createTypeScriptFile(dayValue);

// Create test file
createTestFile(dayValue);
