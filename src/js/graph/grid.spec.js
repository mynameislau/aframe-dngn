import {
  neighbours,
  neighbour,
  orientation
} from './grid';
import assert from 'assert';

const sampleGrid = [
  ['a', 'b', 'c', 'd'],
  ['e', 'f', 'g', 'h'],
  ['i', 'j', 'k', 'l'],
  ['m', 'n', 'o', 'p'],
  ['q', 'r', 's', 't']
]

describe('grid capabilities :', () => {
  it('can get a list of neighbours', () => {
    assert.deepEqual(neighbours(1, 1, sampleGrid), ['b', 'e', 'g', 'j']);
  });

  it('should return null if some neighbour is out of the grid (like if your target is close to an edge', () => {
    assert.deepEqual(neighbours(0, 0, sampleGrid), [null, null, 'b', 'e']);
  });

  it('should be able to return a specific neighbour or null if it does not exist', () => {
    assert.deepEqual(neighbour(1, 1, 'N', sampleGrid), 'b');
    assert.deepEqual(neighbour(1, 1, 'S', sampleGrid), 'j');
    assert.deepEqual(neighbour(0, 0, 'N', sampleGrid), null);
    assert.deepEqual(neighbour(0, 0, 'E', sampleGrid), 'b');
    assert.deepEqual(neighbour(2, 2, 'W', sampleGrid), 'j');
  });

  it('can deduce point location in space from another point', () => {
    assert.equal(orientation(1, 1, 1, 0), 'N');
    assert.equal(orientation(1, 1, 0, 1), 'W');
    assert.equal(orientation(1, 1, 2, 1), 'E');
    assert.equal(orientation(1, 1, 1, 2), 'S');
    assert.equal(orientation(0, 0, 1, 4), 'S');
  });
});
