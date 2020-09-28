import * as BABYLON from 'babylonjs';

export default class Player {
  constructor(props) {
    this.scene = props.scene;
    this.center = props.center || 0;
    this.cards = [];
  }

  async pickCard(card) {
    this.cards.push(card);
    let anim = this.pickCardAnim(card);
    this.arrangeCardAnim();
    return anim.waitAsync();
  }

  pickCardAnim(currentCard) {
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
    return this.scene.beginAnimation(currentCard, 0, 100, false, 3);
  }

  arrangeCardAnim() {
    let arrangeCard = new BABYLON.Animation(
      'pickCardAnimation',
      'position',
      30,
      BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
  }
}
