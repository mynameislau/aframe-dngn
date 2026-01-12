import {
  createTwoDimensionalTerrain,
  createTerrain,
  stripBeforeFirstChar,
  getCell,
  getRow,
  createTerrainFromString
} from './terrain-utils';

import { describe, it, expect } from 'vitest';

const big = `
00000
01000
01000
01110
00000
`;

const bigResult = [
  ['0', '0', '0', '0', '0'],
  ['0', '1', '0', '0', '0'],
  ['0', '1', '0', '0', '0'],
  ['0', '1', '1', '1', '0'],
  ['0', '0', '0', '0', '0']
];

const simple = `

01
`;

const simpleOutput = [[
  { x: 0, y: 0, terrain: '0' },
  { x: 1, y: 0, terrain: '1' }
]];

describe('Creating a map', () => {
  it('can strip line breaks before first significant character', () => {
    const otherSample = `

    ok`;
    expect(stripBeforeFirstChar(otherSample)).toBe('ok');
  });

  it('should return a two dimensional array from a string', () => {
    expect(createTwoDimensionalTerrain(big)).toEqual(bigResult);
  });

  it('should return terrain objects', () => {
    expect(getCell(1, 2, 'a')).toEqual({ x: 1, y: 2, terrain: 'a'});
  });

  it('should return an array of terrain objects from an array', () => {
    expect(getRow(10)(['a', 'b'])).toEqual(
      [{ x: 0, y: 10, terrain: 'a' }, { x: 1, y: 10, terrain: 'b'}]
    );
  });

  it('should return a beautiful object map from a two dimensional map', () => {
    const numericOutput = [[
      { x: 0, y: 0, terrain: 0 },
      { x: 1, y: 0, terrain: 1 }
    ]];
    expect(createTerrain([[0, 1]])).toEqual(numericOutput);
  });

  it('should return something proper from a string', () => {
    expect(createTerrainFromString(simple)).toEqual(simpleOutput);
  });
});
