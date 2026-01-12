import {
  setTerrain,
  movePlayer,
  MOVE_PLAYER,
  CREATE_TERRAIN
} from './main.actions';
import * as R from 'ramda';
import { orientation, neighbour, neighbours } from '../graph/cartesian-grid';

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
    R.length,
    R.filter(neigh => neigh && neigh.light),
    () => neighbours(cell.x, cell.y, terrain)
  )();

const isWall = cell => cell.terrain === 'B';

const updateTwoDimensional = ([x, y], val) => R.adjust(R.update(x, val), y);

const trace = val => {
  console.log(val);
  return val;
}

const setLights = terrain => R.compose(
  R.reduce(
    (terrainAcc, cell) =>
      updateTwoDimensional([cell.x, cell.y], R.assoc('light', !hasNeighbourWithLight(cell, terrainAcc), cell))(terrainAcc)
  , terrain),
  R.filter(isWall),
  R.unnest
)(terrain);

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
      return R.assoc('playerPos', directNeighbour, prevState);

    case CREATE_TERRAIN:
      const newState = R.compose(
        state => R.assoc('terrain', setLights(state.terrain))(state),
        R.assoc('playerPos', getPlayerPos(action.payload)),
        R.assoc('terrain', action.payload)
      )(prevState);

      return newState;

    default:
      return prevState;
  }
};
