import React from 'react';
import { Entity } from 'aframe-react';

export default ({ clickHandler }) => <Entity>
  <Entity  geometry="primitive: plane; height: 1; width: 1;"
    material={{
      side: 'single',
      color: 'grey',
      shader: 'line-dashed',
      tile: '/data/tiles/slime_stone.png'
    }}
    rotation="90 0 0"
    position="0 0.5 0"
    />
    <Entity  geometry="primitive: plane; height: 1; width: 1;"
      material={{
        side: 'single',
        shader: 'line-dashed',
        tile: '/data/tiles/pebble_brown0.png'
      }}
      rotation="-90 0 0"
      position="0 -0.5 0"
      onClick={clickHandler}
    />
</Entity>;
