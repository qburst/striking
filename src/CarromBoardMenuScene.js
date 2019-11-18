/****************************************************************************************
  
    Striking is a simulation of a carrom board play where 2 players can 
    play carrom board (board version) using a browser. 

    Copyright © 2019  QBurst Technologies 

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, version 3 of the License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/gpl-3.0.txt />. 

****************************************************************************************/


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
