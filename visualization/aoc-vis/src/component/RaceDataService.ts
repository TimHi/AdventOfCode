import { Point } from "../util";

interface Boat {
  preload: number;
  currentSpeed: number;
  position: Point;
}

export class RaceDataService {
  public duration: number;
  public distance: number;
  public boats: Map<number, Boat> = new Map<number, Boat>();

  constructor(duration: number, distance: number) {
    this.distance = distance;
    this.duration = duration;
    for (let index = 0; index < duration; index++) {
      this.boats.set(index, {
        preload: index,
        currentSpeed: index * 24,
        position: { x: 0, y: 25 * index },
      });
    }
  }

  updateBoats(time: number) {
    this.boats.forEach((boat, k) => {
      if (boat.preload < time && k !== 0) {
        const newX = boat.position.x + boat.currentSpeed;
        boat.position = { x: newX, y: boat.position.y };
        this.boats.set(k, boat);
      }
    });
  }
}
