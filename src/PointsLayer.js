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

import {CC, CP} from './globals';
import Utils from './objects/Utils';
import Resources from './resource';

const PointsLayer = CC.Layer.extend({
  utils: new Utils(),
  sprite: null,
  player1NameLabel: '',
  player1PointsLabel: '',
  player2NameLabel: '',
  player2PointsLabel: '',
  activePlayerLabel: '',
  activePlayerName: '',
  positionValue: '',
  forceValue: '',
  angleValue: '',

  ctor: function () {
    this._super();


    this.collectedTextP1 = this.utils.createtextLabels('Coins earned', 'iAmRockFont', 25,
     {x: 140, y: 490});
    this.collectedTextP1.setColor(CC.color(206, 11, 11));
    this.addChild(this.collectedTextP1, 5);

    this.collectedTextP2 = this.utils.createtextLabels('Coins earned', 'iAmRockFont', 25,
     {x: 1153, y: 490});
    this.collectedTextP2.setColor(CC.color(206, 11, 11));
    this.addChild(this.collectedTextP2, 5);

    this.totalCoinsTextP1 = this.utils.createtextLabels('Total Coins', 'iAmRockFont', 20,
     {x: 90, y: 250});
    this.addChild(this.totalCoinsTextP1, 5);

    this.totalCoinsTextP2 = this.utils.createtextLabels('Total Coins', 'iAmRockFont', 20,
     {x: 1100, y: 250});
    this.addChild(this.totalCoinsTextP2, 5);

    this.P1total = this.utils.createtextLabels('0', 'iAmRockFont', 30,
     {x: 200, y: 250});
    this.P1total.setColor(CC.color(0, 0, 255));
    this.addChild(this.P1total, 5);

    this.P2total = this.utils.createtextLabels('0', 'iAmRockFont', 30,
     {x: 1200, y: 250});
    this.P2total.setColor(CC.color(0, 0, 255));
    this.addChild(this.P2total, 5);


    this.player1Name = this.utils.createtextLabels('player1', 'makidoFont', 35,
     {x: 90, y: 580});
    this.player1Name.setColor(CC.color(237, 13, 7));
    this.addChild(this.player1Name, 5);

    let player1Coin = this.setEarnedCoins('white', {x: 240, y: 590}, 200);
    player1Coin.setScale(1.2);
    this.addChild(player1Coin, 5);

    this.player2Name = this.utils.createtextLabels('player2', 'makidoFont', 35,
     {x: 1100, y: 580});
    this.player2Name.setColor(CC.color(237, 13, 7));
    this.addChild(this.player2Name, 5);

    let player2Coin = this.setEarnedCoins('black', {x: 1250, y: 590}, 201);
    player2Coin.setScale(1.2);
    this.addChild(player2Coin, 5);

    this.activePlayerName = this.utils.createtextLabels('name', 'makidoFont', 40,
     {x: 1155, y: 85});
    this.activePlayerName.setColor(CC.color(237, 13, 7));
    this.addChild(this.activePlayerName, 5);

    // this.totalCoinsTextP2 = this.utils.createtextLabels('Total Points', 'iAmRockFont', 20,
    //  {x: 120, y: 150});
    // this.addChild(this.totalCoinsTextP2, 5);

    return true;
  },

  setPlayerName: function (name, playerId, p1) {
    if (playerId === p1) {
      this.player1Name.setString(name);
    } else {
      this.player2Name.setString(name);
    }
  },

  setPlayerPoints: function (points, playerId, p1) {
    if (playerId === p1) {
      this.P1total.setString(points);
    } else {
      this.P2total.setString(points);
    }
  },

  setActivePlayer: function (name) {
    this.activePlayerName.setString(name);
  },

  setActiveForce: function (position, force, angle, playerId, p1) {
    if (playerId === p1) {
      this.positionValueP1.setString(position);
      this.forceValueP1.setString(force);
      this.angleValueP1.setString(angle);
    } else {
      this.positionValueP2.setString(position);
      this.forceValueP2.setString(force);
      this.angleValueP2.setString(angle);
    }
  },

  setEarnedCoins: function(color, coinPosition,tagId){
    this.coins = new CC.Sprite(Resources.getCoinColor(color));
    this.coins.setPosition(CP.v(coinPosition.x, coinPosition.y));
    this.coins.setTag(tagId, true);
    this.coins.setScale(0.7);
    return this.coins;
  }
});

export default PointsLayer;
