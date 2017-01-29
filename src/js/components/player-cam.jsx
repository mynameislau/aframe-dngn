import {Entity} from 'aframe-react';
import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  playerPos: state.geo.playerPos
});

const render = props => (
    <Entity camera position={`${props.playerPos.x * 3} 0 ${-props.playerPos.y * 3}`} look-controls="" wasd-controls="fly: true;" {...props}/>
);

export default connect(mapStateToProps)(render);
