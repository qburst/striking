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
import { throws } from 'assert';
import RoundRect from './RoundRect';
import RectType from './RoundRect';

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

    this.ColorL1 = this.utils.createColor(cc.color(0,54,1), 90, 350, 420, 700);
    this.addChild(this.ColorL1,1);

    this.ColorL2 = this.utils.createColor(cc.color(0,54,1), 1180, 350, 355, 700);
    this.addChild(this.ColorL2,5);

    var firstRoundRect = new RoundRect(250, 200, (CC.color(243, 250, 235)), 1, (CC.color(243, 250, 235)), 7,RectType.Top,{x:180, y:5000});
    firstRoundRect.setPosition(CP.v(30,330));
    this.addChild(firstRoundRect,2);

    
    this.firstCircle = new RoundRect(50, 50, (CC.color(48, 87, 46)), 1.2, (CC.color(48, 87, 46)), 24,RectType.Top,{x:180, y:5000});
    this.firstCircle.setScale(1.0);
    this.firstCircle.setOpacity(100);
    this.addChild(this.firstCircle ,5); 


    var SmallRect1 = new RoundRect(230, 40, (CC.color(255, 247, 214)), 1.2, (CC.color(165, 105, 80)), 6,RectType.Top,{x:180, y:5000});
    SmallRect1.setPosition(CP.v(40,475));
    this.addChild(SmallRect1,5);

    this.Line1 = this.utils.createLine({x1:45,y1:380,x2:265,y2:380}, 0.8, CC.color(157, 96, 73));
    this.addChild(this.Line1, 5);

    var secondRoundRect = new RoundRect(250, 200, (CC.color(243, 250, 235)), 1.2, (CC.color(243, 250, 235)), 7,RectType.Top,{x:180, y:5000});
    secondRoundRect.setPosition(CP.v(1030,330));
    this.addChild(secondRoundRect,5);

    this.secondCircle = new RoundRect(50,50, (CC.color(2, 183, 17)), 0, (CC.color(2, 183, 17)), 24,RectType.Top,{x:180, y:5000});
    this.secondCircle.setScale(1.0);
    this.secondCircle.setOpacity(100);
    this.addChild(this.secondCircle ,5); 
 
    var SmallRect2 = new RoundRect(230, 40, (CC.color(255, 247, 214)), 1.2, (CC.color(101,101,101)), 6,RectType.Top,{x:180, y:5000});
    SmallRect2.setPosition(CP.v(1040,475));
    this.addChild(SmallRect2,5);

    this.Line2 = this.utils.createLine({x1:1045,y1:380,x2:1265,y2:380}, 0.8, CC.color(53, 53, 53));
    this.addChild(this.Line2, 5);

    this.collectedTextP1 = this.utils.createtextLabels('Coins Earned', 'oswaldregular', 20,
     {x: 155, y: 490});
    this.collectedTextP1.setColor(CC.color(136, 80, 55));
    this.addChild(this.collectedTextP1, 5);

    this.collectedTextP2 = this.utils.createtextLabels('Coins Earned', 'oswaldregular', 20,
     {x: 1153, y: 490});
    this.collectedTextP2.setColor(CC.color(53, 53, 53));
    this.addChild(this.collectedTextP2, 6);

    this.totalCoinsTextP1 = this.utils.createtextLabels('Total Coins :', 'oswaldregular', 18,
     {x: 100, y: 350});
     this.totalCoinsTextP1.setColor(CC.color(149,101,78));
    this.addChild(this.totalCoinsTextP1, 5);

    this.LineP1 = this.utils.createLine({x1:30,y1:550,x2:270,y2:550},1.2, CC.color(243,249,235));
    this.addChild(this.LineP1, 5);
  
    this.LineP2 = this.utils.createLine({x1:1030,y1:550,x2:1270,y2:550},1.2,CC.color(243,249,235));
    this.addChild(this.LineP2, 5);

    
   
    this.totalCoinsTextP2 = this.utils.createtextLabels('Total Coins :', 'oswaldregular', 18,
     {x: 1100, y: 350});
     this.totalCoinsTextP2.setColor(CC.color(53, 53, 53));
    this.addChild(this.totalCoinsTextP2, 5);

    this.P1total = this.utils.createtextLabels('0', 'oswaldbold', 18,
     {x: 250, y: 350});
    this.P1total.setColor(CC.color(136,80,55));
    this.addChild(this.P1total, 5);

    this.P2total = this.utils.createtextLabels('0', 'iAmRockFont', 18,
     {x: 1250, y: 350});
    this.P2total.setColor(CC.color(53, 53, 53));
    this.addChild(this.P2total, 5);
    
    this.player1Name = this.utils.createtextLabels('player1', 'oswaldregular', 26,
     {x: 80, y: 600});
    this.player1Name.setColor(CC.color(255,247,214));
    this.addChild(this.player1Name,6);

   
    let player1Coin = this.setEarnedCoins('white', {x: 240, y: 600}, 200);
    player1Coin.setScale(1.3);
    this.addChild(player1Coin, 5);
   
    let P1coin1 = this.setEarnedCoins('green', {x: 60, y: 450}, 180);
    P1coin1.setScale(0.9);
    this.addChild(P1coin1, 5);

    let P1coin2 = this.setEarnedCoins('green', {x: 97, y: 450}, 180);
    P1coin2.setScale(0.9);
    this.addChild(P1coin2, 5);

    let P1coin3 = this.setEarnedCoins('green', {x: 133, y: 450}, 180);
    P1coin3.setScale(0.9);
    this.addChild(P1coin3, 5);

    let P1coin4= this.setEarnedCoins('green', {x: 171, y: 450}, 180);
    P1coin4.setScale(0.9);
    this.addChild(P1coin4, 5);

    let P1coin5 = this.setEarnedCoins('green', {x: 208, y: 450}, 180);
    P1coin5.setScale(0.9);
    this.addChild(P1coin5, 5);

    let P1coin6 = this.setEarnedCoins('green', {x: 245, y: 450}, 180);
    P1coin6.setScale(0.9);
    this.addChild(P1coin6, 5);

    let P1coin7 = this.setEarnedCoins('green', {x: 60, y: 410}, 180);
    P1coin7.setScale(0.9);
    this.addChild(P1coin7, 5);

    let P1coin8 = this.setEarnedCoins('green', {x: 97, y: 410}, 180);
    P1coin8.setScale(0.9);
    this.addChild(P1coin8, 5);

    let P1coin9 = this.setEarnedCoins('green', {x: 133, y: 410}, 180);
    P1coin9.setScale(0.9);
    this.addChild(P1coin9, 5);

    
    this.player2Name = this.utils.createtextLabels('player2', 'oswaldregular', 26,
     {x: 1220, y: 600});
    this.player2Name.setColor(CC.color(255,247,214));
    this.addChild(this.player2Name, 5);

    let player2Coin = this.setEarnedCoins('black', {x: 1060, y: 600}, 201);
    player2Coin.setScale(1.3);
    this.addChild(player2Coin, 5);

    this.activePlayerName = this.utils.createtextLabels('name', 'oswaldregular', 40,
     {x: 1155, y: 85});
    this.activePlayerName.setColor(CC.color(237, 13, 7));
    this.addChild(this.activePlayerName, 5);

    let P2coin1 = this.setEarnedCoins('green', {x:1060, y: 450}, 180);
    P2coin1.setScale(0.9);
    this.addChild(P2coin1, 5);

    let P2coin2 = this.setEarnedCoins('green', {x: 1097, y: 450}, 180);
    P2coin2.setScale(0.9);
    this.addChild(P2coin2, 5);

    let P2coin3 = this.setEarnedCoins('green', {x: 1135, y: 450}, 180);
    P2coin3.setScale(0.9);
    this.addChild(P2coin3, 5);

    let P2coin4= this.setEarnedCoins('green', {x: 1175, y: 450}, 180);
    P2coin4.setScale(0.9);
    this.addChild(P2coin4, 5);

    let P2coin5 = this.setEarnedCoins('green', {x: 1214, y: 450}, 180);
    P2coin5.setScale(0.9);
    this.addChild(P2coin5, 5);

    let P2coin6 = this.setEarnedCoins('green', {x: 1252, y: 450}, 180);
    P2coin6.setScale(0.9);
    this.addChild(P2coin6, 5);

    let P2coin7 = this.setEarnedCoins('green', {x: 1060, y: 410}, 180);
    P2coin7.setScale(0.9);
    this.addChild(P2coin7, 5);

    let P2coin8 = this.setEarnedCoins('green', {x: 1097, y: 410}, 180);
    P2coin8.setScale(0.9);
    this.addChild(P2coin8, 5);

    let P2coin9 = this.setEarnedCoins('green', {x: 1135, y: 410}, 180);
    P2coin9.setScale(0.9);
    this.addChild(P2coin9, 5);

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
    if (name  === 'Player 1'){
      this.LineP1 = this.utils.createLine({x1:30,y1:550,x2:270,y2:550},1.5, CC.color(3,183,17));
      this.addChild(this.LineP1, 5);
      this.LineP2 = this.utils.createLine({x1:1030,y1:550,x2:1270,y2:550},1.5,CC.color(243,250,235));
      this.addChild(this.LineP2, 5);
      this.secondCircle.setPosition(CP.v(214,575));
      this.firstCircle.setPosition(CP.v(1035,575));
    }
    else{
      this.LineP2 = this.utils.createLine({x1:1030,y1:550,x2:1270,y2:550},1.5,CC.color(3, 183, 17));
      this.addChild(this.LineP2, 5);
      this.LineP1 = this.utils.createLine({x1:30,y1:550,x2:270,y2:550},1.5, CC.color(243,250,235));
      this.addChild(this.LineP1, 5);
      this.firstCircle.setPosition(CP.v(214,575));
      this.secondCircle.setPosition(CP.v(1035, 575));
    }
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
