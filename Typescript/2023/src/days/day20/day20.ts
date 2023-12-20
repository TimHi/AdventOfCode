import { Queue } from "data-structure-typed";
import * as fs from "fs";

const isSample = true;

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day20/sample.txt" : "/src/days/day20/full.txt";

  const uberService = new ÜberSystemQueueDispatcherService();
  const broadcastModule = new Broadcast("broadcaster", [], [], uberService);
  fs.readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .forEach((config) => {
      const splits = config.split("->");
      const destinations = splits[1].split(",").map((d) => d.replaceAll(" ", ""));
      if (splits[0][0] === "&") {
        const moduleId = splits[0].substring(1).replaceAll(" ", "");
        uberService.addModule(new Conjunction(moduleId, [], destinations, uberService));
      } else if (splits[0][0] === "%") {
        const moduleId = splits[0].substring(1).replaceAll(" ", "");
        uberService.addModule(new FlipFlop(moduleId, [], destinations, uberService));
      } else if (splits[0].replace(" ", "") === "broadcaster") {
        broadcastModule.destinations = destinations;
      }
    });
  uberService.addModule(broadcastModule);

  uberService.StartButtonSmashing();
  return uberService.pulseProduct();
}

export function SolvePartTwo(): number {
  console.log("TBD");
  return 0;
}

interface Signal {
  id: number;
  pulse: boolean;
  origin: string;
  destination: string;
}

interface Module {
  id: string;
  signals: Signal[];
  destinations: string[];
  uberSystem: ÜberSystemQueueDispatcherService;
  processSignal: (signal: Signal) => void;
}

class ÜberSystemQueueDispatcherService {
  private buttonPressQueue: Queue<Signal> = new Queue<Signal>();
  private interModuleCommunicationQueue: Queue<Signal> = new Queue<Signal>();
  private modules = new Map<string, Module>();
  private BUTTON_PRESSES = 1000;
  private lowPulseCount = 0;
  private highPulseCount = 0;
  public findModule(id: string): Module {
    const result = this.modules.get(id);
    if (result === undefined) throw new Error("Module " + id + " not found");
    return result;
  }

  public addModule(module: Module) {
    this.modules.set(module.id, module);
  }

  public getDestinationIds(origin: string): string[] {
    const originModule = this.findModule(origin);
    return originModule.destinations;
  }

  StartButtonSmashing() {
    //Push button sets the intial broadcast signals into movement
    for (let buttonSmashCount = 0; buttonSmashCount < this.BUTTON_PRESSES; buttonSmashCount++) {
      this.getDestinationIds("broadcaster").forEach((d) =>
        this.enQueueSignal({ id: buttonSmashCount, destination: d, origin: "broadcaster", pulse: false })
      );
      //Resolve the issued signals before pressing button again
      while (this.buttonPressQueue.size > 0) {
        const signalToProcess = this.buttonPressQueue.dequeue();
        if (signalToProcess === undefined) throw new Error("How did an undefined signal get into the uber system");
        this.processSignal(signalToProcess);
      }
    }
  }

  private processSignal(signal: Signal) {
    const destinationModule = this.findModule(signal.destination);
    destinationModule.processSignal(signal);
  }

  public enQueueSignal(signal: Signal) {
    this.buttonPressQueue.enqueue(signal);
    signal.pulse ? this.highPulseCount++ : this.lowPulseCount++;
  }

  pulseProduct(): number {
    return this.lowPulseCount * this.highPulseCount;
  }
}

class Broadcast implements Module {
  constructor(
    public id: string,
    public signals: Signal[],
    public destinations: string[],
    public uberSystem: ÜberSystemQueueDispatcherService
  ) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public processSignal(_signal: Signal) {
    throw new Error("Broadcaster should not receive signals");
  }
}

class FlipFlop implements Module {
  public state: boolean = false; // Flip-flop modules (prefix %) are either on or off; they are initially off.
  constructor(
    public id: string,
    public signals: Signal[],
    public destinations: string[],
    public uberSystem: ÜberSystemQueueDispatcherService
  ) {}

  public processSignal(signal: Signal) {
    //Should this still increase the pulsecount if it is high
    if (!signal) {
      this.state = !this.state;
      const destinations = this.uberSystem.getDestinationIds(this.id);
      destinations.forEach((d) => {
        this.uberSystem.enQueueSignal({ origin: this.id, destination: d, pulse: this.state, id: -1 });
      });
    }
  }
}

class Conjunction implements Module {
  public previousSignals: Map<string, Signal> = new Map<string, Signal>();
  constructor(
    public id: string,
    public signals: Signal[],
    public destinations: string[],
    public uberSystem: ÜberSystemQueueDispatcherService
  ) {}

  public processSignal(signal: Signal) {}

  public hasAnyLowsRemebered(): boolean {
    let rememberedLow = false;
    this.previousSignals.forEach((v) => {
      if (!v.pulse) rememberedLow = true;
    });
    return rememberedLow;
  }
}
