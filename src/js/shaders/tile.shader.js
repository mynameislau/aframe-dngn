AFRAME.registerShader('line-dashed', {
  schema: {
    tile: { default: '/data/tiles/dngn/wall/snake0.png' },
  },
  /**
   * `init` used to initialize material. Called once.
   */
  init: function (data) {
    var textureDirt = THREE.ImageUtils.loadTexture(data.tile);
    textureDirt.magFilter = THREE.NearestFilter;
    textureDirt.minFilter = THREE.LinearMipMapLinearFilter;
    this.material = new THREE.MeshLambertMaterial( { map: textureDirt, ambient: 0xffffff, vertexColors: THREE.VertexColors } );
    // this.material = new THREE.LineBasicMaterial(data);
    this.update(data);  // `update()` currently not called after `init`. (#1834)
  },
  /**
   * `update` used to update the material. Called on initialization and when data updates.
   */
  update: function (data) {
    this.material.dashsize = data.dashsize;
    this.material.linewidth = data.linewidth;
  }
});
