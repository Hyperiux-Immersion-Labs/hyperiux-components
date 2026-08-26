// Built using Hyperiux Vault: https://vault.hyperiux.com

import React, { type ComponentProps } from 'react'
import InteractiveListPreviewComp from './InteractiveListPreviewComp';

type InteractiveListPreviewProps = Omit<ComponentProps<typeof InteractiveListPreviewComp>, 'items'>

const InteractiveListPreview = ({
  imageSize,
  duration,
  smoothness,
  lerp,
}: InteractiveListPreviewProps) => {
  return (
    <>
      <div className='flex items-center flex-col gap-20 max-md:gap-20 max-md:py-[15%] max-[1025px]:py-[10%] justify-center h-screen max-[1025px]:h-full bg-neutral-900'>

        <div className='text-center space-y-[1vw] max-[1025px]:space-y-[4vw]'>
          <h2 className='font-mono text-[4vw] max-[1025px]:text-center  max-md:px-10  text-white max-[1025px]:text-5xl max-md:text-4xl capitalize'>
            Elevating interaction through motion
          </h2>
          <p>
            Hover on the list to see the effect
          </p>

        </div>

        <InteractiveListPreviewComp
          items={projects}
          imageSize={imageSize}
          duration={duration}
          smoothness={smoothness}
          lerp={lerp}
        />
      </div>
    </>
  )
}

export default InteractiveListPreview;

const projects = [
  {
    client:"AURORA UI",
    platform:"NEXT.JS",
    services:"Motion Design, GSAP, Page Transitions, UI Systems",
    img:"https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-01.jpg",
  },
  {
    client:"NEON FLOW",
    platform:"REACT",
    services:"Interactive UI, Scroll Animations, Effects Library",
    img:"https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-02.jpg",
  },
  {
    client:"GLASSMORPH",
    platform:"NEXT.JS",
    services:"Glass UI, Components, Motion Architecture",
    img:"https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-03.jpg",
  },
  {
    client:"VOID SYSTEM",
    platform:"CUSTOM WEBGL",
    services:"Shaders, Creative Development, Visual Effects",
    img:"https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-04.jpg",
  },
  {
    client:"HYPER SCROLL",
    platform:"FRAMER MOTION",
    services:"Scroll Storytelling, Motion Systems, Interactions",
    img:"https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-05.jpg",
  },
  {
    client:"KINETIC LAB",
    platform:"THREE.JS",
    services:"3D Interfaces, Motion UI, WebGL Experiences",
    img:"https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-06.jpg",
  },
  {
    client:"PIXEL GRID",
    platform:"TAILWIND CSS",
     services:"Design Systems, UI Engineering, Responsive Layouts",
    img:"https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-07.jpg",
  },
  {
    client:"MOTION CORE",
    platform:"HEADLESS CMS",
    services:"Reusable Components, Motion Engine, Performance",
    img:"https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-08.jpg",
  },
  {
    client:"INTERFACE X",
    platform:"NEXT.JS",
       services:"Immersive UI, Creative Coding, Transitions, Effects",
    img:"https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-09.jpg",
  },
  {
    client:"HYPERIUX",
    platform:"UI LIBRARY",
   services:"Animations, Interactive Components, Futuristic Experiences",
    img:"https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/v-10.jpg",
  },
];
