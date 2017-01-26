import React from 'react';
import { Entity } from 'aframe-react';

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
    this.material = new THREE.MeshLambertMaterial( { vertexColors: THREE.VertexColors } );
    // this.material = new THREE.LineBasicMaterial(data);
    this.update(data);  // `update()` currently not called after `init`. (#1834)
  }
});


export default () => <Entity
material={{
    shader: 'line-dashed',
    tile: '/data/pillar2.png',
    side: 'single'
}}
obj-model="obj: #pillar2-obj;"
scale="0.03125 0.03125 0.03125"
position="0 -0.5 -0.0"
onClick={() => console.dir(event.currentTarget)}
>
</Entity>;
