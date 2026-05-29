'use client'
import { Environment, OrbitControls } from"@react-three/drei";
import { Book } from"./Book";

export const Experience = ({
 images = [],
 pathPattern ="/assets/nature",
 floatConfig = {},
 orbitControls = {},
 ...props
}) => {
 return (
 <>
 <OrbitControls
 enableDamping
 enablePan={false}
 enableZoom={false}
 target={[0, 0, 0]}
 {...orbitControls}
 />
 <Book images={images} pathPattern={pathPattern} {...props} />
 <Environment preset="studio"></Environment>
 <directionalLight
 position={[2, 5, 2]}
 intensity={2.5}
 />
 </>
 );
};
