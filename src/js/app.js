// import 'aframe';
import 'aframe-animation-component';
// import 'aframe-text-component';
//import objModel from 'aframe-extras/src/loaders/object-model';
import 'babel-polyfill';
import {Entity, Scene} from 'aframe-react';
import React from 'react';
import ReactDOM from 'react-dom';

import PlayerCam from './components/player-cam';
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
import './ecs/virtualboy.component.js';
import './ecs/occlu.component.js';

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
            <a-asset-item id="pillar3-obj" src="/data/pillar3.obj"></a-asset-item>
            <a-asset-item id="pillar2-obj" src="/data/pillar2.obj"></a-asset-item>
            <a-asset-item id="pillar-obj" src="/data/pillar.obj"></a-asset-item>
            <a-asset-item id="door-obj" src="/data/door.obj"></a-asset-item>
            <a-asset-item id="foe-obj" src="/data/foe.obj"></a-asset-item>
            <a-asset-item id="worm-obj" src="/data/worm.obj"></a-asset-item>
          </a-assets>
          <PlayerCam>
          </PlayerCam>
          <Entity position="0 1 0" light="type: hemisphere; color: #ffb983; groundColor: #525243; intensity: 0.54"/>
          <Board scale="3 3 3" position="0 0 0"/>
        </Scene>
      </Provider>
    );
  }
}

ReactDOM.render(<VRScene/>, document.querySelector('.scene-container'));
