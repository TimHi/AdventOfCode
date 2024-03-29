const nunjucks = require("nunjucks");
const fs = require("fs");
const path = require("path");

const dayTemplate = `import * as fs from "fs";

const isSample = true;

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day{{ day }}/sample.txt" : "/src/days/day{{ day }}/full.txt";
  const lines = fs.readFileSync(process.cwd() + fileName, "utf8").split("\\n");

  console.log("TBD");
  return 0;
}

export function SolvePartTwo(): number {
  console.log("TBD");
  return 0;
}
`;

const createTypeScriptFile = (day) => {
  const renderedTemplate = nunjucks.renderString(dayTemplate, { day: day }); // Pass day as an object with key 'day'
  const filename = path.join("src", "days", `day${day}`, `day${day}.ts`);
  console.log(filename);
  fs.writeFileSync(filename, renderedTemplate);
  console.log(`Created TypeScript file: day${day}.ts`);
};

const createTestFile = (day) => {
  const testTemplate = `
import { SolvePartOne, SolvePartTwo } from "../day{{ day }}/day{{ day }}";
import { describe, expect, test } from "vitest";

describe("Day {{ day }} Part 01", () => {
  test("Expected result", () => {
    expect(SolvePartOne()).toBe(-1);
  });
});

describe("Day {{ day }} Part 02", () => {
  test("Expected result", () => {
    expect(SolvePartTwo()).toBe(-1);
  });
});
`;

  const testFilename = path.join(
    "src",
    "days",
    "__test__",
    `day${day}.test.ts`
  );
  const renderedTemplate = nunjucks.renderString(testTemplate, { day: day });
  console.log(testFilename);
  fs.writeFileSync(testFilename, renderedTemplate);
  console.log(`Created test file: ${testFilename}`);
};

const createDirectories = (filename) => {
  const dir = path.dirname(filename);
  console.log("Dir: " + dir);
  if (!fs.existsSync(dir)) {
    console.log("Does not exist");
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Leggo!
const args = process.argv.slice(2);

if (args.length < 1) {
  console.error("Usage: node generateFiles.js <day>");
  process.exit(1);
}

const dayValue = args[0];
const folderPath = path.join(
  "src",
  "days",
  `day${dayValue}`,
  `day${dayValue}.ts`
);

createDirectories(folderPath);
createDirectories(path.join("src", "days", "__test__", `${dayValue}.test.ts`));

createTypeScriptFile(dayValue);
createTestFile(dayValue);
fs.writeFileSync(path.join("src", "days", `day${dayValue}`, `full.txt`), "");
fs.writeFileSync(path.join("src", "days", `day${dayValue}`, `sample.txt`), "");
