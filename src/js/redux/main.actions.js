export const CREATE_TERRAIN = 'CREATE_TERRAIN';
export const MOVE_PLAYER = 'MOVE_PLAYER';

export const createTerrain = (terrainObj) => ({
  type: CREATE_TERRAIN,
  payload: terrainObj
});

export const movePlayer = (orientation) => ({
  type: MOVE_PLAYER,
  payload: orientation
})
