// import 'aframe';
import 'aframe-animation-component';
// import 'aframe-text-component';
//import objModel from 'aframe-extras/src/loaders/object-model';
import 'babel-polyfill';
import {Entity, Scene} from 'aframe-react';
import React from 'react';
import ReactDOM from 'react-dom';

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

AFRAME.registerComponent('occlu', {
  init: function () {
    console.log(this);
    initPostprocessing(this.object3D, this.camera)
  },

  tick: function () {
    console.log(this.object3D, this.camera);
    debugger;
  //   var timer = performance.now();
	// 			group.rotation.x = timer * 0.0002;
	// 			group.rotation.y = timer * 0.0001;
	// 			if ( postprocessing.enabled ) {
	// 				// Render depth into depthRenderTarget
	// 				scene.overrideMaterial = depthMaterial;
	// 				renderer.render( scene, camera, depthRenderTarget, true );
	// 				// Render renderPass and SSAO shaderPass
	// 				scene.overrideMaterial = null;
	// 				effectComposer.render();
	// 			} else {
	// 				renderer.render( scene, camera );
	// 			}
  }
})

function initPostprocessing(scene, camera) {
				// Setup render pass
				var renderPass = new THREE.RenderPass( scene, camera );
				// Setup depth pass
				depthMaterial = new THREE.MeshDepthMaterial();
				depthMaterial.depthPacking = THREE.RGBADepthPacking;
				depthMaterial.blending = THREE.NoBlending;
				var pars = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter };
				depthRenderTarget = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, pars );
				// Setup SSAO pass
				ssaoPass = new THREE.ShaderPass( THREE.SSAOShader );
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
				effectComposer = new THREE.EffectComposer( renderer );
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
