import { describe, it, expect } from 'vitest';
import {
  canHaveWalls,
  orientationToVector,
  orientationToRotation
} from './terrain-utils';

describe('Terrain Utils - Additional Functions', () => {
  describe('canHaveWalls', () => {
    it('should return false for empty space cells', () => {
      const cell = { x: 0, y: 0, terrain: ' ' };
      expect(canHaveWalls(cell)).toBe(false);
    });

    it('should return false for wall cells (B)', () => {
      const cell = { x: 0, y: 0, terrain: 'B' };
      expect(canHaveWalls(cell)).toBe(false);
    });

    it('should return true for floor cells', () => {
      const cell = { x: 0, y: 0, terrain: '0' };
      expect(canHaveWalls(cell)).toBe(true);
    });

    it('should return true for player cell', () => {
      const cell = { x: 0, y: 0, terrain: '@' };
      expect(canHaveWalls(cell)).toBe(true);
    });

    it('should return true for other terrain types', () => {
      const terrainTypes = ['1', '2', 'D', 'F', 'W'];
      terrainTypes.forEach(terrain => {
        const cell = { x: 0, y: 0, terrain };
        expect(canHaveWalls(cell)).toBe(true);
      });
    });
  });

  describe('orientationToVector', () => {
    it('should return correct vector for South', () => {
      expect(orientationToVector('S')).toEqual([0, 0, -1]);
    });

    it('should return correct vector for North', () => {
      expect(orientationToVector('N')).toEqual([0, 0, 1]);
    });

    it('should return correct vector for East', () => {
      expect(orientationToVector('E')).toEqual([1, 0, 0]);
    });

    it('should return correct vector for West', () => {
      expect(orientationToVector('W')).toEqual([-1, 0, 0]);
    });

    it('should return undefined for invalid orientation', () => {
      expect(orientationToVector('X')).toBeUndefined();
    });
  });

  describe('orientationToRotation', () => {
    it('should return correct rotation for East', () => {
      expect(orientationToRotation('E')).toEqual([0, 90, 0]);
    });

    it('should return correct rotation for North', () => {
      expect(orientationToRotation('N')).toEqual([0, 0, 0]);
    });

    it('should return correct rotation for West', () => {
      expect(orientationToRotation('W')).toEqual([0, 270, 0]);
    });

    it('should return correct rotation for South', () => {
      expect(orientationToRotation('S')).toEqual([0, 180, 0]);
    });

    it('should return undefined for invalid orientation', () => {
      expect(orientationToRotation('X')).toBeUndefined();
    });

    it('should provide rotations in Y-axis only', () => {
      const orientations = ['N', 'E', 'S', 'W'];
      orientations.forEach(orientation => {
        const [x, y, z] = orientationToRotation(orientation);
        expect(x).toBe(0);
        expect(z).toBe(0);
        expect(typeof y).toBe('number');
      });
    });
  });
});
