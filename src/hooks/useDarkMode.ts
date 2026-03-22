import { useEffect, useState } from 'react'

export function useDarkMode() {
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem('romero-dark') === 'true'
    } catch {
      return false
    }
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('romero-dark', String(dark))
  }, [dark])

  return { dark, toggle: () => setDark((d) => !d) }
}
