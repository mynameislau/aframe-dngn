import {
  setTerrain,
  movePlayer,
  MOVE_PLAYER,
  CREATE_TERRAIN
} from './main.actions';
import { orientation, neighbour, neighbours } from '../graph/cartesian-grid';

const initialState = {
  terrain: null,
  playerPos: null
};

const getPlayerPos = (terrain) => {
  const flattened = terrain.flat();
  return flattened.find(cell => cell.terrain === '@');
}

const hasNeighbourWithLight = (cell, terrain) => {
  const neighs = neighbours(cell.x, cell.y, terrain);
  return neighs.filter(neigh => neigh && neigh.light).length;
};

const isWall = cell => cell.terrain === 'B';

const updateTwoDimensional = ([x, y], val) => (grid) => {
  return grid.map((row, rowIndex) =>
    rowIndex === y
      ? row.map((cell, colIndex) => colIndex === x ? val : cell)
      : row
  );
};

const trace = val => {
  console.log(val);
  return val;
}

const setLights = terrain => {
  const flattened = terrain.flat();
  const walls = flattened.filter(isWall);
  return walls.reduce(
    (terrainAcc, cell) => {
      const cellWithLight = { ...cell, light: !hasNeighbourWithLight(cell, terrainAcc) };
      return updateTwoDimensional([cell.x, cell.y], cellWithLight)(terrainAcc);
    },
    terrain
  );
};

export default (prevState, action) => {
  prevState = prevState || initialState;
  switch (action.type) {

    case MOVE_PLAYER:
      const x1 = prevState.playerPos.x;
      const y1 = prevState.playerPos.y;
      const x2 = action.payload.x;
      const y2 = action.payload.y;
      console.log('moving player from :', x1, y1);
      const dir = orientation(x1, y1, x2, y2);
      const directNeighbour = neighbour(x1, y1, dir, prevState.terrain);
      console.log('direction: ', dir);
      console.log('to : ', x2, y2);
      return { ...prevState, playerPos: directNeighbour };

    case CREATE_TERRAIN:
      const newState = {
        ...prevState,
        terrain: action.payload,
        playerPos: getPlayerPos(action.payload)
      };
      newState.terrain = setLights(newState.terrain);
      return newState;

    default:
      return prevState;
  }
};
