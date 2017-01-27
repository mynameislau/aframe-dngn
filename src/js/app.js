// import 'aframe';
import 'aframe-animation-component';
// import 'aframe-text-component';
//import objModel from 'aframe-extras/src/loaders/object-model';
import 'babel-polyfill';
import {Entity, Scene} from 'aframe-react';
import React from 'react';
import ReactDOM from 'react-dom';


import EffectComposerConstructor from 'three-effectcomposer';
import 'main-shaders/copy.shader';
import 'main-shaders/ssao.shader';

const EffectComposer = EffectComposerConstructor(THREE);

import Camera from './components/Camera';
import Cell from './components/cell';
import terrainStr from '../data/default.dmap';

import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import Board from './components/board';

import { createTerrainFromString } from './utils/terrain-utils';
import reduxSystem from './ecs/redux.system';
import reduxComponent from './ecs/redux.component';
import reduxBindComponent from './ecs/redux-bind.component';
import tileShader from './shaders/tile.shader';

import mainReducer from './redux/main.reducer.js';
import { createTerrain } from './redux/main.actions.js';

const terrain = createTerrainFromString(terrainStr);

const store = createStore(combineReducers({
  geo: mainReducer
}));

// AFRAME.registerComponent('obj-model', objModel);

reduxSystem.register(store);
reduxComponent.register();
reduxBindComponent.register();

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

store.dispatch(createTerrain(terrain));

class VRScene extends React.Component {
  constructor(props) {
    super(props);
    this.state = {color: 'red'};
  }

  render () {
    return (
      <Provider store={store}>
        <Scene occlu fog="type: exponential; density: 0.1; color: #011">
          <a-assets>
            <a-asset-item id="pillar2-obj" src="/data/pillar2.obj"></a-asset-item>
            <a-asset-item id="pillar-obj" src="/data/pillar.obj"></a-asset-item>
          </a-assets>
          <Camera position="0 0 -1"
          geometry="primitive: ring"
          cursor="fuse: false">
          </Camera>
          <Board scale="3 3 3"/>
        </Scene>
      </Provider>
    );
  }
}

ReactDOM.render(<VRScene/>, document.querySelector('.scene-container'));
