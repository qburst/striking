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

import PhysicsObject from './PhysicsObject';

export default class Carrom extends PhysicsObject {
  constructor(space, options, sprite) {
    // let moment = PhysicsObject.createCircleMoment(options);
    options.moment = Infinity;

    let body = PhysicsObject.createBody(options);
    let shape = PhysicsObject.createCircleShape(body, options);
    space.addShape(shape);
    space.addBody(body);
    super(space, body, shape, options.position, false);
    this.sprite = sprite ? sprite : null;
  }

  update(dt) {
    super.update(dt);
    if (this.sprite) {
      this.sprite.setPosition(this.position);
    }
  }
}
