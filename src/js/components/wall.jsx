import React from 'react';
import { Entity } from 'aframe-react';
import { actualNeighbours, orientation } from '../graph/cartesian-grid';
import { orientationToVector, orientationToRotation, canHaveWalls } from '../utils/terrain-utils';

const Light = orientationValue =>
  <Entity rotation={orientationToRotation(orientationValue).join(' ')}>
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

const Wall = orientationValue => {
  const vector = orientationToVector(orientationValue);
  const scaled = vector.map(val => val * 0.5);
  const [x, y, z] = scaled;
  const position = [x, 1, z].join(' ');
  const rotation = orientationToRotation(orientationValue).join(' ');

  return <Entity
    position={position}
    material={{
      shader: 'line-dashed',
      repeat: '{x:2,y:2}',
      tile: '/data/tiles/snake0.png',
      side: 'single'
    }}
    rotation={rotation}
    geometry="primitive: plane; height: 2; width: 1;"
    >

  </Entity>;
}

const adjacentFloorCellsOrientations = (board, {x, y}) => {
  const neighs = actualNeighbours(x, y, board);
  const floorCells = neighs.filter(canHaveWalls);
  return floorCells.map(floorCell => orientation(x, y, floorCell.x, floorCell.y));
};

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
    adjacentFloorCellsOrientations(board, cell).map(Wall)
  }
  {
    getLights(board, cell).map(Light)
  }
</Entity>;




// obj-model="obj: url(/data/pillar.obj); mtl: url(/data/pillar.mtl)"
