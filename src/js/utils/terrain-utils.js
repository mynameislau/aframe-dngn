import { trace }  from './utils';

const splitRows = (str) => str.split('\n');
const splitCols = (str) => str.split('');
export const stripBeforeFirstChar = (str) => str.replace(/^[\s]*([\s\S]*)/gmi, '$1');
export const stripAfterLastChar = (str) => str.replace(/([\s\S]*?)\s+$/gmi, '$1');

export const createTwoDimensionalTerrain = (str) => {
  const stripped = stripBeforeFirstChar(stripAfterLastChar(str));
  const rows = splitRows(stripped);
  return rows.map(splitCols);
};

export const getCell = (x, y, symbol) => ({
  x: x,
  y: y,
  terrain: symbol
});

export const getAllRows = (rows) => {
  let rowAcc = 0;
  const result = rows.map((rowVal) => {
    const row = getRow(rowAcc)(rowVal);
    rowAcc++;
    return row;
  });
  return result;
};

export const getRow = rowIndex => (cols) => {
  let colIndex = 0;
  const result = cols.map((cellVal) => {
    const cell = getCell(colIndex, rowIndex, cellVal);
    colIndex++;
    return cell;
  });
  return result;
};

export const canHaveWalls = cell => cell.terrain !== ' ' && cell.terrain !== 'B';

export const createTerrain = getAllRows;

export const createTerrainFromString = (str) => createTerrain(createTwoDimensionalTerrain(str));

export const orientationToVector = orientation => {
  switch (orientation) {
    case 'S': return [0, 0, -1]
    case 'N': return [0, 0, 1]
    case 'E': return [1, 0, 0]
    case 'W': return [-1, 0, 0]
  }
}

export const orientationToRotation = orientation => {
  switch (orientation) {
    case 'E': return [0, 90, 0]
    case 'N': return [0, 0, 0]
    case 'W': return [0, 270, 0]
    case 'S': return [0, 180, 0]
  }
}
