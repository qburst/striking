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


import {CC, CP, COLLISION_TYPE_COIN_HOLE, COLLISION_TYPE_COIN,
  COLLISION_TYPE_STRICKER_HOLE, COLLISION_TYPE_STRICKER} from './globals';
import Config from './config';
import Resources from './resource';
import Carrom from './objects/Carrom';
import Boundary from './objects/Boundary';
import HoleObject from './objects/HoleObject';
import Player from './objects/Player';
import Utils from './objects/Utils';
import PointsLayer from './PointsLayer';


let gameDetails = {
  'name': 'game4', 'gameKey': '4', 'gameStatus': 'in_progress',
  'player1': {
    'key': 'p41',
    'name': 'Player 1',
    'status': 'connected',
    'points': {
      'total': 0, 'black': 0, 'white': 0, 'red': 0
    },
    'history': [], 'strikeCount': 0, 'invalidStrickeCount': 0
  },
  'player2': {
    'key': 'p42',
    'name': 'Player 2',
    'status': 'connected',
    'points': {
      'total': 0, 'black': 0, 'white': 0, 'red': 0
    },
    'history': [], 'strikeCount': 0, 'invalidStrickeCount': 0
  },
  'lastStrike': '', 'winner': '', 'serverName': 'server2', 'passKey': '1', 'isEnabled': true
};


const CarromBoardLayer = CC.Layer.extend({
  utils: new Utils(),
  space: null,
  size: Config.size,
  coins: [],
  stricker: null,
  pointsLayer: null,
  activePlayer: null,
  gameState: 'initialize',
  strickerOnMove: false,
  addcoinsleftBG: null,
  addcoinsrightBG: null,
  updateCoinsArray: [],
  redCoinStrickCount: null,
  strickerPocketedStrickCount: null,
  coinsGainedInCurrentStrike: false,
  isGameEnd: false,
  newlyAddedCoinsPos: [],
  strickerPostionFixed: false,
  lineLayer: null,
  strickingAngle: 0,
  leftSideSelected: null,
  lineDrawn: null,
  inDragMode: null,
  preventMultipleHit: null,
  forceArrowSprite: null,
  initStrickerPosition: null,
  dummyCarromSprite: null,
  dottedLineLayer: null,

  ctor: function (pointsLayer) {
    this._super();
    this.pointsLayer = pointsLayer;

    this.initPhysics();
    this.initDebugMode();
    this.addBG();
    this.changeGameState(this.gameState);
    this.setStricker();

    // hole - coin collision listener
    this.space.addCollisionHandler(
      COLLISION_TYPE_COIN_HOLE, COLLISION_TYPE_COIN,
      this.coinAndHolesCollisionEvent.bind(this),
      null,
      null,
      null);

    // hole - stricker collision listener
    this.space.addCollisionHandler(
      COLLISION_TYPE_STRICKER_HOLE, COLLISION_TYPE_STRICKER,
      this.coinAndHolesCollisionEvent.bind(this),
      null,
      null,
      null);

    setInterval(this.updateLoop.bind(this), Config.frameRate);


    this.player1 = this.createPlayer(
      gameDetails.player1, Config.player1XValue, 0,
      Config.player1strickerXmin, Config.player1strickerXmax
    );
    this.player2 = this.createPlayer(
      gameDetails.player2, Config.player2XValue, 0,
      Config.player2strickerXmin, Config.player2strickerXmax
    );
    this.player1.playerData.coinType = 'white';
    this.player2.playerData.coinType = 'black';
    this.strikeCount = 1;

    this.player1info = this.player1.getPlayerDetails();
    this.player2info = this.player2.getPlayerDetails();

    this.activePlayer = (this.player1info.id === gameDetails.lastStrike) ?
      this.player2info : this.player1info;

    this.addcoinsleftBG = this.utils.addCollectedCoinsBG({ x: 145, y: 430 });
    this.addcoinsrightBG = this.utils.addCollectedCoinsBG({ x: 1153, y: 430 });
    this.addChild(this.addcoinsleftBG, 0.2);
    this.addChild(this.addcoinsrightBG, 0.2);

    this.setPonitLayer();
    this.addmouseEvents();
    return true;
  },

  addmouseEvents: function () {
    CC.eventManager.addListener({
      event: CC.EventListener.MOUSE,
      onMouseMove: (event)=> {
        this.mouseOnMove(event);
      },
      onMouseUp: (event)=> {
        this.mouseUp(event);
      },
      onMouseDown: (event)=> {
        this.mouseDown(event);
      }
    }, this);
  },

  mouseOnMove: function (event) {
    if (this.forceArrowSprite) {
      this.removeChild(this.forceArrowSprite)
    }
    if (this.dottedLineLayer) {
      this.removeChild(this.dottedLineLayer)
    }

    if (!this.strickerOnMove) {
      if (this.lineDrawn) {
        this.lineDrawn = false;
        this.inDragMode = true;
        this.removeChild(this.lineLayer);
        if (this.dummyCarromSprite) {
          this.stricker.sprite.setOpacity(255);
          this.removeChild(this.dummyCarromSprite);
        }
        this.drawLine(event);
      } else {
        this.inDragMode = false;
        this.moveStrickerSpriteAlongWithMouse(event);
      }
    } else {
      this.inDragMode = false;
      this.removeChild(this.lineLayer);
    }
  },

  mouseDown: function (event) {
    this.removeChild(this.lineLayer);
    if ((event.getLocationX() > this.activePlayer.strickerMinxRange) &&
      (event.getLocationX() < this.activePlayer.strickerMaxRange) &&
      !this.checkInsideTheStricker(event)) {
      this.strickerPostionFixed = false;
    }
    if (this.strickerPostionFixed && !this.strickerOnMove && !this.preventMultipleHit &&
      (this.checkInsideCircle(event) || this.checkInsideTheStricker(event))) {
      this.drawLine(event);
    }
  },

  mouseUp: function (event) {
    this.lineDrawn = false;
    if (this.forceArrowSprite) {
      this.removeChild(this.forceArrowSprite)
    }
    if (this.dottedLineLayer) {
      this.removeChild(this.dottedLineLayer)
    }

    let yPosition = this.utils.clamp(event.getLocationY(), Config.MIN_Y, Config.MAX_Y);

    if ((event.getLocationX() > this.activePlayer.strickerMinxRange) &&
      (event.getLocationX() < this.activePlayer.strickerMaxRange) &&
      !this.inDragMode && !this.strickerOnMove) {
      if (this.circleLayer) {
        this.removeChild(this.circleLayer)
      }

      let isCoinInPosition = this.checkExistenceOfCoinInBaseLine(this.activePlayer.xValue,
        yPosition);

      this.stricker.sprite.setOpacity(255);
      this.dummyCarromSprite.setOpacity(0);
      if (!isCoinInPosition) {
        this.placeStricker(yPosition)
      }

      this.drawCircle();

      this.preventMultipleHit = false;
      this.strickerPostionFixed = true;
    } else if (this.strickerPostionFixed && this.inDragMode && !this.preventMultipleHit) {
      this.removeChild(this.lineLayer);
      this.removeChild(this.dummyCarromSprit);
      if ((this.circleLayer && !this.checkInsideTheStricker(event))) {
        this.removeChild(this.circleLayer)
      }

      let distance = this.getDistance(event);
      if (distance > Config.strickerRadius) {
        this.strickerOnMove = true;
        this.preventMultipleHit = true;
        let force = distance * 100;
        this.applyForceOnStricker(force, this.strickingAngle);
        this.strickingAngle = 0;
      }
    } else if (!((event.getLocationX() > this.activePlayer.strickerMinxRange)
      && (event.getLocationX() < this.activePlayer.strickerMaxRange)) &&
      !this.inDragMode && !this.strickerOnMove) {
      this.strickerPostionFixed = true;
    }
  },

  moveStrickerSpriteAlongWithMouse: function (event) {
    this.stricker.sprite.setOpacity(255);
    if (this.dummyCarromSprite) {
      this.removeChild(this.dummyCarromSprite)
    }

    this.dummyCarromSprite = new CC.Sprite(Resources.stricker);
    let yValue = this.utils.clamp(event.getLocationY(), Config.MIN_Y, Config.MAX_Y);
    this.dummyCarromSprite.setPosition(CP.v(this.activePlayer.xValue, yValue));
    this.dummyCarromSprite.setOpacity(100);
    this.addChild(this.dummyCarromSprite, 18);
  },

  drawLine: function (event) {
    this.lineLayer = new CC.DrawNode();
    this.addChild(this.lineLayer, 10);
    if ((this.stricker.body.p.x - event.getLocationX()) >= 0) {
      this.leftSideSelected = true;
    } else if ((this.stricker.body.p.x - event.getLocationX()) < 0) {
      this.leftSideSelected = false;
    }
    this.strickingAngle = Math.atan((this.stricker.body.p.y - event.getLocationY()) /
      (this.stricker.body.p.x - event.getLocationX())) * (180 / Math.PI);
    if (!this.leftSideSelected && this.strickingAngle <= 0) {
      this.strickingAngle = 180 - Math.abs(this.strickingAngle);
    } else if (!this.leftSideSelected && this.strickingAngle > 0) {
      this.strickingAngle = 180 + Math.abs(this.strickingAngle);
    }
    this.lineDrawn = true;

    let distance = this.getDistance(event);
    this.forceArrowSprite = new CC.Sprite(Resources.forceArrow);
    this.forceArrowSprite.setAnchorPoint(0.5, 0);
    this.forceArrowSprite.setScaleY(distance * 0.0075);
    this.forceArrowSprite.setScaleX(0.13);

    let arrowBasePoint = this.getforceArrowHangingPoint(event);

    this.forceArrowSprite.setPosition(CP.v(arrowBasePoint.x, arrowBasePoint.y));

    this.forceArrowSprite.setRotation(90 - this.strickingAngle);
    this.addChild(this.forceArrowSprite, 10);
    this.addDottedLine(event);
  },

  getforceArrowHangingPoint: function () {
    let slope = Math.tan(this.strickingAngle * (Math.PI / 180));
    let x = !this.leftSideSelected ? (this.stricker.body.p.x +
      (100 / Math.sqrt(1 + Math.pow(slope, 2)))) : (this.stricker.body.p.x -
        (100 / Math.sqrt(1 + Math.pow(slope, 2))));
    let y = !this.leftSideSelected ? (this.stricker.body.p.y +
      ((100 * slope) / Math.sqrt(1 + Math.pow(slope, 2)))) : (this.stricker.body.p.y -
        ((100 * slope) / Math.sqrt(1 + Math.pow(slope, 2))));
    return {x: x, y: y};
  },

  addDottedLine: function () {
    this.dottedLineLayer = new CC.Sprite(Resources.dottedLine);
    let slope = Math.tan(this.strickingAngle * (Math.PI / 180));
    let x = this.leftSideSelected ? (this.stricker.body.p.x +
      (100 / Math.sqrt(1 + Math.pow(slope, 2)))) : (this.stricker.body.p.x -
        (100 / Math.sqrt(1 + Math.pow(slope, 2))));
    let y = this.leftSideSelected ? (this.stricker.body.p.y +
      ((100 * slope) / Math.sqrt(1 + Math.pow(slope, 2)))) : (this.stricker.body.p.y -
        ((100 * slope) / Math.sqrt(1 + Math.pow(slope, 2))));
    this.dottedLineLayer.setAnchorPoint(0.5, 0);
    this.dottedLineLayer.setPosition(CC.p(x, y));
    this.dottedLineLayer.setRotation(90 - this.strickingAngle);
    this.dottedLineLayer.setScaleY(2);
    this.addChild(this.dottedLineLayer, 25);
  },


  checkInsideCircle: function (event) {
    let distance = Math.sqrt(Math.pow((event.getLocationX() -
      this.stricker.body.p.x), 2) + Math.pow((event.getLocationY() -
        this.stricker.body.p.y), 2));
    if (distance < Config.strickerRangeRadius) {
      return true;
    }
    return false;

  },

  getDistance: function (event) {
    let distance = Math.sqrt(Math.pow((event.getLocationX() -
      this.stricker.body.p.x), 2) + Math.pow((event.getLocationY() -
        this.stricker.body.p.y), 2));
    distance = this.checkInsideCircle(event) ? distance : Config.strickerRangeRadius;
    return distance;
  },

  setStricker: function () {
    this.preventMultipleHit = false;
    this.strickerPostionFixed = true;
    this.drawCircle();
  },

  drawCircle: function () {
    this.circleLayer = new CC.Sprite(Resources.circleSprite);
    this.circleLayer.setScale(0.37);
    this.circleLayer.setPosition(CC.p(this.stricker.body.p.x, this.stricker.body.p.y));
    this.circleLayer.setOpacity(100);
    this.addChild(this.circleLayer, 12);
  },

  setPonitLayer: function () {
    this.pointsLayer.setPlayerName(this.player1info.name,
      this.player1info.id, this.player1info.id);
    this.pointsLayer.setPlayerName(this.player2info.name,
      this.player2info.id, this.player1info.id);
    this.pointsLayer.setActivePlayer(this.activePlayer.name, this.activePlayer.id);
    this.pointsLayer.setPlayerPoints(this.player1info.points,
      this.player1info.id, this.player1info.id);
    this.pointsLayer.setPlayerPoints(this.player2info.points,
      this.player2info.id, this.player1info.id);

    // to add coins earned in point layer
    if (this.player1info.whiteCoinCount !== 3) {
      let whiteCoin = this.player1info.whiteCoinCount;

      while (whiteCoin > 3) {
        let coinPosition = 13 + 37 * whiteCoin;
        let whiteCoin1 = this.pointsLayer.setEarnedCoins('white',
          { x: coinPosition, y: 450 }, whiteCoin);
        this.addChild(whiteCoin1, 5);
        whiteCoin = whiteCoin - 1;
      }
    }

    if (this.player1info.redCoinCount !== 0) {
      let redCoin1 = this.pointsLayer.setEarnedCoins('red', { x: 250, y: 440 }, 100);
      this.addChild(redCoin1, 5);
    }

    if (this.player2info.blackCoinCount !== 3) {
      let blackCoin1 = this.player2info.blackCoinCount;
      while (blackCoin1 > 3) {
        let coinPosition = 1020 + 38 * blackCoin1;
        let blackCoin2 = this.pointsLayer.setEarnedCoins('black',
          { x: coinPosition, y: 400 }, blackCoin1 + 10);
        this.addChild(blackCoin2, 5);
        blackCoin1 = blackCoin1 - 1;
      }
    }

    if (this.player2info.redCoinCount !== 0) {
      let redCoin2 = this.pointsLayer.setEarnedCoins('red', { x: 1450, y: 430 }, 100);
      this.addChild(redCoin2, 5);
    }
  },

  /**
    * Initialize physics space, enable debugmode.
    * @returns {void}
  */
  initPhysics: function () {
    this.space = new CP.Space();
    this.space.gravity = CP.v(0, 0);
    this.space.damping = 0.325;
    this.space.sleepTimeThreshold = 1;
    this.space.idleSpeedThreshold = 2;
    this.scheduleUpdate();
  },

  /**
    * Enable debugmode.
    * @returns {void}
  */
  initDebugMode: function () {
    let phDebugNode = CC.PhysicsDebugNode.create(this.space);
    phDebugNode.visible = false;
    this.addChild(phDebugNode, 25);
  },
  /**
    * Add carrom board to the scene.
    * @returns {void}
  */
  addBoardSprite: function () {
    let carromBoardSprite = new CC.Sprite(Resources.carromBG);
    carromBoardSprite.setPosition(CP.v(this.size.width /2, this.size.height /2));
    this.addChild(carromBoardSprite, 0.2);
  },

  addBG: function () {
    let colorLayer = new CC.Sprite(Resources.blueBG);
    colorLayer.setPosition(CP.v(this.size.width / 2, this.size.height / 2));
    this.addChild(colorLayer, 0.2);
  },


  changeGameState: function (state) {
    switch (state) {
    case 'initialize': this.initilizeCoinsandWalls();
      break;
    case 'start': this.startGame();
      break;
    case 'wait': this.waitLogic();
      break;
    case 'end': this.gameEndLogic();
      break;
    default: break;
    }
  },

  /**
    * game state initialize logic.Add board, coins, walls.
    * @returns {void}
  */
  initilizeCoinsandWalls: function () {
    this.addBoardSprite();

    let coinPositions = this.getRandomCoinPosition(Config.coinPositions);
    for (let i = 0; i < coinPositions.length; i = i + 1) {
      this.addCoin(coinPositions[i].type, coinPositions[i].x,
        coinPositions[i].y, coinPositions[i].id);
    }

    this.addBoundary(Config.boundaryLength, Config.boundaryWidth,
      CP.v(this.size.width / 2, -120));
    this.addBoundary(Config.boundaryLength, Config.boundaryWidth,
      CP.v(this.size.width / 2, 800));
    this.addBoundary(Config.boundaryWidth, Config.boundaryLength,
      CP.v(190, this.size.height / 2));
    this.addBoundary(Config.boundaryWidth, Config.boundaryLength,
      CP.v(1110, this.size.height / 2));

    this.addHoles(Config.holeForCoinRadius,
      { x: Config.holeCenterXmin, y: Config.holeCenterYmin }
    );
    this.addHoles(Config.holeForCoinRadius,
      { x: Config.holeCenterXmin, y: Config.holeCenterYmax }
    );
    this.addHoles(Config.holeForCoinRadius,
      { x: Config.holeCenterXmax, y: Config.holeCenterYmin }
    );
    this.addHoles(Config.holeForCoinRadius,
      { x: Config.holeCenterXmax, y: Config.holeCenterYmax }
    );

    this.addHoles(Config.holeForStrickerRadius,
      { x: Config.holeCenterXmin, y: Config.holeCenterYmin }
    );
    this.addHoles(Config.holeForStrickerRadius,
      { x: Config.holeCenterXmin, y: Config.holeCenterYmax }
    );
    this.addHoles(Config.holeForStrickerRadius,
      { x: Config.holeCenterXmax, y: Config.holeCenterYmin }
    );
    this.addHoles(Config.holeForStrickerRadius,
      { x: Config.holeCenterXmax, y: Config.holeCenterYmax }
    );
  },

   // to rotate initial coin position in a random angle while restart

  getRandomCoinPosition: function (coinsArray) {
    let angle = Math.random() * (6.28 - 0.1) + 0.1;
    for (let i = 0; i <= coinsArray.length - 2; i = i + 1) {
      let x = coinsArray[i].x - 650;
      let y = coinsArray[i].y - 340;
      let x1 = ((x * Math.cos(angle)) - (y * Math.sin(angle)));
      let y1 = ((y * Math.cos(angle)) + (x * Math.sin(angle)));
      coinsArray[i].x = x1 + 650;
      coinsArray[i].y = y1 + 340;
    }
    return coinsArray;
  },

  /**
    * The Game loop. Business rules implemented here.
    * @returns {void}
  */
  updateLoop: function () {
    if (!this.isGameEnd) {
      this.space.step(1/60);
      if (this.stricker) {
        this.stricker.update();
      }
      for (let i = 0; i < this.coins.length; i = i + 1) {
        this.coins[i].update(1 / 60);

        // to remove sprite
        if (this.coins && this.coins[i].body.isRemove) {
          this.onCoinPocketed(i);
        }
      }

      if (this.stricker && this.stricker.body.isRemove) {
        this.placeStrikerOutside();
      }

      if (this.stricker && this.stricker.body.isSleeping() &&
        this.coins.every(this.checkCoinsInSleep.bind(this))
        && this.strickerOnMove) {
        this.boardInsleepMode()
      }

    }
  },

  checkCoinsInSleep: function (coin) {
    return coin.body.isSleeping() ? true : false;
  },

  boardInsleepMode: function () {
    this.strickerOnMove = false;

    // striker on hole
    if (this.stricker && this.stricker.body.isRemove) {
      this.onStrikerPocketed();
    }
    let winnerData = this.checkGameEnd();
    if (winnerData && winnerData.isGameEnd) {
      let carromBoardSprite = new CC.Sprite(Resources.winsBG);
      carromBoardSprite.setPosition(CP.v(this.size.width/2, this.size.height/2));
      this.addChild(carromBoardSprite, 40);

      let playerName = this.utils.createtextLabels(winnerData.name +
        '\n wins', 'makidoFont', 40,
        { x: this.size.width / 2, y: this.size.height / 2 });
      playerName.setColor(CC.color(225, 225, 225));
      this.addChild(playerName, 40);
      let animation = CC.ScaleBy.create(3, 1.5, 1.5);
      playerName.runAction(animation);
      carromBoardSprite.runAction(animation);
      this.isGameEnd = true;
    } else {
        // for strike count
      let player = this.getPlayer();
      if (!player.playerData.redCoinInHole) {
        this.changePlayer();
      } else if (!this.coinsGainedInCurrentStrike &&
        (this.redCoinStrickCount === this.strikeCount - 1)) {
        // Queen should cover a coin
        this.addCenterAlignedCoin({ type: 'red', id: 'r1' });
        player.setRedCoinStatus(false);
        this.changePlayer();
      } else {
        this.resetStricker();
      }

      player.incrementStrikeCount();
      this.incrementStrikeCount();

      this.newlyAddedCoinsPos = [];
    }
  },

  incrementStrikeCount() {
    this.strikeCount = this.strikeCount + 1;
  },


  resetStricker: function () {
    this.placeStrickerOnStrickeRange(this.activePlayer.xValue, Config.MIN_Y);
    this.placeStricker(this.initStrickerPosition);
    this.setStricker();
  },

  checkGameEnd: function () {
    let winner = null;
    if (this.player1.playerData.whiteCoinCount === 9 ||
      this.player2.playerData.blackCoinCount === 9) {
      winner = this.player1.playerData.whiteCoinCount === 9 ?
        this.player1.playerData : this.player2.playerData;
    }
    if (winner) {
      return { isGameEnd: true, name: winner.name };
    }
    return { isGameEnd: false };

  },

  changePlayer: function () {
    if (!this.coinsGainedInCurrentStrike) {
      if (this.activePlayer.id === this.player1info.id) {
        this.activePlayer = this.player2info;
        console.log('==> ' + this.activePlayer.name + "'s Turn");
      } else {
        this.activePlayer = this.player1info;
        console.log('==> ' + this.activePlayer.name + "'s Turn");
      }
    }
    this.coinsGainedInCurrentStrike = false;
    this.pointsLayer.setActivePlayer(this.activePlayer.name, this.activePlayer.id);
    this.resetStricker();
  },

  placeStrickerOnStrickeRange: function (x, y) {
    let isCoins = this.checkExistenceOfCoinInBaseLine(x, y);
    this.initStrickerPosition = y;
    if (isCoins) {
      let z = y + 1;
      if (z <= Config.MAX_Y) {
        this.placeStrickerOnStrickeRange(x, z);
      } else {
        this.changePlayer();
      }
    }
    return;
  },

  /**
    * cocos update loop
    * @param {number} dt The value.
    * @returns {void}
  */
  update: function (dt) {
    console.log(dt)
  },

  /**
    * create carrom board boundary.
    * @param {number} width The width.
    * @param {number} height The height.
    * @param {number} position The position.
    * @returns {void}
  */
  addBoundary: function (width, height, position) {
    this.boundary = new Boundary(this.space, {
      width: width,
      height: height,
      position: position,
      type: 'static'
    });
  },

  addHoles: function (radius, position) {
    let options = {};
    options.radius = radius;
    options.position = CP.v(position.x, position.y);
    let holeObject = {};
    holeObject = new HoleObject(this.space, {
      radius: options.radius,
      position: options.position,
      type: 'static'
    });
    holeObject.shape.setSensor(true);
  },

  /**
    * create coins and striker and add to scene.
    * @param {string} type The type.
    * @param {number} x The x position.
    * @param {number} y The y position.
    * @param {string} id The id.
    * @returns {void}
  */
  addCoin: function (type, x, y, id) {
    let r;
    let m;
    if (type === 'stricker') {
      r = Config.strickerRadius;
      m = 7;
    } else {
      r = Config.coinRadius;
      m = 5.25;
    }

    let coinObject = {};
    let sprite = new CC.Sprite(Resources.getCoinColor(type));
    coinObject = new Carrom(this.space, {
      radius: r,
      position: CP.v(x, y),
      mass: m,
      color: type
    }, sprite);
    coinObject.type = type;
    coinObject.id = id;
    this.addChild(sprite, 20);
    if (type === 'stricker') {
      this.stricker = coinObject;
    } else {
      this.coins.push(coinObject);
    }
  },

  createPlayer: function (playerDetails, x, y, strickerMinX, strickerMaxX) {
    let player = new Player(playerDetails.key, playerDetails.name, x, y,
      strickerMinX, strickerMaxX);
    player.playerData.points = playerDetails.points.total;
    player.playerData.blackCoinCount = playerDetails.points.black;
    player.playerData.whiteCoinCount = playerDetails.points.white;
    player.playerData.redCoinCount = playerDetails.points.red;
    player.playerData.history = playerDetails.history;
    let htryLen = playerDetails.history.length;
    player.playerData.strikeCount = (htryLen > 0) ?
      playerDetails.history[htryLen - 1].strikeCount + 1 : 1;
    return player;
  },

  placeStricker: function (verticalOffset) {
    this.stricker.body.setVel(CP.v(0, 0));
    this.stricker.body.activate();
    this.stricker.body.p.x = this.activePlayer.xValue;
    this.stricker.body.p.y = verticalOffset;
  },

  applyForceOnStricker: function (force, angle) {
    // commenting to avoid the unused error
    // let newAngle = this.activePlayer.id === this.player1info.id ? angle-90 : angle + 90;
    let impulse = CP.v(force * Math.cos(angle * Math.PI / 180),
      force * Math.sin(angle * Math.PI / 180));


    this.stricker.body.applyImpulse(impulse, CP.v(0, 0));
  },

  coinAndHolesCollisionEvent: function (arbiter) {
    arbiter.a.body.isRemove = true;
    return true;
  },

  onCoinPocketed: function (i, playerId) {
    this.removeChild(this.coins[i].sprite);
    this.space.removeShape(this.coins[i].shape);
    this.space.removeBody(this.coins[i].body);
    this.coins[i].body.isRemove = false;
    if (playerId) {
      this.coinInHole(this.coins[i], playerId);
    } else {
      this.coinInHole(this.coins[i]);
    }
    this.coins.splice(i, 1);
  },

  /*
    * handling coins in hole
    **/

  coinInHole: function (coin, playerId) {
    // red in hole true add poins for red and last coin
    let player = null;

    if (playerId) {
      player = (playerId === this.player1info.id) ? this.player1 : this.player2;
    } else {
      player = this.getPlayer();
    }

    if (coin.type === 'red') {
      player.setRedCoinStatus(true);
      this.redCoinStrickCount = this.strikeCount;
    } else if (player.playerData.coinType === coin.type) {
      if (player.playerData.redCoinInHole) {
        let redCoin = {
          id: 'r1',
          type: 'red'
        };
        player.addCount('red');
        player.addhistory(redCoin, this.strikeCount);
        player.setRedCoinStatus(false);
        if (player.playerData.id === this.player1info.id) {
          this.addRedCoinInPointLayer(1)
        } else {
          this.addRedCoinInPointLayer(2)
        }

        this.pointsLayer.setPlayerPoints(player.getPoints(), player.playerData.id,
          this.player1info.id);
      }
      if ((this.player1.playerData.redCoinCount === 0 &&
        this.player2.playerData.redCoinCount === 0)
        && (player.playerData.whiteCoinCount === 8 ||
          player.playerData.blackCoinCount === 8)) {
        this.addCenterAlignedCoin(coin);
      } else {
        this.coinsGainedInCurrentStrike = true;
        player.addCount(coin.type);
        this.pointsLayer.setPlayerPoints(player.getPoints(), 
          player.playerData.id, this.player1info.id);
        player.addhistory(coin, this.strikeCount);
        if (player.playerData.id === this.player1info.id) {
          this.addWhiteCoinInPointLayer(this.player1.playerData.whiteCoinCount)
        } else {
          this.addBlackCoinInPointLayer(this.player2.playerData.blackCoinCount);
        }

      }
    } else if (coin.type === 'white') {
      if (this.player1.playerData.redCoinCount === 0 &&
        this.player2.playerData.redCoinCount === 0 &&
        this.player1.playerData.whiteCoinCount === 8) {
        this.addCenterAlignedCoin(coin);
      } else {
        this.player1.addCount(coin.type);
        this.pointsLayer.setPlayerPoints(this.player1.getPoints(),
          this.player1.playerData.id, this.player1info.id);
        this.player1.addhistory(coin, this.strikeCount);
        this.addWhiteCoinInPointLayer(this.player1.playerData.whiteCoinCount);
      }

    } else {
      if (this.player1.playerData.redCoinCount === 0 &&
        this.player2.playerData.redCoinCount === 0 &&
        this.player2.playerData.blackCoinCount === 8) {
        this.addCenterAlignedCoin(coin);
      } else {
        this.player2.addCount(coin.type);
        this.pointsLayer.setPlayerPoints(this.player2.getPoints(),
          this.player2.playerData.id, this.player1info.id);
        this.player2.addhistory(coin, this.strikeCount);
        this.addBlackCoinInPointLayer(this.player2.playerData.blackCoinCount);
      }
    }
  },

  addWhiteCoinInPointLayer: function (whiteCoinCount) {
    if(whiteCoinCount < 7 ){
      let coinPosition = 23 + (37 * whiteCoinCount);
      let whiteCoin = this.pointsLayer.setEarnedCoins('white',
        { x: coinPosition, y: 450 }, whiteCoinCount
      );
      this.addChild(whiteCoin, 5);
    }
    else{
      let coinPosition = 60 + (37 * (whiteCoinCount - 7));
      let whiteCoin = this.pointsLayer.setEarnedCoins('white',
        { x: coinPosition, y: 410 }, whiteCoinCount
      );
      this.addChild(whiteCoin, 5);
    }
  },

  addBlackCoinInPointLayer: function (blackCoinCount) {
    if (blackCoinCount < 7 ){

      let coinPosition = 1022 + (38 * blackCoinCount);
      let blackCoin = this.pointsLayer.setEarnedCoins('black',
        { x: coinPosition, y: 450 }, blackCoinCount + 10
      );
      this.addChild(blackCoin, 5);
    }
    else{
      let coinPosition = 1057 + (38 * (blackCoinCount - 7));
      let blackCoin = this.pointsLayer.setEarnedCoins('black',
        { x: coinPosition, y: 410 }, blackCoinCount + 10
      );
      this.addChild(blackCoin, 5);
    }
  },
  addRedCoinInPointLayer: function (player) {
    let xPosition = player === 1 ? 170 : 1167;
    let redCoin = this.pointsLayer.setEarnedCoins('red', { x: xPosition, y: 410 }, 100);
    this.addChild(redCoin, 5);
  },

  /*
  * Add a coin to center or other near space
  **/
  addCenterAlignedCoin: function (coin) {
    let coinObject = {};

    let sprite = new CC.Sprite(Resources.getCoinColor(coin.type));
    let point = this.checkExistenceOfCoinInCenter(this.size.width / 2,
      this.size.height / 2, 1, 0
    );

    coinObject = new Carrom(this.space, {
      radius: Config.coinRadius,
      position: CP.v(point.x, point.y),
      mass: 5.25,
      color: coin.type
    }, sprite);
    coinObject.type = coin.type;
    coinObject.id = coin.id;
    this.addChild(sprite, 20);
    this.coins.push(coinObject);
  },

  checkExistenceOfCoinInBaseLine(x, y) {
    let adjacentCoins = this.checkExistenceOfCoin(x, y, Config.strickerRadius);
    if (adjacentCoins && adjacentCoins.shape.r !== Config.strickerRadius) {
      return true;
    }
    return false;

  },

  checkInsideTheStricker(event) {
    let aboveStricker = this.checkExistenceOfCoin(event.getLocationX(),
      event.getLocationY(), 1);
    if (aboveStricker && aboveStricker.shape.r === Config.strickerRadius) {
      return true;
    }
    return false;

  },

  isInNewlyAddedCoinsPos: function (x, y) {
    for (let i = this.newlyAddedCoinsPos.length - 1; i >= 0; i = i - 1) {
      let position = this.newlyAddedCoinsPos[i];
      if (position.x === x && position.y === y) {
        return true;
      }
    }
    return false;
  },

  /*
  * find free space to add new coin
  */
  checkExistenceOfCoinInCenter: function (x, y, radiusFactor, angle) {
    let adjacentCoins = this.checkExistenceOfCoin(x, y, Config.coinRadius);
    if (adjacentCoins || this.isInNewlyAddedCoinsPos(x, y)) {
      let newPoint = this.calculateNewPoint(radiusFactor, angle);
      let newAngle = angle + 60;
      let radisFctr = radiusFactor;
      if (newAngle >= 360) {
        newAngle = 0;
        radisFctr = radisFctr + 1;
      }
      return this.checkExistenceOfCoinInCenter(newPoint.x, newPoint.y, radisFctr, newAngle);
    }
    let point = {
      x: x,
      y: y
    };
    this.newlyAddedCoinsPos.push(point);
    return point;

  },

  /*
  * Check existance of coin in specified co-ordinate
  **/
  checkExistenceOfCoin: function (x, y, r) {
    let adjacentCoins = this.space.nearestPointQueryNearest(
      CP.v(x, y),
      r,
      -1,
      '0');
    return adjacentCoins;
  },

  calculateNewPoint: function (radiusFactor, angle) {
    let x = this.size.width / 2 + (((Config.coinRadius * 2) * radiusFactor) + 1) *
      Math.cos(angle * Math.PI / 180);
    let y = this.size.height / 2 + (((Config.coinRadius * 2) * radiusFactor) + 1) *
      Math.sin(angle * Math.PI / 180);
    return {
      x: x,
      y: y
    };
  },

  // business rules for striker in hole
  onStrikerPocketed: function () {
    this.stricker.body.setVel(CP.v(0, 0));
    let player = this.getPlayer();
    let coinWithStriker = '';

    this.strickerPocketedStrickCount = this.strikeCount;

    // for striker with coins are pocketed
    do {
      coinWithStriker = player.coinsPocketedWithStriker(this.strickerPocketedStrickCount);
      if (coinWithStriker) {
        // to remove coins earned in point layer
        this.removeCoinsInPointLayer(player, coinWithStriker);
      }
    } while (coinWithStriker);

    // for reduce points and recreate coin
    let coin = player.updateCoins();
    if (coin && !this.coinsGainedInCurrentStrike && !player.playerData.redCoinInHole) {
      // to remove coins earned in point layer
      this.removeCoinsInPointLayer(player, coin);
    }

    // for last pocketed coin is red
    if (player.playerData.redCoinInHole) {
      this.addCenterAlignedCoin({ type: 'red', id: 'r1'});
      player.setRedCoinStatus(false);
    }
    this.coinsGainedInCurrentStrike = false;
    this.stricker.body.isRemove = false;
  },

  removeCoinsInPointLayer: function (player, coin) {
    if (player.playerData.id === this.player1info.id) {
      this.removeChildByTag(player.playerData.whiteCoinCount, true);
      if (coin.type === 'red') {
        this.removeChildByTag(100, true);
      }
    } else {
      this.removeChildByTag(player.playerData.blackCoinCount + 10, true);
      if (coin.type === 'red') {
        this.removeChildByTag(100, true);
      }
    }
    player.removePoints(coin.type);
    this.pointsLayer.setPlayerPoints(player.getPoints(),
      player.playerData.id, this.player1info.id);
    this.addCenterAlignedCoin(coin);
  },

  placeStrikerOutside: function () {
    this.stricker.body.p.x = 0;
    this.stricker.body.p.y = 0;
  },

  getPlayer: function () {
    let player = this.activePlayer.id === this.player1info.id ?
      this.player1 : this.player2;
    return player;
  }
});

const CarromBoardScene = CC.Scene.extend({
  ctor: function () {
    this._super();
  },

  onEnter: function () {
    this._super();
    let pointsLayer = new PointsLayer();
    let layer = new CarromBoardLayer(pointsLayer);
    this.addChild(layer, 15);
    this.addChild(pointsLayer, 10);
  }
});

export default CarromBoardScene;
