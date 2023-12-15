import { Reading } from "./day12";
//Fresh File, Fresh thoughts

const cache = new Map<string, number>();
export function getUnfoldedCombinations(reading: Reading): number {
  return Calculate(reading.rawData, reading.springsToFill);
}
function Calculate(springs: string, groups: number[]): number {
  const key = `${springs},${groups.join(",")}`; // Cache key: spring pattern + group lengths
  let value = cache.get(key);
  if (value !== undefined) {
    return value;
  }
  value = getPossibleCombinations(springs, groups);
  cache.set(key, value);
  return value;
}

// Needed help for this.. weird day.
function getPossibleCombinations(springs: string, groups: number[]): number {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // No Groups, match if no #
    if (groups.length == 0) return springs.includes("#") ? 0 : 1;
    // Springs empty but groups not
    if (springs === undefined || springs === null || springs === "") return 0;
    // Remove all dots from the beginning,
    if (springs.startsWith(".")) {
      springs = springs.replace(/^\.+/, "");
      continue;
    }
    //Create new Options
    if (springs.startsWith("?")) return Calculate("." + springs.substring(1), groups) + Calculate("#" + springs.substring(1), groups);
    // #
    if (springs.startsWith("#")) {
      if (springs.length < groups[0]) return 0; // Not enough characters to match the group
      if (springs.substring(0, groups[0]).includes(".")) return 0; // Group cannot contain dots for the given length -> G: 3 ##. -> false

      if (groups.length > 1) {
        // Group cannot be followed by a spring, and there must be enough characters left
        if (springs.length < groups[0] + 1 || springs[groups[0]] == "#") {
          return 0;
        }
        // Skip the character after the group - it's either a dot or a ? which needs to be . to close the group
        springs = springs.substring(groups[0] + 1);
        groups = groups.slice(1);
        continue;
      }
      // Last group, no need to check the character after the group
      springs = springs.substring(groups[0]);
      groups = groups.slice(1);
      continue;
    }

    throw new Error("Big problem if we're here");
  }
}
