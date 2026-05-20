import { Color, Vector3 } from'three';
import { REFRESH_RATE } from'./constants';

export const hexToRgb = (hex) => {
 const color = new Color(hex);
 return new Vector3(color.r, color.g, color.b);
};

export const normalizeScreenHz = (value, dt) => {
 return Math.pow(value, dt * REFRESH_RATE);
};
