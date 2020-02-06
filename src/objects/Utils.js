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

import {CC, CCUI, CP} from '../globals';
import Resources from '../resource';
export default class Utils {
  constructor() {
  }

  clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  // create labels
  createtextLabels(placeholder, fontname, fontsize, position) {
    console.log(Resources.getFontLoaded(fontname));
    this.textLabels= new CC.LabelTTF(placeholder,"Oswald",fontsize,position);
    this.textLabels.x = position ? position.x : '';
    this.textLabels.y = position ? position.y : '';
    this.textLabels.setColor(CC.color(0, 0, 0));
    return this.textLabels;
  }

  addCollectedCoinsBG(position) {
    this.collectedCoinsLayer = new CC.Sprite(Resources.collectedCoinsBG);
    this.collectedCoinsLayer.setPosition(CP.v(position.x, position.y));
    return this.collectedCoinsLayer;
  }

  // create button
  createExitButton(position) {
    this.newButton = new CCUI.Button();
    this.newButton.loadTextures(Resources.exitButton, Resources.pushBtn);
    // this.newButton.setTitleText(placeholder);
    // this.newButton.setTitleFontSize(fontsize);
    this.newButton.x = position.x;
    this.newButton.y = position.y;
    return this.newButton;
  }
  createLine(position,width,color){
    this.Line = new CC.DrawNode();
    this.Line.drawSegment(CC.p(position.x1,position.y1), CC.p(position.x2,position.y2),width,color);
    return this.Line;
  }
  createColor(color,x,y, width, height){
    this.colorLayer = new CC.LayerGradient(CC.color(5, 101, 3), CC.color(0, 44, 0), CC.p(1,1));
    this.colorLayer.ignoreAnchorPointForPosition(false);
    this.colorLayer.width = width;
    this.colorLayer.height = height;
    this.colorLayer.x = x;
    this.colorLayer.y = y;
    return this.colorLayer;
  }
   

}
