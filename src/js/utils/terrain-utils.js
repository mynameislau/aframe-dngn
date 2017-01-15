import R from 'ramda';
import { trace }  from './utils';

const splitRows = R.split('\n');
const splitCols = R.split('');
export const stripBeforeFirstChar = R.replace(/^[\s]*([\s\S]*)/gmi, '$1');
export const stripAfterLastChar = R.replace(/([\s\S]*?)\s+$/gmi, '$1');

export const createTwoDimensionalTerrain = R.compose(
  R.map(splitCols),
  splitRows,
  stripAfterLastChar,
  stripBeforeFirstChar
);

export const getCell = (x, y, symbol) => ({
  x: x,
  y: y,
  terrain: symbol
});

export const getAllRows = R.compose(
  R.last,
  R.mapAccum((rowAcc, rowVal) => [
    rowAcc + 1,
    getRow(rowAcc)(rowVal)
  ]
  , 0)
);

export const getRow = rowIndex => R.compose(
  R.last,
  R.mapAccum((colIndex, cellVal) => [
    colIndex + 1,
    getCell(colIndex, rowIndex, cellVal)
  ]
  , 0)
);

export const createTerrain = getAllRows;

export const createTerrainFromString = R.compose(createTerrain, createTwoDimensionalTerrain);
