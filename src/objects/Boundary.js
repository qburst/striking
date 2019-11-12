import PhysicsObject from './PhysicsObject';

export default class Boundary extends PhysicsObject {
  constructor(space, options, sprite) {
    let body = PhysicsObject.createBody(options);
    let shape = PhysicsObject.createBoxShape(body, options);

    super(space, body, shape, options.position, false);
    body.nodeIdleTime = Infinity;
    shape.cacheBB();
    space.addStaticShape(shape);
    this.sprite = sprite ? sprite : null;
  }

  update(dt) {
    super.update(dt);
    if (this.sprite) {
      this.sprite.setPosition(this.position);
    }
  }
}
