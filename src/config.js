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

const Config = {
  size: {
    width: 1300,
    height: 680
  },
  frameRate: 1000 / 60,
  adjustViewPort: true,
  resolutionPolicy: CC.ResolutionPolicy.SHOW_ALL,
  resizeWithBrowser: true,
  enableRetina: CC.sys.os === CC.sys.OS_IOS ? true : false,
  MIN_Y: 150,
  MAX_Y: 530,
  MIN_FORCE: 0,
  MAX_FORCE: 10000,
  MIN_ANGLE: 0,
  MAX_ANGLE: 359.9,
  coinRadius: 15.5,
  strickerRadius: 18.6,
  holeForCoinRadius: 5,
  holeForStrickerRadius: 1.4,
  boundaryLength: 620,
  boundaryWidth: 300,
  holeCenterXmin: 360,
  holeCenterXmax: 940,
  holeCenterYmin: 50,
  holeCenterYmax: 630,
  player1XValue: 435,
  player2XValue: 865,
  player1strickerXmin: 416.4,
  player1strickerXmax:453.6,
  player2strickerXmin: 846.4,
  player2strickerXmax:883.6,
  xvalueMin: 340,
  xvalueMax: 960,
  yvalueMin: 30,
  yvalueMax: 650,
  strickerRangeRadius: 100,
  coinPositions: [
        { "x" : 650, "y" : 371, "type" : "black", "id" : "b1" },
        { "x" : 676.85, "y" : 324.5, "type" : "black", "id" : "b2" },
        { "x" : 623.15, "y" : 324.5, "type" : "black", "id" : "b3" },
        { "x" : 676.85, "y" : 293.5, "type" : "black", "id" : "b4" },
        { "x" : 623.15, "y" : 293.5, "type" : "black", "id" : "b5" },
        { "x" : 623.15, "y" : 386.5, "type" : "black", "id" : "b6" },
        { "x" : 676.85, "y" : 386.5, "type" : "black", "id" : "b7" },
        { "x" : 703.7, "y" : 340, "type" : "black", "id" : "b8" },
        { "x" : 596.3, "y" : 340, "type" : "black", "id" : "b9" },
        { "x" : 650, "y" : 309, "type" : "white", "id" : "w1" },
        { "x" : 650, "y" : 278, "type" : "white", "id" : "w2" },
        { "x" : 650, "y" : 402, "type" : "white", "id" : "w3" },
        { "x" : 676.85, "y" : 355.5, "type" : "white", "id" : "w4" },
        { "x" : 623.15, "y" : 355.5, "type" : "white", "id" : "w5" },
        { "x" : 703.7, "y" : 309, "type" : "white", "id" : "w6" },
        { "x" : 703.7, "y" : 371, "type" : "white", "id" : "w7" },
        { "x" : 596.3, "y" : 309, "type" : "white", "id" : "w8" },
        { "x" : 596.3, "y" : 371, "type" : "white", "id" : "w9" },
        { "x" : 650, "y" : 340, "type" : "red", "id" : "r1" },
        { "x" : 435, "y" : 150, "type" : "stricker", "id" : "s1" }
   ]
};

export default Config;
