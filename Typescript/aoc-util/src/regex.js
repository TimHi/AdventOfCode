export function getAllNumbersInString(input) {
  const numReg = new RegExp('-?[0-9]+', 'g');
  const matches = input.match(numReg)?.map((n) => Number(n)) ?? [];
  return matches;
}
//# sourceMappingURL=regex.js.map
