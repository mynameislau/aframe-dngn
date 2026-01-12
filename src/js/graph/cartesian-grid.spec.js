import {
  neighbours,
  neighbour,
  orientation,
  actualNeighCoords,
  actualNeighbours,
  flood,
  floodOld,
  insert
} from './cartesian-grid';
import { describe, it, expect } from 'vitest';

const sampleGrid = [
  ['a', 'b', 'c', 'd'],
  ['e', 'f', 'g', 'h'],
  ['i', 'j', 'k', 'l'],
  ['m', 'n', 'o', 'p'],
  ['q', 'r', 's', 't']
];

const simpleSample = [
  ['a', 'b', 'c'],
  ['d', 'e', 'f'],
  ['g', 'h', 'i'],
];

describe('grid capabilities', () => {
  it('can get a list of neighbours', () => {
    expect(neighbours(1, 1, sampleGrid)).toEqual(['b', 'g', 'j', 'e']);
  });

  it('should return null if some neighbour is out of the grid (like if your target is close to an edge', () => {
    expect(neighbours(0, 0, sampleGrid)).toEqual([null, 'b', 'e', null]);
  });

  it('provide a utility function that retrieves only the non null neighbours', () => {
    expect(actualNeighbours(0, 0, sampleGrid)).toEqual(['b', 'e']);
    expect(actualNeighbours(0, 0, [['i']])).toEqual([]);
  });

  it('provide a function that retrieves only the coordinates of number inside the grid', () => {
    expect(
      actualNeighCoords(0, 0, sampleGrid[0].length, sampleGrid.length)
    ).toEqual([[1, 0], [0, 1]]);
  });

  it('should be able to return a specific neighbour or null if it does not exist', () => {
    expect(neighbour(1, 1, 'N', sampleGrid)).toBe('b');
    expect(neighbour(1, 1, 'S', sampleGrid)).toBe('j');
    expect(neighbour(0, 0, 'N', sampleGrid)).toBe(null);
    expect(neighbour(0, 0, 'E', sampleGrid)).toBe('b');
    expect(neighbour(2, 2, 'W', sampleGrid)).toBe('j');
  });

  it('can deduce point location in space from another point', () => {
    expect(orientation(1, 1, 1, 0)).toBe('N');
    expect(orientation(1, 1, 0, 1)).toBe('W');
    expect(orientation(1, 1, 2, 1)).toBe('E');
    expect(orientation(1, 1, 1, 2)).toBe('S');
    expect(orientation(0, 0, 1, 4)).toBe('S');
  });

  it('can insert a value inside a two dimensional array', () => {
    expect(insert([2, 2], 'toto')).toEqual(
      [ [], [], [ null, null, 'toto' ] ]
    );
  });

  it('can flood through a grid conditionnally with the use of a predicate', () => {
    expect(
      flood(val => val !== 'b', [0, 0], simpleSample)
    ).toEqual(
      [ [ 'a', null , 'c' ], [ 'd', 'e', 'f' ], [ 'g', 'h', 'i' ] ]
    );
  });
});
