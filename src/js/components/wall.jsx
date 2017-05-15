import React from 'react';
import { Entity } from 'aframe-react';
import { actualNeighbours, orientation } from '../graph/cartesian-grid';
import { orientationToVector, orientationToRotation, canHaveWalls } from '../utils/terrain-utils';
import R from 'ramda';
import { Maybe } from 'ramda-fantasy';
const { Just, Nothing } = Maybe;

const Light = orientation =>
  <Entity rotation={
    R.compose(
      R.join(' '),
      orientationToRotation
    )(orientation)
  }>
      <Entity position="0 0.6 0.6" light="color: #ff6300; decay: 3; distance: 5; intensity: 1; type: point;"/>
      <Entity
        material={{
          shader: 'line-dashed',
          tile: '/data/torch.png'
        }}
        obj-model="obj: #torch-obj;"
        position="0 0.6 0.5"
        />
  </Entity>;

const Wall = orientation =>
  <Entity
    position={
      R.compose(
        R.join(' '),
        ([x, y, z]) => [x, 1, z],
        R.map(val => val * 0.5),
        orientationToVector
      )(orientation)
    }
    material={{
      shader: 'line-dashed',
      repeat: '{x:2,y:2}',
      tile: '/data/tiles/snake0.png',
      side: 'single'
    }}
    rotation={
      R.compose(
        R.join(' '),
        orientationToRotation
      )(orientation)
    }
    geometry="primitive: plane; height: 2; width: 1;"
    >

  </Entity>

const adjacentFloorCellsOrientations = R.curry((board, {x, y}) => R.compose(
  R.map(floorCell => orientation(x, y, floorCell.x, floorCell.y)),
  R.filter(canHaveWalls),
  () => actualNeighbours(x, y, board)
)());

const trace = val => {
  console.log(val);
  return val;
}

const getLights = (board, {x, y, light}) =>// {
  light ?
    adjacentFloorCellsOrientations(board, {x, y})
  : [];

  // const trace = val => {
  //   console.log(val);
  //   return val;
  // }
  //
  // const setLights = R.compose(
  //   R.map(adjacentFloorCellsOrientations(board)),
  //   () => light ? Just() : Nothing([])
  // );
  //
  // const toReturn = setLights().getOrElse([]);
  //
  // return toReturn;
// }

export default ({ cell, board }) => <Entity>
  <Entity
  ></Entity>
  {
    R.map(Wall, adjacentFloorCellsOrientations(board, cell))
  }
  {
    R.map(Light, getLights(board, cell))
  }
</Entity>;




// obj-model="obj: url(/data/pillar.obj); mtl: url(/data/pillar.mtl)"
