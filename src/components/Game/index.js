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
      50,
      BABYLON.Vector3.Zero(),
      scene
    );
    camera.attachControl(canvas, true);
    camera.minZ = 0.1;

    var skybox = BABYLON.Mesh.CreateBox('skyBox', 100.0, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial('skyBox', scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.disableLighting = true;
    skybox.infiniteDistance = true;
    skybox.material = skyboxMaterial;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
      'http://texture.waningflow.com/uno/environment.dds',
      scene
    );
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

    // var columns = 14; // 6 columns
    // var rows = 8; // 4 rows

    // var faceUV = new Array(6);

    // for (var i = 0; i < 6; i++) {
    //   faceUV[i] = new BABYLON.Vector4(i / columns, 0, (i + 1) / columns, 1 / rows);
    // }

    // let card = BABYLON.MeshBuilder.CreateBox(
    //   'card',
    //   { width: 0.6, height: 0.002, depth: 0.4, faceUV },
    //   scene
    // );
    // card.translate(new BABYLON.Vector3(0, 1, 0), 0.5);
    // var cardMaterial = new BABYLON.StandardMaterial('mat', scene);
    // cardMaterial.alpha = 0.5;
    // cardMaterial.diffuseTexture = new BABYLON.Texture(
    //   'http://textures.oss-cn-beijing.aliyuncs.com/uno/UNO_cards_deck.svg',
    //   scene
    // );

    // card.material = cardMaterial;
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
