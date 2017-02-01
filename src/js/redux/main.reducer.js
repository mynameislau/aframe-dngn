import {
  setTerrain,
  movePlayer,
  MOVE_PLAYER,
  CREATE_TERRAIN
} from './main.actions';
import R from 'ramda';
import { orientation, neighbour } from '../graph/grid';

const initialState = {
  terrain: null,
  playerPos: null
};

const getPlayerPos = R.compose(
  R.head,
  R.filter(cell => cell.terrain === '@'),
  R.unnest
)

const hasNeighbourWithLight = (cell, terrain) =>
  R.compose(
    R.filter(neigh => neigh.terrain === 'B' && neigh.light),
    () => neighbours(cell.x, cell.y, terrain)
  );

const isWall = cell => cell.terrain === 'B';

const updateTwoDimensional = (x, y, val) => R.adjust(R.update(x, val), y);

const trace = val => {
  console.log(val);
  return val;
}

const setLights = R.compose(
  R.reduce((terrainAcc, cell) => updateTwoDimensional(x, y, R.assoc('light', hasNeighbourWithLight(cell, terrainAc)))),
  trace,
  R.filter(isWall),
  R.unnest
);

export default (prevState, action) => {
  prevState = prevState || initialState;
  switch (action.type) {

    case MOVE_PLAYER:
      const x1 = prevState.playerPos.x;
      const y1 = prevState.playerPos.y;
      const x2 = action.payload.x;
      const y2 = action.payload.y;
      const dir = orientation(x1, y1, x2, y2);
      const directNeighbour = neighbour(x1, y1, dir, prevState.terrain);
      console.log(action.payload, prevState.playerPos, dir, directNeighbour, prevState.terrain);
      return R.assoc('playerPos', directNeighbour, prevState);

    case CREATE_TERRAIN:
      const newState = R.compose(
        state => R.assoc('terrain', setLights(state.terrain))(state),
        R.assoc('playerPos', getPlayerPos(action.payload)),
        R.assoc('terrain', action.payload)
      )(prevState);

      console.log(setLights(newState.terrain));
      debugger;

      return newState;

    default:
      return prevState;
  }
};
