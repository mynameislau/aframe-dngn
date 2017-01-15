import {
  createTwoDimensionalTerrain,
  createTerrain,
  stripBeforeFirstChar,
  getCell,
  getRow,
  createTerrainFromString
} from './terrain-utils';

import assert from 'assert';

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
  { x: 0, y: 0, terrain: 0 },
  { x: 1, y: 0, terrain: 1 }
]];

describe('Creating a map', () => {
  it('can strip line breaks before first significant character', () => {
    const otherSample = `

    ok`;
    assert.equal(stripBeforeFirstChar(otherSample), 'ok');
  });

  it('should return a two dimensional array from a string', () => {
    assert.deepEqual(
      createTwoDimensionalTerrain(big),
      bigResult
    );
  });

  it('should return terrain objects', () => {
    assert.deepEqual(getCell(1, 2, 'a'), { x: 1, y: 2, terrain: 'a'});
  });

  it('should return an array of terrain objects from an array', () => {
    assert.deepEqual(
      getRow(10)(['a', 'b']),
      [{ x: 0, y: 10, terrain: 'a' }, { x: 1, y: 10, terrain: 'b'}]
    );
  });

  it('should return a beautiful object map from a two dimensional map', () => {
    assert.deepEqual(
      createTerrain([[0, 1]]),
      simpleOutput
    )
  });

  it('should return something proper from a string', () => {
    assert.deepEqual(
      createTerrainFromString(simple),
      simpleOutput
    )
  })
});
