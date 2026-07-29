/* Copyright (c) 2026 Hyperiux. All rights reserved.
 * This file is part of a Hyperiux Pro effect and is not covered by this
 * repository's Mozilla Public License. Licensed only to active Hyperiux
 * Pro subscribers; not for redistribution. */

"use client"
import React, { useState } from 'react'
import { ChevronBird } from './ChevronBird'
import Cross from './Cross'
import Plus from './Plus'

const AnimatedToggle = () => {
  const [chevronActive, setChevronActive] = useState(false);
  const [crossActive, setCrossActive] = useState(false);
  const [plusActive, setPlusActive] = useState(false);
  return (
    <div className="flex gap-8 justify-center">
      <button
        onClick={() => setChevronActive((prev) => !prev)}
        className={`cursor-pointer size-24 max-sm:size-18 rounded-lg flex group items-center justify-center transition-all duration-300 active:scale-90 ${chevronActive ? "bg-primary" : "bg-zinc-400"}`}
      >
        <ChevronBird
          className="mt-2 group-hover:rotate-180 group-hover:translate-y-[-30%] duration-300 transition-all"
          size={32}
          isActive={chevronActive}
        />
      </button>
      <button
        onClick={() => setCrossActive((prev) => !prev)}
        className={`group cursor-pointer size-24 max-sm:size-18 rounded-lg flex items-center justify-center transition-all duration-300 active:scale-90 ${crossActive ? "bg-primary" : "bg-zinc-400"}`}
      >
        <Cross size={24} isActive={crossActive} />
      </button>
      <button
        onClick={() => setPlusActive((prev) => !prev)}
        className={`group cursor-pointer size-24 max-sm:size-18 rounded-lg flex items-center justify-center transition-all duration-300 active:scale-90 ${plusActive ? "bg-primary" : "bg-zinc-400"}`}
      >
        <Plus size={24} isActive={plusActive} />
      </button>
    </div>
  )
}
export default AnimatedToggle
