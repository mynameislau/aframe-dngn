import React from 'react';
import { Entity } from 'aframe-react';
import Floor from './floor';

// AFRAME.registerComponent({
//   update
// })

export default () => {
  console.log('okk');
  return <Entity>
    <Entity
    material={{
        shader: 'line-dashed',
        tile: '/data/worm.png',
        side: 'single'
    }}
    obj-model="obj: #worm-obj;"
    scale="1 1 1"
    position="0 -0.5 -0.0"
    rotation="0 0 0"
    onClick={() => console.dir(event.currentTarget)}
    >
    </Entity>
    <Floor />
  </Entity>;
}
