import React from 'react';
import { Entity } from 'aframe-react';
import { neighbours, orientation } from '../graph/grid';
import R from 'ramda';

const Light = () =>
  <Entity>
      <Entity position="0 0 -1" light="color: #ff6300; decay: 2.38; distance: 13; intensity: 4.78; type: point;"/>
      <Entity position="0 0 1" light="color: #ff6300; decay: 2.38; distance: 13; intensity: 4.78; type: point;"/>
      <Entity position="1 0 0" light="color: #ff6300; decay: 2.38; distance: 13; intensity: 4.78; type: point;"/>
      <Entity position="-1 0 0" light="color: #ff6300; decay: 2.38; distance: 13; intensity: 4.78; type: point;"/>
      <Entity geometry="primitive: box; height: 0.1; width: 1.2; depth: 0.1" />
      <Entity geometry="primitive: box; height: 0.1; width: 0.1; depth: 1.2" />
  </Entity>;

const shouldPutLight = ({x, y}, board) => {
  // console.log(neighbours(x, y, board));
  //
  // const getVec = orientation => {
  //   switch (orientation) {
  //     case 'N': return '0 0 -1'
  //     case 'S': return '0 0 1'
  //     case 'E': return '1 0 0'
  //     case 'W': return '-1 0 0'
  //   }
  // }
  //
  // const adjFloor = R.compose(
  //   getVec,
  //   floorCell => orientation(x, y, floorCell.x, floorCell.y),
  //   R.find(cell => cell.terrain === ' '),
  //   neighbours(x, y, board)
  // );
  //
  // console.log(adjFloor());

  return Math.random() > 0.9;
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
    shouldPutLight(cell, board) ? <Light /> : null
  }
</Entity>;




// obj-model="obj: url(/data/pillar.obj); mtl: url(/data/pillar.mtl)"
