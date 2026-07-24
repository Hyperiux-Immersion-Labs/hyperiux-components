'use client'

import React, { useCallback, useEffect, useState } from 'react'
import NumberCounterOne from './NumberCounterOne'
import NumberCounterTwo from './NumberCounterTwo'
import NumberCounterThree from './NumberCounterThree'

function usePrefersReducedMotion() {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
        const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches)

        updatePreference()
        mediaQuery.addEventListener('change', updatePreference)

        return () => mediaQuery.removeEventListener('change', updatePreference)
    }, [])

    return prefersReducedMotion
}

function ReducedMotionNote() {
    return (
        <div aria-live="polite" className="w-fit rounded-md border border-black/10 bg-[#F8F8F3] p-6 text-center shadow-sm">
            <h2 className="mt-3 text-[clamp(1.5rem,4vw,3rem)] leading-none text-[#111111]">
                The digits are holding still.
            </h2>
            <p className="mx-auto mt-4 w-[53vw] text-base leading-7 text-black/65 max-md:text-sm max-md:w-full">
                Reduced motion is enabled, so the counters fade in as static numbers
                instead of rolling vertically. The rolling effect depends on repeated
                upward motion, and your system preference asks us to keep that still.
            </p>
        </div>
    )
}

export default function NumberCounter() {
    const prefersReducedMotion = usePrefersReducedMotion()
    const [replayOneKey, setReplayOneKey] = useState(0)
    const [replayTwoKey, setReplayTwoKey] = useState(0)
    const [replayThreeKey, setReplayThreeKey] = useState(0)

    const handleReplayOne = useCallback(() => setReplayOneKey((k) => k + 1), [])
    const handleReplayTwo = useCallback(() => setReplayTwoKey((k) => k + 1), [])
    const handleReplayThree = useCallback(() => setReplayThreeKey((k) => k + 1), [])

    return (
        <>
            <div className="min-h-screen w-screen bg-white flex items-center justify-center p-10">
                <div className="w-full max-w-6xl max-md:pt-10 flex flex-col items-center gap-10">
                    <h1 className="text-[3vw] max-[1025px]:text-[4vw] max-md:text-[7vw] text-[#111111] text-center">
                        Numbers That Speak for Themselves
                    </h1>

                    <div className={`w-full flex flex-col md:flex-row items-stretch justify-center gap-8 ${prefersReducedMotion ? 'animate-[number-counter-static-fade_420ms_ease-out_both]' : ''}`}>
                        <div className="flex-1 min-w-65 rounded-md border border-black/10 bg-white shadow-sm p-8 flex flex-col items-center">
                            <div className="flex-1 w-full flex items-center justify-center">
                                <NumberCounterOne
                                    key={replayOneKey}
                                    textColor="#021A54"
                                    textSize="text-[5vw] md:text-[3.2vw]"
                                    fontWeight="normal"
                                    stats={[{ value: "936", suffix: "" }]}
                                    reducedMotion={prefersReducedMotion}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleReplayOne}
                                disabled={prefersReducedMotion}
                                className="mt-6 px-5 py-2 rounded-full bg-[#111111] text-white text-sm max-md:text-sm max-[1025px]:text-lg cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
                            >
                                Replay
                            </button>
                        </div>

                        <div className="flex-1 min-w-[260px] rounded-md border border-black/10 bg-white shadow-sm p-8 flex flex-col items-center">
                            <div className="flex-1 w-full flex items-center justify-center">
                                <NumberCounterTwo
                                    key={replayTwoKey}
                                    value="594"
                                    textSize="text-[5vw] max-[1025px]:text-[7vw] max-md:text-[12vw] md:text-[3.2vw]"
                                    color="#021A54"
                                    fontWeight="normal"
                                    reducedMotion={prefersReducedMotion}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleReplayTwo}
                                disabled={prefersReducedMotion}
                                className="mt-6 px-5 py-2 max-md:text-sm max-[1025px]:text-lg rounded-full bg-[#111111] text-white text-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
                            >
                                Replay
                            </button>
                        </div>

                        <div className="flex-1 min-w-[260px] rounded-md border border-black/10 bg-white shadow-sm p-8 flex flex-col items-center">
                            <div className="flex-1 w-full flex items-center justify-center">
                                <NumberCounterThree
                                    key={replayThreeKey}
                                    value="246"
                                    duration={2}
                                    fontWeight="medium"
                                    textColor="#021A54"
                                    textSize="text-[5vw] max-[1025px]:text-[7vw] max-md:text-[12vw] md:text-[3.2vw]"
                                    reducedMotion={prefersReducedMotion}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleReplayThree}
                                disabled={prefersReducedMotion}
                                className="mt-6 px-5 py-2 max-md:text-sm max-[1025px]:text-lg rounded-full bg-[#111111] text-white text-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
                            >
                                Replay
                            </button>
                        </div>
                    </div>
                    {prefersReducedMotion && <ReducedMotionNote />}
                    <style>{`
                        @keyframes number-counter-static-fade {
                            from { opacity: 0; }
                            to { opacity: 1; }
                        }
                    `}</style>
                </div>
            </div>
        </>
    )
}
