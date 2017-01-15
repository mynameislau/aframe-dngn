import { Maybe } from 'ramda-fantasy';
import R from 'ramda';
const Just = Maybe.Just;
const Nothing = Maybe.Nothing;

const node = R.curry((grid, y, x) =>
  (grid[y] && grid[y][x] ? grid[y][x] : null)
);

export const neighbours = R.curry((x, y, grid) => {
  const gNode = node(grid);
  const top = gNode(y - 1);
  const mid = gNode(y);
  const bottom = gNode(y + 1);

  return [
    top(x),
    mid(x - 1), mid(x + 1),
    bottom(x),
  ];
});

export const neighbourIndex = direction => {
  switch (direction) {
    case 'N': return 0;
    case 'W': return 1;
    case 'E': return 2;
    case 'S': return 3;
  }
}

/******

         - PI / 2
PI                    0
          PI / 2

*******/

export const neighbour = R.curry((x, y, direction, grid) =>
  neighbours(x, y, grid)[neighbourIndex(direction)]);

export const orientation = (x1, y1, x2, y2) => {
  const angle = Math.atan2(y2 - y1, x2 - x1);

  console.log(x1, y1, x2, y2, 'angle :', angle);

  if (angle >= - Math.PI * 0.75 && angle < - Math.PI * 0.25) { return 'N'; }
  if (angle >= - Math.PI * 0.25 && angle < Math.PI * 0.25 ) { return 'E'; }
  if (angle >= Math.PI * 0.25 && angle < Math.PI * 0.75) { return 'S'; }
  if (angle >= Math.PI * 0.75 || angle < - Math.PI * 0.75) { return 'W'; }

  return null;
}
