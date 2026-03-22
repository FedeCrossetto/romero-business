import { useState, useEffect, useRef } from 'react'
import { X, Send, MessageCircle } from 'lucide-react'
import { useSettings } from '@/hooks/useSettings'
import { openWhatsApp } from '@/lib/whatsapp'
import { cn } from '@/lib/utils'

interface Message {
  id: number
  from: 'bot' | 'user'
  text: string
  options?: Option[]
}

interface Option {
  label: string
  value: string
}

const FAQ: Record<string, { answer: string; options?: Option[] }> = {
  horarios: {
    answer: '🕐 Nuestro horario de atención es *Lunes a Sábado de 8:00 a 20:00hs* y *Domingos de 9:00 a 14:00hs*.',
    options: [
      { label: '¿Hacen envíos?', value: 'envios' },
      { label: '¿Cómo hago un pedido?', value: 'pedido' },
      { label: 'Hablar con el vendedor', value: 'whatsapp' },
    ],
  },
  envios: {
    answer: '🚚 ¡Sí! Hacemos envíos a domicilio de *Lunes a Sábado*. El costo de envío depende de la zona. Pedidos mayores a $5.000 tienen *envío gratis*.',
    options: [
      { label: '¿Cuánto tarda el envío?', value: 'demora' },
      { label: '¿Monto mínimo de pedido?', value: 'minimo' },
      { label: 'Hablar con el vendedor', value: 'whatsapp' },
    ],
  },
  demora: {
    answer: '⏱ El envío demora entre *30 y 90 minutos* dependiendo de la zona y la cantidad de pedidos del día.',
    options: [
      { label: '¿Cómo hago un pedido?', value: 'pedido' },
      { label: '¿Medios de pago?', value: 'pagos' },
      { label: 'Hablar con el vendedor', value: 'whatsapp' },
    ],
  },
  pedido: {
    answer: '🛒 Es muy fácil:\n1. Elegís tus productos en el catálogo\n2. Los agregás al carrito\n3. Completás tus datos\n4. ¡Nos mandás el pedido por WhatsApp!',
    options: [
      { label: 'Ver catálogo', value: 'catalogo' },
      { label: '¿Hacen envíos?', value: 'envios' },
      { label: 'Hablar con el vendedor', value: 'whatsapp' },
    ],
  },
  minimo: {
    answer: '💰 El monto mínimo de pedido para envío es de *$2.000*. Para retiro en local no hay mínimo.',
    options: [
      { label: '¿Cómo hago un pedido?', value: 'pedido' },
      { label: '¿Medios de pago?', value: 'pagos' },
      { label: 'Hablar con el vendedor', value: 'whatsapp' },
    ],
  },
  pagos: {
    answer: '💳 Aceptamos *efectivo* y *transferencia bancaria*. Por el momento no procesamos pagos con tarjeta online.',
    options: [
      { label: '¿Hacen envíos?', value: 'envios' },
      { label: '¿Cómo hago un pedido?', value: 'pedido' },
      { label: 'Hablar con el vendedor', value: 'whatsapp' },
    ],
  },
  organicos: {
    answer: '🌿 Trabajamos con productos frescos seleccionados diariamente. Algunos productos son de origen orgánico y están indicados en el catálogo.',
    options: [
      { label: '¿Cómo hago un pedido?', value: 'pedido' },
      { label: '¿Tienen delivery?', value: 'envios' },
      { label: 'Hablar con el vendedor', value: 'whatsapp' },
    ],
  },
  catalogo: {
    answer: '📦 Podés ver todos nuestros productos frescos del día en el catálogo. ¡Actualizamos stock todos los días!',
    options: [
      { label: '¿Cómo hago un pedido?', value: 'pedido' },
      { label: 'Hablar con el vendedor', value: 'whatsapp' },
    ],
  },
  whatsapp: {
    answer: '📲 Te voy a conectar con nuestro vendedor ahora mismo. ¡Un momento!',
  },
}

const INITIAL_OPTIONS: Option[] = [
  { label: '🕐 Horarios de atención', value: 'horarios' },
  { label: '🚚 ¿Hacen envíos?', value: 'envios' },
  { label: '🛒 ¿Cómo hago un pedido?', value: 'pedido' },
  { label: '💰 Monto mínimo', value: 'minimo' },
  { label: '💳 Medios de pago', value: 'pagos' },
  { label: '🌿 ¿Tienen orgánicos?', value: 'organicos' },
  { label: '💬 Hablar con el vendedor', value: 'whatsapp' },
]

const GREETING: Message = {
  id: 0,
  from: 'bot',
  text: '¡Hola! 👋 Soy el asistente de *Romero & Co*. ¿En qué te puedo ayudar?',
  options: INITIAL_OPTIONS,
}

let nextId = 1

export function WhatsAppChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([GREETING])
  const [pulse, setPulse] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const { settings } = useSettings()

  useEffect(() => {
    const t = setTimeout(() => setPulse(false), 3000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, open])

  function handleOption(option: Option) {
    const userMsg: Message = { id: nextId++, from: 'user', text: option.label }
    setMessages((prev) => [...prev, userMsg])

    const faq = FAQ[option.value]
    if (!faq) return

    setTimeout(() => {
      const botMsg: Message = {
        id: nextId++,
        from: 'bot',
        text: faq.answer,
        options: faq.options,
      }
      setMessages((prev) => [...prev, botMsg])

      if (option.value === 'whatsapp') {
        setTimeout(() => {
          openWhatsApp(settings.whatsapp_number, 'Hola! Quiero hacer una consulta.')
        }, 800)
      }

      if (option.value === 'catalogo') {
        setTimeout(() => {
          window.location.href = '/catalogo'
        }, 1200)
      }
    }, 500)
  }

  function formatText(text: string) {
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line.split(/\*(.*?)\*/g).map((part, j) =>
          j % 2 === 1 ? <strong key={j}>{part}</strong> : part,
        )}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    ))
  }

  return (
    <>
      {/* Chat window */}
      <div
        className={cn(
          'fixed bottom-24 right-4 z-50 w-80 max-h-[70vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right',
          open ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-90 opacity-0 pointer-events-none',
        )}
      >
        {/* Header */}
        <div className="bg-[#075e54] px-4 py-3 flex items-center gap-3">
          <div className="relative">
            <img src="/logo.png" alt="Romero" className="w-10 h-10 rounded-full object-contain bg-white" />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-[#075e54]" />
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold text-sm leading-tight">Romero & Co</p>
            <p className="text-green-300 text-xs">En línea</p>
          </div>
          <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto p-3 space-y-3"
          style={{ background: '#ece5dd url("data:image/svg+xml,%3Csvg width=\'200\' height=\'200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3C/svg%3E")' }}
        >
          {messages.map((msg) => (
            <div key={msg.id} className={cn('flex flex-col', msg.from === 'user' ? 'items-end' : 'items-start')}>
              <div
                className={cn(
                  'max-w-[85%] px-3 py-2 rounded-2xl text-sm shadow-sm',
                  msg.from === 'bot'
                    ? 'bg-white text-gray-800 rounded-tl-none'
                    : 'bg-[#dcf8c6] text-gray-800 rounded-tr-none',
                )}
              >
                {formatText(msg.text)}
              </div>

              {/* Options */}
              {msg.options && (
                <div className="mt-2 flex flex-col gap-1.5 w-full">
                  {msg.options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleOption(opt)}
                      className="text-left text-xs bg-white border border-gray-200 hover:bg-[#075e54] hover:text-white hover:border-[#075e54] text-[#075e54] font-medium px-3 py-2 rounded-xl transition-all duration-150 shadow-sm"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Footer */}
        <div className="bg-[#f0f0f0] px-4 py-2 flex items-center gap-2 border-t border-gray-200">
          <button
            onClick={() => handleOption({ label: '💬 Hablar con el vendedor', value: 'whatsapp' })}
            className="flex items-center gap-2 bg-[#25d366] text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-[#1da851] transition w-full justify-center"
          >
            <Send className="h-3.5 w-3.5" />
            Hablar con el vendedor
          </button>
        </div>
      </div>

      {/* FAB Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-4 z-50 w-14 h-14 bg-[#25d366] hover:bg-[#1da851] text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
        aria-label="Chat WhatsApp"
      >
        {open ? (
          <X className="h-6 w-6" />
        ) : (
          <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        )}
        {pulse && !open && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center animate-bounce">
            1
          </span>
        )}
      </button>
    </>
  )
}
