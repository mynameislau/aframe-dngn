import React from 'react';
import Wall from './wall';
import Floor from './floor';
import { Entity } from 'aframe-react';
import { connect } from 'react-redux';


export default ({cell, clickHandler}) => {
  return <Entity
    position={`${cell.x} 0 -${cell.y}`}
  >
    {cell.terrain === 'B' ? <Wall/> : <Floor clickHandler={() => clickHandler(cell)} />}
  </Entity>;
}
