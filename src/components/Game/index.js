import React from 'react';
import * as BABYLON from 'babylonjs';
import Scene from 'babylonjs-hook';
import Player from './Player';
import { cards as cardSource, cardids, getRandomCardids } from './cards';
import { getSocketSync, getSocket, setSocketData } from '../../socket';
import './index.less';

const AT = {
  DealCard: 'DealCard',
  ShuffleCard: 'ShuffleCard',
  CutCard: 'CutCard',
};

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.libraryCount = this.props.gameData.libraryCount;
    this.playersInfo = this.parsePlayers();
    this.handleSceneReady = this.handleSceneReady.bind(this);
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
      this.handleActions(actions);
    });
  }

  componentWillUnmount() {
    const socket = getSocketSync();
    socket.off('game_change');
  }

  async handleActions(actions) {
    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      if (action.type === AT.DealCard) {
        const toUserId = action.value.to;
        const toPlayer = this.playersInfo.find((v) => v.userId === toUserId);
        for (let j = 0; j < action.value.count; j++) {
          await toPlayer._player.pickCard(this.cards[this.libraryCount - 1]);
          this.libraryCount -= 1;
        }
      }
    }
  }

  forfrom(startIndex, l, cb) {
    for (let i = 0; i < l; i++) {
      cb(startIndex, i);
      startIndex = (startIndex + 1) % l;
    }
  }

  parsePlayers() {
    const { userInfo, gameData } = this.props;
    const { players } = gameData;
    const currentIndex = players.findIndex((v) => v.userId === userInfo.userId);
    const ps = {
      0: {
        axis: {
          left: '20px',
          bottom: '20px',
        },
        targetDirection: '0',
      },
      1: {
        axis: {
          left: 0,
          top: '50%',
        },
        targetDirection: '1',
      },
      2: {
        axis: {
          left: '20px',
          top: '20px',
        },
        targetDirection: '2',
      },
      3: {
        axis: {
          right: 0,
          top: '50%',
        },
        targetDirection: '3',
      },
    };
    const l = players.length;
    let pos = [];
    switch (l) {
      case 1:
        pos = ['0'];
        break;
      case 2:
        pos = ['0', '2'];
        break;
      case 3:
        pos = ['0', '1', '3'];
        break;
      case 4:
        pos = ['0', '1', '2', '3'];
        break;
      case 5:
        break;
      case 6:
        break;
      case 7:
        break;
      default:
        break;
    }
    let result = [];
    this.forfrom(currentIndex, l, (i, j) => {
      let item = { ...players[i] };
      item.positionIndex = j;
      item.position = ps[pos[j]];
      result.push(item);
    });
    return result;
  }

  handleSceneReady(scene) {
    const { gameData } = this.props;
    const { cardsLibrary, libraryCount } = gameData;
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
    function genCard(cardKey, position, rotation) {
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
      card.position = position;
      card.rotation = rotation;

      card.material = cardMaterial;
      return card;
    }

    // 生成牌库
    for (let i = 0; i < libraryCount; i++) {
      let card = genCard(
        cardsLibrary[libraryCount - i - 1],
        new BABYLON.Vector3(-2, 0.2 + 0.01 * (i + 1), 0),
        new BABYLON.Vector3(0, -Math.PI / 2, 0)
      );
      cards[i] = card;
    }
    this.cards = cards;

    // 生成弃牌库

    const vec3Map1 = {
      0: [0, 2, -5.5],
      1: [0, 2, -5.5],
      2: [0, 2, 5.5],
      3: [0, 2, -5.5],
    };
    const vec3Map2 = {
      0: [0, Math.PI / 2, Math.PI / 2 + Math.PI / 4],
      1: [0, Math.PI / 2, Math.PI / 2 + Math.PI / 4],
      2: [0, -Math.PI / 2, Math.PI / 2 - Math.PI / 4],
      3: [0, Math.PI / 2, Math.PI / 2 + Math.PI / 4],
    };
    // 生成手牌
    this.playersInfo.forEach((v) => {
      v._player = new Player({ scene, targetDirection: v.position.targetDirection });
      if (!v.currentCards || !v.currentCards.length) return;
      v.currentCards.forEach((cv) => {
        let card = genCard(
          cv,
          new BABYLON.Vector3(...vec3Map1[v.position.targetDirection]),
          new BABYLON.Vector3(...vec3Map2[v.position.targetDirection])
        );
        v._player.cards.push(card);
      });
      v._player.arrangeCard();
    });
  }

  render() {
    const { playersInfo } = this;
    // const { players } = this.props.gameData;
    console.log('playersInfo:', playersInfo);
    return (
      <div className="game-container">
        <Scene onSceneReady={this.handleSceneReady} className="game-canvas" />
        {playersInfo.map((player) => {
          return (
            <div
              key={player.userId}
              className="game-player-container"
              style={{ ...player.position.axis }}
            >
              <div
                className="game-player-icon"
                style={{ backgroundImage: `url('${player.avatarUrl}')` }}
              ></div>
              <div className="game-player-name">{player.nickName}</div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default Game;
