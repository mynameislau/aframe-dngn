import React from 'react';
import { Entity } from 'aframe-react';
import { connect } from 'react-redux';
import { movePlayer } from '../redux/main.actions';

import R from 'ramda';
import { trace } from '../utils/utils';

import Cell from './cell';

const mapStateToProps = (state) => ({
  playerPos: state.geo.playerPos,
  terrain: state.geo.terrain
});

const mapDispatchToProps = (dispatch) => ({
  cellClick: (cell) => {
    dispatch(movePlayer(cell));
  }
});

//bind <Entity position="0 0 1" redux-bind="counter.number: position.z">

const render = ({terrain, playerPos, cellClick}) => <Entity
position={`${- playerPos.x} 0 ${playerPos.y}`}
scale="1</Entity> 1 1"
>
  {R.compose(
      R.map(cell => <Cell cell={cell} clickHandler={cellClick} key={`${cell.y}x${cell.x}`} />),
      R.unnest
    )(terrain)
  }
  <Entity light="color: orange; decay: 2; distance: 10; intensity: 1; type: point;" position="8 0 -4">
    <Entity geometry="primitive: box; width: 0.1; height: 0.1; depth: 0.1;"/>
  </Entity>
</Entity>

export default connect(mapStateToProps, mapDispatchToProps)(render);
