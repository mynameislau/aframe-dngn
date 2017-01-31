import React from 'react';
import { Entity } from 'aframe-react';
import { neighbours, orientation } from '../graph/grid';
import R from 'ramda';
import { Maybe } from 'ramda-fantasy';
const { Just, Nothing } = Maybe;

const Light = vec =>
  <Entity position={vec}>
      <Entity light="color: #ff6300; decay: 2.38; distance: 13; intensity: 4.78; type: point;"/>
      <Entity geometry="primitive: box; height: 0.1; width: 0.1; depth: 0.1" />
  </Entity>;

const getLights = ({x, y}, board) => {

  const getVec = orientation => {
    switch (orientation) {
      case 'S': return '0 0 -1'
      case 'N': return '0 0 1'
      case 'E': return '1 0 0'
      case 'W': return '-1 0 0'
    }
  }

  const trace = val => {
    console.log(val);
    return val;
  }

  const adjFloorVec = R.compose(
    R.map(getVec),
    R.map(floorCell => orientation(x, y, floorCell.x, floorCell.y)),
    R.filter(cell => cell && cell.terrain === ' '),
    () => neighbours(x, y, board)
  );

  const setLights = R.compose(
    R.map(adjFloorVec),
    () => Math.random() > 0.9 ? Just() : Nothing([])
  );
  const toReturn = setLights().getOrElse([]);

  return toReturn;
}

export default ({ cell, board }) => <Entity>
  <Entity
    material={{
      shader: 'line-dashed',
      tile: '/data/tiles/snake0.png',
      side: 'single'
    }}
    geometry="primitive: box; height: 1; width: 1; depth: 1"
  ></Entity>
  {
    R.map(Light, getLights(cell, board))
  }
</Entity>;




// obj-model="obj: url(/data/pillar.obj); mtl: url(/data/pillar.mtl)"
