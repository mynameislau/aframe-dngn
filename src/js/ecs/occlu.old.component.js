
import EffectComposerConstructor from 'three-effectcomposer';
import '../main-shaders/copy.shader';
import '../main-shaders/ssao.shader';

const EffectComposer = EffectComposerConstructor(THREE);

var depthMaterial, effectComposer, depthRenderTarget;
var ssaoPass;
var group;
var depthScale = 1.0;
const postprocessing = { enabled : true, renderMode: 0 };

AFRAME.registerComponent('occlu', {
  init: function () {
    initPostprocessing(this.el.object3D, this.el.camera, this.el.renderer)
  },

  tick: function () {
			// Render depth into depthRenderTarget
		this.el.object3D.overrideMaterial = depthMaterial;
		this.el.renderer.render( this.el.object3D, this.el.camera, depthRenderTarget, true );
		// Render renderPass and SSAO shaderPass
		this.el.object3D.overrideMaterial = null;
		effectComposer.render();
  }
})

function initPostprocessing(scene, camera, renderer) {
				// Setup render pass
				var renderPass = new EffectComposer.RenderPass( scene, camera );
				// Setup depth pass
				depthMaterial = new THREE.MeshDepthMaterial();
				depthMaterial.depthPacking = THREE.RGBADepthPacking;
				depthMaterial.blending = THREE.NoBlending;
				var pars = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter };
				depthRenderTarget = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, pars );
				// Setup SSAO pass
				ssaoPass = new EffectComposer.ShaderPass( THREE.SSAOShader );
				ssaoPass.renderToScreen = true;
				//ssaoPass.uniforms[ "tDiffuse" ].value will be set by ShaderPass
				ssaoPass.uniforms[ "tDepth" ].value = depthRenderTarget.texture;
				ssaoPass.uniforms[ 'size' ].value.set( window.innerWidth, window.innerHeight );
				ssaoPass.uniforms[ 'cameraNear' ].value = camera.near;
				ssaoPass.uniforms[ 'cameraFar' ].value = camera.far;
				ssaoPass.uniforms[ 'onlyAO' ].value = ( postprocessing.renderMode == 1 );
				ssaoPass.uniforms[ 'aoClamp' ].value = 0.3;
				ssaoPass.uniforms[ 'lumInfluence' ].value = 0.5;
				// Add pass to effect composer
				effectComposer = new EffectComposer( renderer );
				effectComposer.addPass( renderPass );
				effectComposer.addPass( ssaoPass );
}
