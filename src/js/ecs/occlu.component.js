// All three js imports can be found in the threejs github repository
import  '../three/shaders/CopyShader';
import  '../three/postprocessing/EffectComposer';
import '../three/shaders/SSAOShader';
import '../three/postprocessing/RenderPass';
import '../three/postprocessing/ShaderPass';

const {
  MeshDepthMaterial,
  Clock,
  RenderPass,
  ShaderPass,
  EffectComposer,
  RGBADepthPacking,
  NoBlending,
  LinearFilter,
  WebGLRenderTarget,
  SSAOShader
} = THREE;

// returns an object holding a render function and an update function
const createPostprocessing = (renderer, scene, camera, props) => {
  const originalRender = renderer.render.bind(renderer);
  const depthMaterial = new MeshDepthMaterial();
  const pars = { minFilter: LinearFilter, magFilter: LinearFilter };
  const depthRenderTarget = new WebGLRenderTarget(window.innerWidth, window.innerHeight, pars);
  const ssaoPass = new ShaderPass(SSAOShader);

  const effectComposer = new EffectComposer({
    render: originalRender,
    getSize: renderer.getSize.bind(renderer)
  });

  // Setup render pass
  const renderPass = new RenderPass(scene, camera);
  // Setup depth pass
  depthMaterial.depthPacking = RGBADepthPacking;
  depthMaterial.blending = NoBlending;
  // Setup SSAO pass
  ssaoPass.renderToScreen = true;
  //ssaoPass.uniforms[ "tDiffuse" ].value will be set by ShaderPass
  ssaoPass.uniforms['tDepth'].value = depthRenderTarget.texture;
  // Add pass to effect composer
  effectComposer.addPass(renderPass);
  effectComposer.addPass(ssaoPass);

  const resize = () => {
    const { width, height } = renderer.getSize();
    ssaoPass.uniforms.size.value.set(width, height);
  }

  window.addEventListener( 'resize', resize, false );
  resize();

  const clock = new Clock();
  return {
    render: () => {
      scene.overrideMaterial = depthMaterial;
      originalRender(scene, camera, depthRenderTarget, true);
      scene.overrideMaterial = null;
      effectComposer.render(clock.getDelta());
    },
    update: (props) => {
      ssaoPass.uniforms['aoClamp'].value = props.aoClamp;
      ssaoPass.uniforms['lumInfluence'].value = props.lumInfluence;
      ssaoPass.uniforms['cameraNear'].value = props.cameraNear;
      ssaoPass.uniforms['cameraFar'].value = props.cameraFar;
    }
  }
};

AFRAME.registerComponent('occlu', {
  schema: {
    aoClamp: { default: 0.38 }, // aoClamp: { default: 0.5 },
    lumInfluence: { default: 0 },
    cameraNear: { default: 0.08 }, // cameraNear: { default: 0.1 },
    cameraFar: { default: 50 } // cameraFar: { default: 60 }
  },

  init: function () {

    if (this.el.camera) {
      this.initPostprocessing();
    }
    else {
      this.el.addEventListener('camera-set-active', () => this.initPostprocessing());
    }
  },

  update: function () {
    this.postprocessing.update(this.data);
  },

  initPostprocessing: function () {
    this.postprocessing = createPostprocessing(
      this.el.renderer,
      this.el.object3D,
      this.el.camera,
      this.data
    );

    // replace render method
    this.el.renderer.render = this.postprocessing.render;
  }
})
