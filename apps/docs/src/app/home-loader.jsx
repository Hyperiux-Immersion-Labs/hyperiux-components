'use client'

import { useCallback, useEffect, useState } from'react'
import { useRouter } from'next/navigation'
import NumericTunnel from'@/components/Loaders/NumericTunnel'
export default function HomeLoader({ children }) {
 const router = useRouter()
  const [showLoader, setShowLoader] = useState(false)
 const [ready, setReady] = useState(false)

 useEffect(() => {
  const hasPlayed = sessionStorage.getItem('loaderPlayed')
  if (hasPlayed) {
   router.replace('/effects')
  } else {
   setShowLoader(true)
  }
  setReady(true)
 }, [router])

 const handleComplete = useCallback(() => {
    sessionStorage.setItem('loaderPlayed', 'true')
  router.replace('/effects')
 }, [router])

 // Don't render anything until we've checked sessionStorage (avoids flash)
 if (!ready) return null

 if (showLoader) {
  return <NumericTunnel onComplete={handleComplete} />
 }

 // Fallback while redirecting
 return null
}
