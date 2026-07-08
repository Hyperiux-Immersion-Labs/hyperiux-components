'use client'

import React, { useCallback, useState } from'react'
import NumberCounterOne from'./NumberCounterOne'
import NumberCounterTwo from'./NumberCounterTwo'
import NumberCounterThree from'./NumberCounterThree'

export default function NumberCounter() {
 const [replayOneKey, setReplayOneKey] = useState(0)
 const [replayTwoKey, setReplayTwoKey] = useState(0)
 const [replayThreeKey, setReplayThreeKey] = useState(0)

 const handleReplayOne = useCallback(() => setReplayOneKey((k) => k + 1), [])
 const handleReplayTwo = useCallback(() => setReplayTwoKey((k) => k + 1), [])
 const handleReplayThree = useCallback(() => setReplayThreeKey((k) => k + 1), [])

 return (
 <>
 <div className="min-h-screen w-screen bg-white flex items-center justify-center p-10">
 <div className="w-full max-w-6xl max-sm:pt-10 flex flex-col items-center gap-10">
 <h2 className="text-[3vw] max-md:text-[4vw] max-sm:text-[7vw] text-[#111111] text-center">
 Numbers That Speak for Themselves
 </h2>

 <div className="w-full flex flex-col md:flex-row items-stretch justify-center gap-8">
 <div className="flex-1 min-w-65 rounded-md border border-black/10 bg-white shadow-sm p-8 flex flex-col items-center">
 <div className="flex-1 w-full flex items-center justify-center">
 <NumberCounterOne
 key={replayOneKey}
 textColor="#021A54"
 textSize="text-[5vw] md:text-[3.2vw]"
 fontWeight="normal"
 stats={[{ value:"936", suffix:"" }]}
 />
 </div>
 <button
 type="button"
 onClick={handleReplayOne}
 className="mt-6 px-5 py-2 rounded-full bg-[#111111] text-white text-sm max-sm:text-sm max-md:text-lg cursor-pointer"
 >
 Replay
 </button>
 </div>

 <div className="flex-1 min-w-[260px] rounded-md border border-black/10 bg-white shadow-sm p-8 flex flex-col items-center">
 <div className="flex-1 w-full flex items-center justify-center">
 <NumberCounterTwo
 key={replayTwoKey}
 value="594"
 textSize="text-[5vw] max-md:text-[7vw] max-sm:text-[12vw] md:text-[3.2vw]"
 color="#021A54"
 fontWeight="normal"
 />
 </div>
 <button
 type="button"
 onClick={handleReplayTwo}
 className="mt-6 px-5 py-2 max-sm:text-sm max-md:text-lg rounded-full bg-[#111111] text-white text-sm cursor-pointer"
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
 textSize="text-[5vw] max-md:text-[7vw] max-sm:text-[12vw] md:text-[3.2vw]"
 />
 </div>
 <button
 type="button"
 onClick={handleReplayThree}
 className="mt-6 px-5 py-2 max-sm:text-sm max-md:text-lg rounded-full bg-[#111111] text-white text-sm cursor-pointer"
 >
 Replay
 </button>
 </div>
 </div>
 </div>
 </div>
 </>
 )
}
