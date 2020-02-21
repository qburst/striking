import {
  CC
} from './globals';
let RectType = {
  TOP: 1,      // Only top side corners will be rounded
  BOTTOM: 2,   // Only bottom side corners will be rounded
  RIGHT: 3,    // Only right side corners will be rounded
  LEFT: 4      // Only left side corners will be rounded
}

let RoundRect = CC.DrawNode.extend({
  ctor: function (width, height, fillColor, lineWidth, lineColor, borderRadius, type,position) {
  this._super();
  function getVertices(origin, destination, fillC, lineW, lineC, rad) {
    let vertices = [],
      radius = rad || 8,
      segments = 20,
      coef = 2.0 * Math.PI / segments,
      center = { x: 0, y: 0 };
    if (type !== RectType.TOP) {
      //Drawing bottom line
      if (type === RectType.RIGHT) {
        vertices.push(CC.p(origin.x, origin.y));
      } else {
        vertices.push(CC.p(origin.x + radius, origin.y));
      }
      //Drawing bottom right curve
      if (type !== RectType.LEFT) {
        center = {
          x: destination.x - radius,
          y: origin.y + radius
        }
        for (let i = segments / 2; i <= (segments - segments / 4); i = i + 1) {
         let rads = i * coef,
            j = radius * Math.cos(rads + CC.degreesToRadians(90)) + center.x,
            k = radius * Math.sin(rads + CC.degreesToRadians(90)) + center.y;
          vertices.push(CC.p(j, k));
        }
      } else {
        vertices.push(CC.p(destination.x, origin.y));
      }
    } else {
      vertices.push(CC.p(origin.x, origin.y));
      vertices.push(CC.p(destination.x, origin.y));
    }

    if (type !== RectType.BOTTOM && type !== RectType.LEFT) {
      //Drawing top right curve
      center = {
        x: destination.x - radius,
        y: destination.y - radius
      }
      for (let i = (segments - segments / 4); i <= segments; i = i + 1) {
        let rads = i * coef,
          j = radius * Math.cos(rads + CC.degreesToRadians(90)) + center.x,
          k = radius * Math.sin(rads + CC.degreesToRadians(90)) + center.y;
        vertices.push(CC.p(j, k));
      }
    } else {
      vertices.push(CC.p(destination.x, destination.y));
    }

    if (type !== RectType.BOTTOM && type !== RectType.RIGHT) {
      //Drawing top left curve
      center = {
        x: origin.x + radius,
        y: destination.y - radius
      }
      for (let i = 0; i <= segments / 4; i = i + 1) {
        let rads = i * coef,
          j = radius * Math.cos(rads + CC.degreesToRadians(90)) + center.x,
          k = radius * Math.sin(rads + CC.degreesToRadians(90)) + center.y;
        vertices.push(CC.p(j, k));
      }
    } else {
      vertices.push(CC.p(origin.x, destination.y));
    }

    if (type !== RectType.TOP && type !== RectType.RIGHT) {
      //Drawing bottom left curve
      center = {
        x: origin.x + radius,
        y: origin.y + radius
      }
      for (let i = segments / 4; i <= segments / 2; i = i + 1) {
        let rads = i * coef,
          j = radius * Math.cos(rads + CC.degreesToRadians(90)) + center.x,
          k = radius * Math.sin(rads + CC.degreesToRadians(90)) + center.y;
        vertices.push(CC.p(j, k));
      }
    } else {
      vertices.push(CC.p(origin.x, origin.y));
    }
    return vertices;
  }
  this.width = width;
  this.height = height;
  this.position = CC.p(position.x, position.y);
  if (fillColor) {
    this.drawPoly(getVertices(CC.p(0, 0), CC.p(width, height), fillColor, lineWidth, lineColor, borderRadius, type,position), fillColor, lineWidth, lineColor || CC.color(255, 255, 255));
  } else {
    let defaultColor = CC.color(128, 0, 0); 
    this.drawPoly(getVertices(CC.p(0, 0), CC.p(width, height), fillColor, lineWidth, lineColor, borderRadius, type, position), defaultColor, lineWidth, defaultColor);
  }
  }
});
export default RoundRect;
