export var Direction;
(function (Direction) {
  Direction['N'] = 'North';
  Direction['E'] = 'East';
  Direction['S'] = 'South';
  Direction['W'] = 'West';
})(Direction || (Direction = {}));
export function IndexOfDirection(direction) {
  switch (direction) {
    case Direction.N:
      return 0;
    case Direction.E:
      return 1;
    case Direction.S:
      return 2;
    case Direction.W:
      return 3;
  }
}
export function GetDirection(dir) {
  switch (dir) {
    case 'North':
      return Direction.N;
    case 'East':
      return Direction.E;
    case 'South':
      return Direction.S;
    case 'West':
      return Direction.W;
    default:
      throw new Error('Could not parse Direction ' + dir);
  }
}
export function GetPointKey(p) {
  return `${p.X}:${p.Y}`;
}
export function GetDirectedPointKey(point) {
  return GetPointKey(point) + '-' + point.direction;
}
export function GetDirectedPointFromKey(key) {
  const pattern = /^(\d+):(\d+)-([A-Za-z]+)$/; // Regular expression to match the format
  const match = key.match(pattern);
  if (match) {
    const [, X, Y, direction] = match.map((part) =>
      isNaN(Number(part)) ? part : Number(part),
    );
    if (
      typeof X === 'number' &&
      typeof Y === 'number' &&
      Direction[direction]
    ) {
      return { X, Y, direction: Direction[direction] };
    }
  }
  throw new Error('Point could not be parsed');
}
export function GetPointFromKey(key) {
  const split = key.split(':');
  return { X: Number(split[0]), Y: Number(split[1]) };
}
export function getManhattanDistance(a, b) {
  return Math.abs(a.X - b.X) + Math.abs(a.Y - b.Y);
}
//# sourceMappingURL=coords.js.map
