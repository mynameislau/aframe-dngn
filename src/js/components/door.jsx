import React from 'react';
import { Entity } from 'aframe-react';
import Floor from './floor';
// AFRAME.registerComponent({
//   update
// })

export default () =>
<Entity>
  <Entity
    material={{
      shader: 'line-dashed',
      tile: '/data/door.png',
      side: 'single'
    }}
    obj-model="obj: #door-obj;"
    scale="0.03125 0.03125 0.03125"
    position="0 -0.5 -0.0"
    rotation="0 90 0"
    onClick={() => console.dir(event.currentTarget)}
    >
  </Entity>
  <Floor />
</Entity>;
