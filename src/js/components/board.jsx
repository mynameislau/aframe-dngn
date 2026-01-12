import React from 'react';
import { Entity } from 'aframe-react';
import { connect } from 'react-redux';
import { movePlayer } from '../redux/main.actions';

import { trace } from '../utils/utils';

import Cell from './cell';
import PlayerCam from './player-cam';

const mapStateToProps = (state) => ({
  terrain: state.geo.terrain
});

const mapDispatchToProps = (dispatch) => ({
  cellClick: (cell) => {
    dispatch(movePlayer(cell));
  }
});

//bind <Entity position="0 0 1" redux-bind="counter.number: position.z">

const render = ({terrain, cellClick, scale, position, children}) =>
  <Entity
  scale={scale}
  positon={position}
  >
    {terrain?.flat().map(cell =>
      <Cell cell={cell} board={terrain} clickHandler={cellClick} key={`${cell.y}x${cell.x}`} />
    )}
      {/*<Entity light="color: orange; decay: 2; distance: 10; intensity: 1; type: point;" position="8 0 -4">
        <Entity geometry="primitive: box; width: 0.1; height: 0.1; depth: 0.1;"/>
      </Entity>*/
    }
    {
      children
    }
  </Entity>

export default connect(mapStateToProps, mapDispatchToProps)(render);
