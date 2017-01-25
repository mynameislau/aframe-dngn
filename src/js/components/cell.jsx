import React from 'react';
import Wall from './wall';
import Pillar from './pillar';
import Floor from './floor';
import { Entity } from 'aframe-react';
import { connect } from 'react-redux';

const getBlock = (terrain) => {
  switch (terrain) {
    case 'B':
      return Wall;
    case 'P':
      return Pillar;
    default:
      return null;
  }
};

export default ({cell, clickHandler}) => {

  const BlockComponent = getBlock(cell.terrain);

  return <Entity
    position={`${cell.x} 0 -${cell.y}`}
  >
    {BlockComponent ? <BlockComponent /> : <Floor clickHandler={() => clickHandler(cell)} />}
  </Entity>;
}
