import React from 'react';
import { Entity } from 'aframe-react';

export default () => <Entity
  geometry="primitive: box; height: 1; width: 1; depth: 1"
  material={{
    shader: 'line-dashed',
    tile: '/data/tiles/snake0.png',
    side: 'single'
  }}
  position="0 0 0"
/>;
