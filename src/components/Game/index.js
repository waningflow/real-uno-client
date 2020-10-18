import React from 'react';
import * as BABYLON from 'babylonjs';
import Scene from 'babylonjs-hook';
import Player from './Player';
import { cards as cardSource, cardids, getRandomCardids } from './cards';
import { getSocketSync, getSocket, setSocketData } from '../../socket';
import './index.less';

class Game extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.init();
  }

  async init() {
    console.log('player_ready');
    const socket = await getSocket();
    socket.emit('player_ready');
    socket.on('game_change', ({ from, to, actions }) => {
      console.log(from, to, actions);
    });
  }

  componentWillUnmount() {
    const socket = getSocketSync();
    socket.off('game_change');
  }

  handleSceneReady(scene) {
    const canvas = scene.getEngine().getRenderingCanvas();
    const camera = new BABYLON.ArcRotateCamera(
      'Camera',
      -Math.PI / 2,
      Math.PI / 4,
      15,
      BABYLON.Vector3.Zero(),
      scene
    );
    camera.attachControl(canvas, true);
    camera.minZ = 1;

    var light1 = new BABYLON.HemisphericLight('HemiLight', new BABYLON.Vector3(0, 1, 0), scene);
    light1.specular = new BABYLON.Color3(0, 0, 0);
    light1.groundColor = new BABYLON.Color3(0.5, 0.5, 0.5);

    var envTexture = new BABYLON.CubeTexture(
      'http://texture.waningflow.com/uno/environment.dds',
      scene
    );
    scene.createDefaultSkybox(envTexture, true, 1000);

    var table = BABYLON.MeshBuilder.CreateBox(
      'table',
      { width: 10, height: 0.4, depth: 10 },
      scene
    );
    var tableMaterial = new BABYLON.StandardMaterial('tableMaterial', scene);
    tableMaterial.diffuseTexture = new BABYLON.Texture(
      'http://textures.oss-cn-beijing.aliyuncs.com/uno/albedo.png',
      scene
    );
    table.material = tableMaterial;

    let columns = 14; // 6 columns
    let rows = 8; // 4 rows

    let cardMaterial = new BABYLON.StandardMaterial('mat', scene);
    cardMaterial.diffuseTexture = new BABYLON.Texture(
      'http://textures.oss-cn-beijing.aliyuncs.com/uno/UNO_cards_alpha.png',
      scene
    );
    cardMaterial.diffuseTexture.hasAlpha = true;

    let cards = [];
    function genCard(num, cardKey) {
      const {
        axis: { x, y },
      } = cardSource[cardKey];
      // console.log(x, y);
      let faceUV = new Array(6);

      for (let i = 0; i < 6; i++) {
        faceUV[i] = new BABYLON.Vector4(0, 0, 0, 0);
      }
      faceUV[4] = new BABYLON.Vector4(1 / columns, 1 / rows, 0, 0);
      faceUV[5] = new BABYLON.Vector4(x / columns, y / rows, (x + 1) / columns, (y + 1) / rows);

      let card = BABYLON.MeshBuilder.CreateBox(
        'card',
        { width: 3, height: 0.01, depth: 2, faceUV },
        scene
      );
      card.position = new BABYLON.Vector3(-2, 0.2 + 0.01 * num, 0);
      card.rotation.y = -Math.PI / 2;

      card.material = cardMaterial;
      return card;
    }

    // console.log(cardSource);
    const currentCardids = getRandomCardids();
    for (let i = 0; i < currentCardids.length; i++) {
      let card = genCard(i + 1, currentCardids[i]);
      cards[i] = card;
    }
    let cardPoolSize = currentCardids.length;

    let p1 = new Player({ scene });
    setTimeout(async () => {
      for (let i = cardPoolSize - 1; i >= cardPoolSize - 7; i--) {
        // console.log(cardSource[currentCardids[i]]);
        await p1.pickCard(cards[i]);
      }
    }, 1000);
  }

  render() {
    return (
      <div className="game-container">
        <Scene onSceneReady={this.handleSceneReady} className="game-canvas" />
      </div>
    );
  }
}

export default Game;
