import * as fs from "fs";

interface Module {
  id: string;
  destinations: string[];
}
interface Conjunction extends Module {
  memory: Map<string, boolean>;
}

interface FlipFlop extends Module {
  state: boolean;
}

interface Broadcast extends Module {}
interface Output extends Module {}

//&xq -> zl, cx, qh, hs, nt, sp
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function parseMap(isSample: boolean) {
  const fileName = isSample ? "/src/days/day20/sample.txt" : "/src/days/day20/full.txt";
  const conjections: Conjunction[] = [];

  const map = new Map<string, Module>();
  fs.readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .forEach((line) => {
      const split = line.split(" -> ");
      const origin = split[0];
      const destinations = split[1].split(", ");
      if (origin[0] === "%") {
        const flip: FlipFlop = { id: origin.substring(1), destinations: destinations, state: false };
        map.set(flip.id, flip);
      } else if (origin[0] === "&") {
        const con: Conjunction = { id: origin.substring(1), destinations: destinations, memory: new Map<string, boolean>() };
        map.set(con.id, con);
        conjections.push(con);
      } else if (origin === "broadcaster") {
        const broadcaster: Broadcast = { id: origin, destinations: destinations };
        map.set(broadcaster.id, broadcaster);
      } else {
        const output: Output = { id: origin.substring(1), destinations: destinations };
        map.set(output.id, output);
      }

      if (isSample) {
        const out: Output = { id: "output", destinations: [] };
        map.set(out.id, out);
      } else {
        const out: Output = { id: "rx", destinations: [] };
        map.set(out.id, out);
      }
    });
  return map;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CalculateNeededPresses(_: boolean): number {
  return 0;
}
