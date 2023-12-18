import gaussShoelace from "gauss-shoelace";
import { Point } from "./coords";

export function getInnerPolygonArea(points: Point[]): number {
  const shoelacePoints: Array<[number, number]> = [];
  points.forEach((v) => {
    shoelacePoints.push([v.X, v.Y]);
  });
  const shoelace = gaussShoelace(shoelacePoints);
  const innerPoints = -shoelacePoints.length / 2 + 1 + shoelace;
  return innerPoints;
}
