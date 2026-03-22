import { useEffect, useState } from 'react'

interface TimeLeft {
  days: number
  hours: number
  mins: number
  secs: number
  total: number
}

function calc(target: string): TimeLeft | null {
  const diff = new Date(target).getTime() - Date.now()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    mins: Math.floor((diff % 3600000) / 60000),
    secs: Math.floor((diff % 60000) / 1000),
    total: diff,
  }
}

export function useCountdown(target: string | null) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() =>
    target ? calc(target) : null,
  )

  useEffect(() => {
    if (!target) return
    setTimeLeft(calc(target))
    const timer = setInterval(() => {
      const t = calc(target)
      setTimeLeft(t)
      if (!t) clearInterval(timer)
    }, 1000)
    return () => clearInterval(timer)
  }, [target])

  return timeLeft
}
