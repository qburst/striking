import PhysicsObject from './PhysicsObject';

export default class HoleObject extends PhysicsObject {
  constructor(space, options) {
    let moment = PhysicsObject.createCircleMoment(options);
    options.moment = moment;

    let body = PhysicsObject.createBody(options);
    let shape = PhysicsObject.createCircleShape(body, options);

    super(space, body, shape, options.position, false);
    body.nodeIdleTime = Infinity;
    shape.cacheBB();
    space.addStaticShape(shape);
  }

  update(dt) {
    super.update(dt);
    this.sprite.setPosition(this.position);
  }
}
