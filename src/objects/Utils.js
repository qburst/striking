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
    // console.log(Resources.getFontLoaded(fontname));
    this.textLabels= new CC.LabelTTF(placeholder, 'iAmRockFont', fontsize);
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

}
