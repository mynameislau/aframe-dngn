import React from 'react';
import { Entity } from 'aframe-react';

export default () => <Entity
  material={{
    shader: 'line-dashed',
    tile: '/data/tiles/snake0.png',
    side: 'single'
  }}
  geometry="primitive: box; height: 1; width: 1; depth: 1"
></Entity>;




// obj-model="obj: url(/data/pillar.obj); mtl: url(/data/pillar.mtl)"
