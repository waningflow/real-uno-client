import React from 'react';
import * as BABYLON from 'babylonjs';
import Scene from 'babylonjs-hook';
import './index.less';

class Game extends React.Component {
  constructor(props) {
    super(props);
  }

  handleSceneReady(scene) {
    const canvas = scene.getEngine().getRenderingCanvas();
    const camera = new BABYLON.ArcRotateCamera(
      'Camera',
      -Math.PI / 2,
      Math.PI / 4,
      13,
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
      { width: 10, height: 0.5, depth: 10 },
      scene
    );
    var tableMaterial = new BABYLON.StandardMaterial('tableMaterial', scene);
    tableMaterial.diffuseTexture = new BABYLON.Texture(
      'http://textures.oss-cn-beijing.aliyuncs.com/uno/albedo.png',
      scene
    );
    table.material = tableMaterial;

    var columns = 14; // 6 columns
    var rows = 8; // 4 rows

    var faceUV = new Array(6);

    for (var i = 0; i < 6; i++) {
      faceUV[i] = new BABYLON.Vector4(0, 0, 0, 0);
    }
    faceUV[4] = new BABYLON.Vector4(1 / columns, 0, 2 / columns, 1 / rows);
    faceUV[5] = new BABYLON.Vector4(2 / columns, 0, 3 / columns, 1 / rows);

    let card = BABYLON.MeshBuilder.CreateBox(
      'card',
      { width: 3, height: 0.001, depth: 2, faceUV },
      scene
    );
    card.position = new BABYLON.Vector3(0, 2, 0);
    var cardMaterial = new BABYLON.StandardMaterial('mat', scene);
    cardMaterial.diffuseTexture = new BABYLON.Texture(
      'http://textures.oss-cn-beijing.aliyuncs.com/uno/UNO_cards_deck.svg',
      scene
    );
    cardMaterial.diffuseTexture.hasAlpha = true;

    card.material = cardMaterial;
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
