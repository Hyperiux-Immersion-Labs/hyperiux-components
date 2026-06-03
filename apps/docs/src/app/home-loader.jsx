'use client'

import { useCallback, useEffect, useState } from'react'
import { useRouter } from'next/navigation'
import { NumericTunnel } from'@/components/Loaders/NumericTunnel'

export default function HomeLoader({ children }) {
  const router = useRouter()
  const [showLoader, setShowLoader] = useState(
    () => typeof window !== 'undefined' && !sessionStorage.getItem('loaderPlayed')
  )

  useEffect(() => {
    const hasPlayed = sessionStorage.getItem('loaderPlayed')
    if (hasPlayed) {
      router.replace('/effects')
    }
  }, [router])

  const handleComplete = useCallback(() => {
    sessionStorage.setItem('loaderPlayed', 'true')
    setShowLoader(false)
    router.replace('/effects')
  }, [router])

  if (showLoader) {
    return <NumericTunnel onComplete={handleComplete} />
  }

  return null
}
