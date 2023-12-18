import gaussShoelace from "gauss-shoelace";
import { Point } from "./coords";

export function getInnerPolygonArea(points: Point[], stepLength: number): number {
  const shoelacePoints: Array<[number, number]> = [];
  points.forEach((v) => {
    shoelacePoints.push([v.X, v.Y]);
  });
  const shoelace = gaussShoelace(shoelacePoints);
  const innerPoints = -stepLength / 2 + 1 + shoelace;
  return innerPoints;
}
