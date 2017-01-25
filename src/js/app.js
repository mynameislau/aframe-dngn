// import 'aframe';
import 'aframe-animation-component';
// import 'aframe-text-component';
//import objModel from 'aframe-extras/src/loaders/object-model';
import 'babel-polyfill';
import {Entity, Scene} from 'aframe-react';
import React from 'react';
import ReactDOM from 'react-dom';

import Camera from './components/Camera';
import Text from './components/Text';
import Sky from './components/Sky';
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

store.dispatch(createTerrain(terrain));

class VRScene extends React.Component {
  constructor(props) {
    super(props);
    this.state = {color: 'red'};
  }

  render () {
    return (
      <Provider store={store}>
        <Scene fog="type: exponential; density: 0.1; color: #011">
          <a-assets>
            <a-asset-item id="pillar-obj" src="/data/pillar.obj"></a-asset-item>
            <a-asset-item id="pillar-mtl" src="/data/pillar.mtl"></a-asset-item>
          </a-assets>
          <Camera position="0 0 -1"
          geometry="primitive: ring"
          material="color: red; shader: flat"
          cursor="maxDistance: 5; fuse: false">
          </Camera>
          <Board />
        </Scene>
      </Provider>
    );
  }
}

ReactDOM.render(<VRScene/>, document.querySelector('.scene-container'));
