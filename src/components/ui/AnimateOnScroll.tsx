import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  children: ReactNode
  className?: string
  delay?: number
  from?: 'bottom' | 'left' | 'right'
}

export function AnimateOnScroll({ children, className, delay = 0, from = 'bottom' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  const hidden =
    from === 'left'
      ? 'opacity-0 -translate-x-8'
      : from === 'right'
        ? 'opacity-0 translate-x-8'
        : 'opacity-0 translate-y-8'

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        visible ? 'opacity-100 translate-x-0 translate-y-0' : hidden,
        className,
      )}
    >
      {children}
    </div>
  )
}
