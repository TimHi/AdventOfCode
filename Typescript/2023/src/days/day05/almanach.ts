export interface AlmanachMapping {
  sourceRangeStart: number;
  destinationRangeStart: number;
  length: number;
}

export interface Full {
  mappings: AlmanachMapping[];
}

export class Almanach {
  public seeds: number[] = [];
  fullMappings: AlmanachMapping[][] = [];
}

export function parseAlamanach(lines: string[]): Almanach {
  const numReg = new RegExp("[0-9]+", "g");
  const almanach: Almanach = new Almanach();
  let mappings: AlmanachMapping[] = [];

  lines.forEach((line, i) => {
    if (i === 0) {
      const numbers = line.match(numReg)?.map((v) => Number(v)) ?? [];
      almanach.seeds.push(...numbers);
    } else if (line.includes("map")) {
      mappings = [];
    } else if (line === "") {
      if (mappings.length > 0) almanach.fullMappings.push(mappings);
    } else {
      const values = line.split(" ").map((v) => Number(v));
      const mapping: AlmanachMapping = { destinationRangeStart: values[0], sourceRangeStart: values[1], length: values[2] };
      mappings.push(mapping);
    }
  });
  return almanach;
}
