export class Point {
  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }
}

export function lerpAngle(current, target, ease) {
  let delta = target - current;
  while (delta > Math.PI) delta -= 2 * Math.PI;
  while (delta < -Math.PI) delta += 2 * Math.PI;
  return current + delta * ease;
}
