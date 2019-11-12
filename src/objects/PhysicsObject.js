import {CP, COLLISION_TYPE_COIN_HOLE, COLLISION_TYPE_COIN,
        COLLISION_TYPE_STRICKER_HOLE, COLLISION_TYPE_STRICKER} from '../globals';
import Config from '../config';

export default class PhysicsObject {
  constructor(space, body, shape, position) {
    if (typeof body === 'object' && typeof shape === 'object' && typeof position === 'object' &&
      typeof space === 'object') {
      this.body = body;
      this.shape = shape;
      this.position = position;
      this.space = space;
      this.body.setPos(position);
    } else {
      throw new Error('A physics object needs some properties');
    }
  }

  update() {
    if (this.body && typeof this.body === 'object') {
      this.position.x = this.body.p.x;
      this.position.y = this.body.p.y;
    }
  }

  getBody() {
    return this.body;
  }

  getPosition() {
    return (this.body && this.body.p) || null;
  }


  static createCircleShape(body, options) {
    let shape = new CP.CircleShape(body, options.radius, CP.v(0, 0));
    if (options.type) {
      if (options.radius === Config.holeForStrickerRadius) {
        shape.setCollisionType(COLLISION_TYPE_STRICKER_HOLE);
      } else {
        shape.setCollisionType(COLLISION_TYPE_COIN_HOLE);
      }
    } else {
        if (options.color === 'stricker') {
          shape.setCollisionType(COLLISION_TYPE_STRICKER);
        } else {
          shape.setCollisionType(COLLISION_TYPE_COIN);
        }
    }
    shape.setFriction(options.friction || 0);
    shape.setElasticity(options.elasticity || 0.999);
    return shape;
  }

  static createBoxShape(body, options) {
    let shape = new CP.BoxShape(body, options.width, options.height);
    shape.setFriction(options.friction || 0);
    shape.setElasticity(options.elasticity || 0.999);
    return shape;
  }

  static createCircleMoment(options) {
    return CP.momentForCircle(options.mass || 1, 0, options.radius, CP.v(0, 0));
  }

  static createBody(options) {
    let body = new CP.Body(options.mass || Infinity, options.moment || Infinity);
    return body;
  }

  toJSON() {
    return {
      position: this.position
    };
  }
}
