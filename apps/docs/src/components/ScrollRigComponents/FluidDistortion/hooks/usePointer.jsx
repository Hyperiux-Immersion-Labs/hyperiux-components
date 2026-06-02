import { useThree } from'@react-three/fiber';
import { useCallback, useEffect, useRef } from'react';
import { Vector2 } from'three';

export const usePointer = ({ force }) => {
 const size = useThree((three) => three.size);

 const splatStackRef = useRef([]);
 const lastMouse = useRef(new Vector2());
 const hasMoved = useRef(false);

 const onPointerMove = useCallback(
 (event) => {
 const deltaX = event.x - lastMouse.current.x;
 const deltaY = event.y - lastMouse.current.y;

 if (!hasMoved.current) {
 hasMoved.current = true;
 lastMouse.current.set(event.x, event.y);
 return;
 }

 lastMouse.current.set(event.x, event.y);

 const splatInfo = {
 mouseX: event.x / size.width,
 mouseY: 1.0 - event.y / size.height,
 velocityX: deltaX * force,
 velocityY: -deltaY * force,
 };

 splatStackRef.current.push(splatInfo);
 },
 [force, size.height, size.width],
 );

 useEffect(() => {
 addEventListener('pointermove', onPointerMove);
 return () => {
 removeEventListener('pointermove', onPointerMove);
 };
 }, [onPointerMove]);

 return splatStackRef;
};
