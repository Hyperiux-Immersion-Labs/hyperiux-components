'use client'

import { useCallback, useEffect, useState } from'react'
import { useRouter } from'next/navigation'
import NumericTunnel from'@/components/Loaders/NumericTunnel'

export default function HomeLoader({ children }) {
  const router = useRouter()
  const [state, setState] = useState('loading') // 'loading' | 'loader' | 'redirecting'

  useEffect(() => {
    const hasPlayed = sessionStorage.getItem('loaderPlayed')
    if (hasPlayed) {
      setState('redirecting')
      router.replace('/effects')
    } else {
      setState('loader')
    }
  }, [router])

  const handleComplete = useCallback(() => {
    sessionStorage.setItem('loaderPlayed', 'true')
    setState('redirecting')
    router.replace('/effects')
  }, [router])

  if (state === 'loader') {
    return <NumericTunnel onComplete={handleComplete} />
  }

  // 'loading' (pre-hydration) and 'redirecting' — render nothing
  return null
}
