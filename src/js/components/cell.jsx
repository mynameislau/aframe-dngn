import React from 'react';
import Wall from './wall';
import Pillar from './pillar';
import Floor from './floor';
import Door from './door';
import Foe from './foe';
import Worm from './worm';
import { Entity } from 'aframe-react';
import { connect } from 'react-redux';

const getBlock = (terrain) => {
  switch (terrain) {
    case 'B':
      return Wall;
    case 'P':
      return Pillar;
    case 'D':
      return Door;
    case 'W':
      return Worm;
    case 'F':
      return Foe;
    default:
      return Floor;
  }
};

export default ({cell, clickHandler, board}) => {

  const BlockComponent = getBlock(cell.terrain);

  return <Entity
    position={`${cell.x} 0 -${cell.y}`}
  >
    {BlockComponent ? <BlockComponent board={board} cell={cell} clickHandler={() => clickHandler(cell)}/> : null}
  </Entity>;
}
