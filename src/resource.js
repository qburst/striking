const Resources = {
  carromLogo: 'res/logo.jpg',
  carromBG: 'res/flatboard.png',
  black: 'res/blackcoin.png',
  white: 'res/whitecoin.png',
  red: 'res/redcoin.png',
  stricker: 'res/stricker.png',
  hole: 'res/round.png',
  blueBG: 'res/bg.png',
  collectedCoinsBG: 'res/pointsbg.png',
  iAmRockFont: 'res/fonts/i_am_a_rock/IAmaRock_Free_For_Personal_Use_Only.ttf',
  makidoFont: 'res/fonts/MikadoBold_DEMO.otf',
  winsBG: 'res/wins.png',
  bot2Pot: 'res/bot_2_pot.png',
  bar: 'res/color-bar-red.jpg',
  forceArrow: 'res/arrow.svg',
  circleSprite: 'res/circle_range.svg',
  dottedLine: 'res/line.svg',
  exitButton: 'res/exit.png'
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
