import  '../three/shaders/CopyShader';
import  '../three/postprocessing/EffectComposer';
import '../three/shaders/FilmShader';
import '../three/postprocessing/FilmPass';
import '../three/postprocessing/RenderPass';
import '../three/postprocessing/ShaderPass';
import '../three/shaders/VignetteShader';

const { VignetteShader, FilmPass, Clock, RenderPass, ShaderPass, EffectComposer } = THREE;

const createRender = (renderer, scene, camera, uniforms, vertexShader, fragmentShader) => {
  const originalRender = renderer.render.bind(renderer);

  const renderPass = new RenderPass(scene, camera);
  // const virtualBoyPass = new ShaderPass({
  //   uniforms,
  //   vertexShader,
  //   fragmentShader
  // });

  VignetteShader.uniforms.offset.value = 1.5;
  VignetteShader.uniforms.darkness.value = 1.2;
  const vignettePass = new ShaderPass(VignetteShader);
  const effectFilm = new FilmPass(0.8, 0.325, 256, false);
  effectFilm.renderToScreen = true;

  const composer = new EffectComposer({
    render: originalRender,
    getSize: renderer.getSize.bind(renderer)
  });

  composer.addPass(renderPass);
  // composer.addPass(virtualBoyPass);
  composer.addPass(vignettePass);
  composer.addPass(effectFilm);

  const clock = new Clock();

  return () => {
    originalRender(scene, camera);
    composer.render(clock.getDelta());
  }
};

AFRAME.registerComponent('virtualboy', {
  init: function () {

    if (this.el.camera) {
      this.replaceRender();
    }
    else {
      this.el.addEventListener('camera-set-active', () => this.becomeVB());
    }
  },

  replaceRender: function () {
    this.el.renderer.render = createRender(
      this.el.renderer,
      this.el.object3D,
      this.el.camera,
      this.uniforms,
      this.vertexShader,
      this.fragmentShader
    );
  }
})
