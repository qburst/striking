/* eslint-disable  max-params */
export default class Player {
  constructor(id, name, xValue, yValue, xMinRange, xMaxRange) {
    this.playerData = {};
    this.playerData.id = id;
    this.playerData.name = name;
    this.playerData.xValue = xValue;
    this.playerData.yValue = yValue;
    this.playerData.strickerMinxRange = xMinRange;
    this.playerData.strickerMaxRange = xMaxRange;
    this.playerData.points = 0;
    this.playerData.blackCoinCount = 0;
    this.playerData.whiteCoinCount = 0;
    this.playerData.redCoinCount = 0;
    this.playerData.strikeCount = 1;
    this.playerData.redCoinInHole = false;
    this.playerData.history = [];
    this.playerData.coinType = null;
  }

  getPlayerDetails() {
    return this.playerData;
  }

  getPoints() {
    return this.playerData.points;
  }

  incrementStrikeCount() {
    this.playerData.strikeCount = this.playerData.strikeCount + 1;
  }

  setRedCoinStatus(value) {
    this.playerData.redCoinInHole = value;
  }

  addCount(color) {
    let points;
    switch (color) {
    case 'white': points = 1;
      this.playerData.whiteCoinCount = this.playerData.whiteCoinCount + 1;
      break;
    case 'black': points = 1;
      this.playerData.blackCoinCount = this.playerData.blackCoinCount + 1;
      break;
    case 'red': points = 0;
      this.playerData.redCoinCount = 1;
      break;
    default: break;
    }
    this.playerData.points = this.playerData.points + points;
    console.log(this.playerData.name + ' Got ' + this.playerData.points + ' points');
    return;
  }

  removePoints(color) {
    let points;
    switch (color) {
    case 'white': points = 1;
      this.playerData.whiteCoinCount = this.playerData.whiteCoinCount - 1;
      break;
    case 'black': points = 1;
      this.playerData.blackCoinCount = this.playerData.blackCoinCount - 1;
      break;
    case 'red': points = 0;
      this.playerData.redCoinCount = this.playerData.redCoinCount - 1;
      break;
    default: break;
    }
    this.playerData.points = this.playerData.points - points;
    console.log('player ' + this.playerData.name + 'point ' + this.playerData.points);
    return;
  }

  addhistory(coin, strikeCount) {
    let hstryObj = {
      type: coin.type,
      id: coin.id,
      strikeCount: strikeCount
    };
    this.playerData.history.push(hstryObj);
  }

  coinsPocketedWithStriker(count) {
    let lastCoin = '';
    let len = this.playerData.history.length;
    if (len && this.playerData.history[len - 1].strikeCount === count) {
      lastCoin = this.playerData.history[len - 1];
      this.playerData.history.pop();
    }
    return lastCoin;
  }

  updateCoins() {
    let coin = '';
    if (this.playerData.points > 0) {
      if (this.playerData.blackCoinCount > 0) {
        coin = this.removeDataFromHistory('black');
      } else if (this.playerData.whiteCoinCount > 0) {
        coin = this.removeDataFromHistory('white');
      } else if (this.playerData.redCoinCount > 0) {
        coin = this.removeDataFromHistory('red');
      }
    }
    return coin;
  }

  removeDataFromHistory(type) {
    for (let i = this.playerData.history.length - 1; i >= 0; i = i - 1) {
      if (this.playerData.history[i].type === type) {
        let coin = this.playerData.history[i];
        this.playerData.history.splice(i, 1);
        return coin;
      }
    }
    return 0;
  }

}
