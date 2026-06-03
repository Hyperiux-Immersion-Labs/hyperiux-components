import React, { useEffect, useState } from'react';
import { FluidEffect } from'./effects/FluidEffect';

export const FluidEffectComponent = React.forwardRef((props, ref) => {
 const [effect] = useState(() => new FluidEffect(props));

 // Update effect when props change
 useEffect(() => {
 effect.state = props;
 effect.update();
 }, [effect, props]);

 // Expose effect instance via ref
 React.useImperativeHandle(ref, () => effect, [effect]);

 return <primitive object={effect} />;
});

FluidEffectComponent.displayName = 'FluidEffectComponent';
