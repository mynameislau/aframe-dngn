import React from 'react';
import { Entity } from 'aframe-react';
import Floor from './floor';

// AFRAME.registerComponent({
//   update
// })


AFRAME.registerShader('super-shade', {
  schema: {
  },
  /**
   * `init` used to initialize material. Called once.
   */
  init: function (data) {
    console.log(this);
    this.material = new THREE.MeshLambertMaterial();
    // this.material = new THREE.LineBasicMaterial(data);
    this.update(data);  // `update()` currently not called after `init`. (#1834)
  }
});


export default () =>
<Entity>
  <Entity
    material={{
      shader: 'line-dashed',
      tile: '/data/pillar3.png'
    }}
    obj-model="obj: #pillar3-obj;"
    position="0 -0.5 -0.0"
    onClick={() => console.dir(event.currentTarget)}
    >
  </Entity>
  <Floor />
</Entity>;
