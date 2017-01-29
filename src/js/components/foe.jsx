import React from 'react';
import { Entity } from 'aframe-react';
import Floor from './floor';

// AFRAME.registerComponent({
//   update
// })

export default () => <Entity>
  <Entity
  material={{
      shader: 'line-dashed',
      tile: '/data/foe.png',
      side: 'single'
  }}
  obj-model="obj: #foe-obj;"
  scale="0.015625 0.015625 0.015625"
  position="0 -0.5 -0.0"
  rotation="0 0 0"
  onClick={() => console.dir(event.currentTarget)}
  >
  </Entity>
  <Floor />
</Entity>;
