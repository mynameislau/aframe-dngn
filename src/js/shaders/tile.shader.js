AFRAME.registerShader('line-dashed', {
  schema: {
    tile: { default: '/data/tiles/dngn/wall/snake0.png' },
  },
  /**
   * `init` used to initialize material. Called once.
   */
  init: function (data) {
    const loader = new THREE.TextureLoader;
    const self = this;
    this.material = new THREE.MeshLambertMaterial();
    loader.load(data.tile, texture => {
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.LinearMipMapLinearFilter;
      // console.log('loaded');
      // this.update(texture);
      self.material.map = texture;
      self.material.needsUpdate = true;
      // // this.material = new THREE.LineBasicMaterial(data);
      // this.update(data);  // `update()` currently not called after `init`. (#1834)
    });
  },
  // update: function (texture) {
  //   console.log(texture);
  // }
});
