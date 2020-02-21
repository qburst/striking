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

const Resources = {
  carromLogo: 'res/logo.jpg',
  carromBG: 'res/flatboard.png',
  black: 'res/blackcoin.png',
  white: 'res/whitecoin.png',
  green: 'res/oval-copy-3.png',
  red: 'res/redcoin.png',
  stricker: 'res/stricker.png',
  hole: 'res/round.png',
  iAmRockFont: 'res/fonts/i_am_a_rock/IAmaRock_Free_For_Personal_Use_Only.ttf',
  makidoFont: 'res/fonts/MikadoBold_DEMO.otf',
  winsBG: 'res/wins.png',
  bot2Pot: 'res/bot_2_pot.png',
  bar: 'res/color-bar-red.jpg',
  forceArrow: 'res/arrow.svg',
  circleSprite: 'res/circle_range.svg',
  dottedLine: 'res/line.svg',
  exitButton: 'res/exit.png',
  circleon : 'res/circle.svg'
};

Resources.getResourceMeta = () => {
  let gameResourcesToLoad = [];
  for (let i in Resources) {
    if (Resources.hasOwnProperty(i)) {
      gameResourcesToLoad.push(Resources[i]);
    }
  }
};

Resources.getCoinColor = (color) => {
  return Resources[color];
};

Resources.getFontLoaded = (fontname) => {
  return Resources[fontname];
};


export default Resources;
