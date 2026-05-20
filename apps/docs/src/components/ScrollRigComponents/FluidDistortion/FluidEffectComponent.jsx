import React, { useMemo, useRef, useEffect } from'react';
import { FluidEffect } from'./effects/FluidEffect';

export const FluidEffectComponent = React.forwardRef((props, ref) => {
 const effectRef = useRef();

 const effect = useMemo(() => {
 const fluidEffect = new FluidEffect(props);
 effectRef.current = fluidEffect;
 return fluidEffect;
 }, []);

 // Update effect when props change
 useEffect(() => {
 if (effectRef.current) {
 effectRef.current.state = props;
 effectRef.current.update();
 }
 }, [props]);

 // Expose effect instance via ref
 React.useImperativeHandle(ref, () => effectRef.current, []);

 return <primitive object={effect} />;
});
