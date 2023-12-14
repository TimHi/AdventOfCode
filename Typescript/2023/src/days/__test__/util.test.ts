import { describe, expect, test } from "vitest";
import { rotateLeft, rotateRight } from "../../util/array";

describe("Transpose Array", () => {
  const data = ["123", "456", "789"];
  const expectedData = ["741", "852", "963"];
  test("Transpose Array", () => {
    const result = rotateRight(data);
    //Avoid object equality issues
    for (let index = 0; index < data.length; index++) {
      expect(result[index]).toBe(expectedData[index]);
    }
    const original = rotateLeft(result);
    for (let index = 0; index < data.length; index++) {
      expect(original[index]).toBe(data[index]);
    }
  });
});
