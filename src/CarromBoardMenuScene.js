import {CC} from './globals';
import Resources from './resource';
import CarromBoardScene from './CarromBoardScene';
import Utils from './objects/Utils';

const CarromBoardMenuLayer = CC.Layer.extend({
  sprite: null,
  utils: new Utils(),
  gameId: null,
  socket: null,
  ctor: function () {
    this._super();
    let size = CC.winSize;
    // Create a label
    this.helloLabel = this.utils.createtextLabels('Carrom Board Game', 38,
     {x: size.width / 2, y: size.height / 2 + 200});
    // add the label as a child to this layer
    this.addChild(this.helloLabel, 5);

    this.sprite = new CC.Sprite(Resources.carromLogo);
    this.sprite.attr({
      x: size.width/2,
      y: size.height/2
    });
    this.addChild(this.sprite, 0);
    CC.director.runScene(new CarromBoardScene());
    return true;
  }
});

const CarromBoardMenuScene = CC.Scene.extend({
  onEnter: function () {
    this._super();
    let layer = new CarromBoardMenuLayer();
    this.addChild(layer);
  }
});

export default CarromBoardMenuScene;
