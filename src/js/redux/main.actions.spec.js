import { describe, it, expect } from 'vitest';
import { createTerrain, movePlayer, CREATE_TERRAIN, MOVE_PLAYER } from './main.actions';

describe('Redux Actions', () => {
  describe('createTerrain', () => {
    it('should create an action to create terrain', () => {
      const terrainObj = [
        [{ x: 0, y: 0, terrain: '0' }]
      ];

      const expectedAction = {
        type: CREATE_TERRAIN,
        payload: terrainObj
      };

      expect(createTerrain(terrainObj)).toEqual(expectedAction);
    });

    it('should have the correct action type constant', () => {
      expect(CREATE_TERRAIN).toBe('CREATE_TERRAIN');
    });
  });

  describe('movePlayer', () => {
    it('should create an action to move player', () => {
      const orientation = { x: 1, y: 2 };

      const expectedAction = {
        type: MOVE_PLAYER,
        payload: orientation
      };

      expect(movePlayer(orientation)).toEqual(expectedAction);
    });

    it('should have the correct action type constant', () => {
      expect(MOVE_PLAYER).toBe('MOVE_PLAYER');
    });

    it('should accept different orientation formats', () => {
      const testCases = [
        { x: 0, y: 0 },
        { x: 5, y: 10 },
        'N',
        'S'
      ];

      testCases.forEach(orientation => {
        const action = movePlayer(orientation);
        expect(action.type).toBe(MOVE_PLAYER);
        expect(action.payload).toBe(orientation);
      });
    });
  });
});
