'use client'

import React, { useCallback, useState } from'react'
import CounterOne from'@/components/Counters/CounterOne'
import CounterTwo from'@/components/Counters/CounterTwo'
import CounterThree from'@/components/Counters/CounterThree'

export default function Page() {
 const [replayOneKey, setReplayOneKey] = useState(0)
 const [replayTwoKey, setReplayTwoKey] = useState(0)
 const [replayThreeKey, setReplayThreeKey] = useState(0)

 const handleReplayOne = useCallback(() => setReplayOneKey((k) => k + 1), [])
 const handleReplayTwo = useCallback(() => setReplayTwoKey((k) => k + 1), [])
 const handleReplayThree = useCallback(() => setReplayThreeKey((k) => k + 1), [])

 return (
 <>
 <div className="min-h-screen w-screen bg-white flex items-center justify-center p-10">
 <div className="w-full max-w-6xl flex flex-col items-center gap-10">
 <h2 className="text-[3vw] max-sm:text-[7vw] text-[#111111] text-center">
 Numbers That Speak for Themselves
 </h2>

 <div className="w-full flex flex-col md:flex-row items-stretch justify-center gap-8">
 <div className="flex-1 min-w-[260px] rounded-md border border-black/10 bg-white shadow-sm p-8 flex flex-col items-center">
 <div className="flex-1 w-full flex items-center justify-center">
 <CounterOne
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
 className="mt-6 px-5 py-2 rounded-full bg-[#111111] text-white text-sm cursor-pointer"
 >
 Replay
 </button>
 </div>

 <div className="flex-1 min-w-[260px] rounded-md border border-black/10 bg-white shadow-sm p-8 flex flex-col items-center">
 <div className="flex-1 w-full flex items-center justify-center">
 <CounterTwo
 key={replayTwoKey}
 value="594"
 textSize="text-[5vw] md:text-[3.2vw]"
 color="#021A54"
 fontWeight="normal"
 />
 </div>
 <button
 type="button"
 onClick={handleReplayTwo}
 className="mt-6 px-5 py-2 rounded-full bg-[#111111] text-white text-sm cursor-pointer"
 >
 Replay
 </button>
 </div>

 <div className="flex-1 min-w-[260px] rounded-md border border-black/10 bg-white shadow-sm p-8 flex flex-col items-center">
 <div className="flex-1 w-full flex items-center justify-center">
 <CounterThree
 key={replayThreeKey}
 value="246"
 duration={2}
 fontWeight="medium"
 textColor="#021A54"
 textSize="text-[5vw] md:text-[3.2vw]"
 />
 </div>
 <button
 type="button"
 onClick={handleReplayThree}
 className="mt-6 px-5 py-2 rounded-full bg-[#111111] text-white text-sm cursor-pointer"
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
