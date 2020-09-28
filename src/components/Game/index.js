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
    function genCard(num) {
      let faceUV = new Array(6);

      for (let i = 0; i < 6; i++) {
        faceUV[i] = new BABYLON.Vector4(0, 0, 0, 0);
      }
      faceUV[4] = new BABYLON.Vector4(1 / columns, 1 / rows, 0, 0);
      faceUV[5] = new BABYLON.Vector4(2 / columns, 0, 3 / columns, 1 / rows);

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

    for (let i = 0; i < 108; i++) {
      let card = genCard(i + 1);
      cards[i] = card;
    }

    function pickCard(currentCard) {
      let qEase = new BABYLON.QuinticEase();
      qEase.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);

      let pickCardAnimation = new BABYLON.Animation(
        'pickCardAnimation',
        'position',
        30,
        BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );
      let keys = [];
      keys.push({ frame: 0, value: currentCard.position });
      keys.push({ frame: 100, value: new BABYLON.Vector3(0, 2, -5.5) });
      pickCardAnimation.setKeys(keys);
      pickCardAnimation.setEasingFunction(qEase);

      let pickCardAnimation2 = new BABYLON.Animation(
        'pickCardAnimation2',
        'rotation',
        30,
        BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );
      let keys2 = [];
      keys2.push({ frame: 0, value: currentCard.rotation });
      keys2.push({ frame: 10, value: currentCard.rotation });
      keys2.push({
        frame: 100,
        value: new BABYLON.Vector3(0, Math.PI / 2, Math.PI / 2 + Math.PI / 4),
      });
      pickCardAnimation2.setKeys(keys2);
      pickCardAnimation2.setEasingFunction(qEase);

      currentCard.animations.push(pickCardAnimation);
      currentCard.animations.push(pickCardAnimation2);
      return scene.beginAnimation(currentCard, 0, 100, false, 3);
    }
    setTimeout(async () => {
      for (let i = 107; i >= 0; i--) {
        await pickCard(cards[i]).waitAsync();
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
