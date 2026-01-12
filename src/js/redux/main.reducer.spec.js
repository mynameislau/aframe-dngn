import { describe, it, expect, beforeEach } from 'vitest';
import mainReducer from './main.reducer';
import { createTerrain, movePlayer, CREATE_TERRAIN, MOVE_PLAYER } from './main.actions';

describe('Main Reducer', () => {
  let initialState;

  beforeEach(() => {
    initialState = {
      terrain: null,
      playerPos: null
    };
  });

  it('should return the initial state', () => {
    expect(mainReducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(initialState);
  });

  describe('CREATE_TERRAIN', () => {
    it('should handle terrain creation', () => {
      const terrain = [
        [
          { x: 0, y: 0, terrain: '@' },
          { x: 1, y: 0, terrain: '0' }
        ]
      ];

      const action = createTerrain(terrain);
      const newState = mainReducer(initialState, action);

      expect(newState.terrain).toBeDefined();
      expect(newState.playerPos).toEqual({ x: 0, y: 0, terrain: '@' });
    });

    it('should create terrain with player and floor tiles', () => {
      const terrain = [
        [
          { x: 0, y: 0, terrain: '@' },
          { x: 1, y: 0, terrain: '0' },
          { x: 2, y: 0, terrain: '0' }
        ],
        [
          { x: 0, y: 1, terrain: '0' },
          { x: 1, y: 1, terrain: '0' },
          { x: 2, y: 1, terrain: '0' }
        ]
      ];

      const action = createTerrain(terrain);
      const newState = mainReducer(initialState, action);

      // Check that terrain has been created successfully
      expect(newState.terrain).toBeDefined();
      expect(newState.terrain.length).toBe(2);
      expect(newState.playerPos).toBeDefined();
      expect(newState.playerPos.terrain).toBe('@');
      expect(newState.playerPos.x).toBe(0);
      expect(newState.playerPos.y).toBe(0);
    });

    it('should find player position from @ symbol', () => {
      const terrain = [
        [
          { x: 0, y: 0, terrain: '0' },
          { x: 1, y: 0, terrain: '0' }
        ],
        [
          { x: 0, y: 1, terrain: '@' },
          { x: 1, y: 1, terrain: '0' }
        ]
      ];

      const action = createTerrain(terrain);
      const newState = mainReducer(initialState, action);

      expect(newState.playerPos).toEqual({ x: 0, y: 1, terrain: '@' });
    });
  });

  describe('MOVE_PLAYER', () => {
    it('should move player to adjacent cell', () => {
      const terrain = [
        [
          { x: 0, y: 0, terrain: '@' },
          { x: 1, y: 0, terrain: '0' }
        ],
        [
          { x: 0, y: 1, terrain: '0' },
          { x: 1, y: 1, terrain: '0' }
        ]
      ];

      const stateWithTerrain = mainReducer(initialState, createTerrain(terrain));

      // Move player to the right (E)
      const moveAction = movePlayer({ x: 1, y: 0 });
      const newState = mainReducer(stateWithTerrain, moveAction);

      expect(newState.playerPos).toEqual({ x: 1, y: 0, terrain: '0' });
    });

    it('should calculate direction based on coordinates', () => {
      const terrain = [
        [
          { x: 0, y: 0, terrain: '0' },
          { x: 1, y: 0, terrain: '@' },
          { x: 2, y: 0, terrain: '0' }
        ],
        [
          { x: 0, y: 1, terrain: '0' },
          { x: 1, y: 1, terrain: '0' },
          { x: 2, y: 1, terrain: '0' }
        ]
      ];

      const stateWithTerrain = mainReducer(initialState, createTerrain(terrain));

      // Move player down (S)
      const moveAction = movePlayer({ x: 1, y: 1 });
      const newState = mainReducer(stateWithTerrain, moveAction);

      expect(newState.playerPos.x).toBe(1);
      expect(newState.playerPos.y).toBe(1);
    });
  });

  describe('Unknown action', () => {
    it('should return current state for unknown actions', () => {
      const currentState = {
        terrain: [[{ x: 0, y: 0, terrain: '0' }]],
        playerPos: { x: 0, y: 0, terrain: '0' }
      };

      const newState = mainReducer(currentState, { type: 'UNKNOWN_ACTION' });

      expect(newState).toBe(currentState);
    });
  });
});
