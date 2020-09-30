import * as BABYLON from 'babylonjs';

export default class Player {
  constructor(props) {
    this.scene = props.scene;
    this.center = props.center || 0;
    this.cards = [];
    this.cardSize = [2, 3, 0.01];
    this.spaceWidth = this.cardSize[0] / 2.5;
    this.totalWidth = 0;
  }

  async pickCard(card) {
    this.cards.push(card);
    await this.pickCardAnim(card);
    await this.arrangeCardAnim();
  }

  async pickCardAnim(currentCard) {
    console.log(this.totalWidth);
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
    keys.push({
      frame: 100,
      value: new BABYLON.Vector3(this.totalWidth / 2 + this.cardSize[0] / 2, 2, -5.5),
    });
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

    this.totalWidth += this.totalWidth ? this.spaceWidth : this.cardSize[0];
    let anim = this.scene.beginDirectAnimation(
      currentCard,
      [pickCardAnimation, pickCardAnimation2],
      0,
      100,
      false,
      5
    );
    await anim.waitAsync();
    currentCard.addRotation(-Math.PI / 64, 0, 0);
  }

  async arrangeCardAnim() {
    const getExpectPositionx = () => {
      let left = -this.totalWidth / 2;
      let res = this.cards.map((v, i) => {
        return left + i * this.spaceWidth + this.cardSize[0] / 2;
      });
      return res;
    };
    let positionx = getExpectPositionx();
    console.log(positionx);
    const ps = this.cards.map(async (card, i) => {
      let arrangeCardAnimation = new BABYLON.Animation(
        'arrangeCardAnimation',
        'position.x',
        30,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );
      let keys = [];
      keys.push({ frame: 0, value: card.position.x });
      keys.push({ frame: 10, value: positionx[i] });
      arrangeCardAnimation.setKeys(keys);
      let anim = this.scene.beginDirectAnimation(card, [arrangeCardAnimation], 0, 10, false, 2);
      await anim.waitAsync();
    });
    await Promise.all(ps);
  }
}
