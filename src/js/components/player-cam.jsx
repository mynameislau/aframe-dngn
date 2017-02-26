import {Entity} from 'aframe-react';
import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  playerPos: state.geo.playerPos
});

const render = props => (
    <Entity
    camera
    position={`${props.playerPos.x * 3} 0 ${-props.playerPos.y * 3}`}
    look-controls=""
    wasd-controls="fly: true;"
    {...props}>
      <Entity
      cursor="fuse: false;"
      position="0 0 -1"
      geometry="primitive: ring; radiusInner: 0.02; radiusOuter: 0.03"
      material="color: black; shader: flat">
      </Entity>
    </Entity>
);

export default connect(mapStateToProps)(render);
