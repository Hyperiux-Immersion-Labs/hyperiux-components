"use client";
import React from"react";
import Scene3 from"./Scene3";
import Scene2 from"./Scene2";
import FrostedTransition from"./Transition";


export default function WholeExperience() {
 const scenes = [
 <Scene3 key="scene1" />,
 <Scene2 key="scene2" />,
 <Scene3 key="scene3" />,
  ];

 return (
 <FrostedTransition
 scenes={scenes}
 height="800vh"
 showStats={true}
 sectionId="chapter1"
 />
 );
}