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
