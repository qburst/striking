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

import {CC, Document} from './globals';
import Resources from './resource';
import Config from './config';
import CarromBoardMenuScene from './CarromBoardMenuScene';

const gameResourcesToLoad = Resources.getResourceMeta();

// CC.game.onStart = ()=>{
  // Experimental!! assuming cc.game.onStart has fired
  if (!CC.sys.isNative && Document.getElementById('cocosLoading')) {
    Document.body.removeChild(Document.getElementById('cocosLoading'));
  }


  // Pass true to enable retina display, on Android disabled by default to improve performance
  CC.view.enableRetina(Config.enableRetina);

  // Adjust viewport meta
  CC.view.adjustViewPort(Config.adjustViewPort);

  // Uncomment the following line to set a fixed orientation for your game
  // CC.view.setOrientation(CC.ORIENTATION_PORTRAIT);

  // Setup the resolution policy and design resolution size
  CC.view.setDesignResolutionSize(Config.size.width, Config.size.height, Config.resolutionPolicy);

  // The game will be resized when browser size change
  CC.view.resizeWithBrowserSize(Config.resizeWithBrowser);

  // load resources and then the first scene
  CC.LoaderScene.preload(gameResourcesToLoad, function () {
    CC.director.runScene(new CarromBoardMenuScene());
  }, this);
// };
