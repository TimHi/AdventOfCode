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

export function CalculateNeededPresses(isSample: boolean): number {
  const map = parseMap(isSample);
  //https://www.devtoolsdaily.com/graphviz/full-screen/?#v2=N4IgJg9gLiBc4EsDmAnAhgBwBYAIDiOwAOgHY45YDOOAtAHw6UA2pYStDKAHqQG4YccAMzAAaHGF6kA1gC9BAKwDG4gLZLSJXoMmksXQUiGlVqwbyykRgqGFbb6FLuIBGTcShXCxOLlD3sjlwAjqS2Orzi+qRuiv4kLiiKoSTBuI5MJKQhgrLuOErOOGlRlOIkUOKUGKSUgQy8kThQKKxmjm7iuiRIUIIhUUikmYKqweIhJkr9TcphBo4osxokTNI6QySq9RT5c1oODLJNieLSRabiLZp9QeMFPCTHG6RKYIpeGJSknoIoql0pCQSApBBhKr4UokIGgwEo0JQoABTJKOCpnIqeNSbIw6Lzdf46AESIFcBYNJpKWSkBS3BiScT8Uh5QQg2oCRxsbLTRzKM7Ukh+F4VDkMfZMHkUxlZLTpBhkxlAsaCKgTFJKSU4Rp8MiORriDVhVEMRJ6JiCYIucT7OERcpAhTBUbE7Ukc7mJp1V7k4qWEjMXL5SYkKmCCWK0iWj4GuwgzVfCZNNbY7KHZqPcH9e69H5pvnNGokL79FakciItAoPoAbUoWEwSIAvABZMAINCqCAkMAAXQA3GWcEjuzha-WME3m5RggBXStI-ukAC+ICXQA
  const cycleModules = ["sp", "xt", "zv", "lk"];
  return 0;
}

function getOriginsForConjections(modules: Conjunction[], map: Map<string, Module>) {
  map.forEach((mod) => {
    modules.forEach((conjectionModule) => {
      const cModulesInModule = mod.destinations.filter((mod) => mod === conjectionModule.id);
      if (cModulesInModule.length > 0) {
        const cModToUpdate = map.get(conjectionModule.id)! as Conjunction;
        cModToUpdate.memory.set(mod.id, false);

        map.set(cModToUpdate.id, cModToUpdate);
      }
    });
  });
}
