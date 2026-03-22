import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'info'

interface ToastItem {
  id: number
  message: string
  type: ToastType
}

interface ToastContextValue {
  addToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue>({ addToast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

let nextId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const addToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = ++nextId
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  function dismiss(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center pointer-events-none min-w-max">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function Toast({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: number) => void }) {
  const icons: Record<ToastType, ReactNode> = {
    success: <CheckCircle className="h-4 w-4 text-primary-500 shrink-0" />,
    error: <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />,
    info: <Info className="h-4 w-4 text-blue-500 shrink-0" />,
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2.5 bg-white shadow-xl rounded-2xl px-4 py-3 text-sm font-medium',
        'border border-gray-100 pointer-events-auto',
      )}
    >
      {icons[toast.type]}
      <span className="text-gray-800">{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="ml-1 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
