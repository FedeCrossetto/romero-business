import { useState, useEffect, useRef, useMemo } from 'react'
import { X, Send } from 'lucide-react'
import { useSettings } from '@/hooks/useSettings'
import { openWhatsApp } from '@/lib/whatsapp'
import { formatPrice } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Settings } from '@/types'

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

// FAQ construido dinámicamente con los datos reales de settings
function buildFAQ(s: Settings): Record<string, { answer: string; options?: Option[] }> {
  const threshold = parseFloat(s.free_shipping_threshold) || 0
  const deliveryFee = parseFloat(s.delivery_fee) || 0
  const hasAddress = s.business_address?.trim()

  return {
    horarios: {
      answer: s.business_hours
        ? `🕐 Nuestro horario de atención es *${s.business_hours}*.`
        : '🕐 Consultanos por WhatsApp para conocer nuestros horarios actualizados.',
      options: [
        { label: '🚚 ¿Hacen envíos?', value: 'envios' },
        { label: '📍 ¿Dónde están?', value: 'ubicacion' },
        { label: '💬 Hablar con el vendedor', value: 'whatsapp' },
      ],
    },
    envios: {
      answer: deliveryFee > 0
        ? `🚚 ¡Sí! Hacemos envíos a domicilio. El costo de envío es de *${formatPrice(deliveryFee)}*.\n${threshold > 0 ? `Pedidos que superen *${formatPrice(threshold)}* tienen *envío gratis* 🎉` : ''}`
        : `🚚 ¡Sí! Hacemos envíos a domicilio${threshold > 0 ? `. Pedidos que superen *${formatPrice(threshold)}* tienen *envío gratis* 🎉` : '.'}`,
      options: [
        { label: '⏱ ¿Cuánto tarda?', value: 'demora' },
        { label: '📍 ¿Dónde están?', value: 'ubicacion' },
        { label: '💬 Hablar con el vendedor', value: 'whatsapp' },
      ],
    },
    demora: {
      answer: '⏱ El envío demora entre *30 y 90 minutos* dependiendo de la zona y la demanda del día.',
      options: [
        { label: '🛒 ¿Cómo hago un pedido?', value: 'pedido' },
        { label: '💳 Medios de pago', value: 'pagos' },
        { label: '💬 Hablar con el vendedor', value: 'whatsapp' },
      ],
    },
    pedido: {
      answer: '🛒 Es muy fácil:\n1. Elegís tus productos en el catálogo\n2. Los agregás al carrito\n3. Completás tus datos\n4. ¡Nos mandás el pedido por WhatsApp!',
      options: [
        { label: 'Ver catálogo', value: 'catalogo' },
        { label: '🚚 ¿Hacen envíos?', value: 'envios' },
        { label: '💬 Hablar con el vendedor', value: 'whatsapp' },
      ],
    },
    minimo: {
      answer: threshold > 0
        ? `💰 No hay un monto mínimo de pedido para retiro en local. Para *envío a domicilio*, el pedido debe ser mayor a *${formatPrice(threshold / 4)}* aproximadamente — consultanos por WhatsApp para tu caso particular.`
        : '💰 No hay monto mínimo de pedido. Para retiro en local podés pedir lo que necesitás.',
      options: [
        { label: '🛒 ¿Cómo hago un pedido?', value: 'pedido' },
        { label: '💳 Medios de pago', value: 'pagos' },
        { label: '💬 Hablar con el vendedor', value: 'whatsapp' },
      ],
    },
    pagos: {
      answer: '💳 Aceptamos *efectivo* y *transferencia bancaria*. Por el momento no procesamos pagos con tarjeta online.',
      options: [
        { label: '🚚 ¿Hacen envíos?', value: 'envios' },
        { label: '🛒 ¿Cómo hago un pedido?', value: 'pedido' },
        { label: '💬 Hablar con el vendedor', value: 'whatsapp' },
      ],
    },
    ubicacion: {
      answer: hasAddress
        ? `📍 Estamos ubicados en *${s.business_address}*.\n\n${s.business_hours ? `Horario: *${s.business_hours}*` : ''}\n\nPodés venir a retirar tu pedido o coordinar el envío a domicilio.`
        : '📍 Consultanos la dirección por WhatsApp y te la enviamos al instante.',
      options: [
        { label: '🕐 Horarios', value: 'horarios' },
        { label: '🚚 ¿Hacen envíos?', value: 'envios' },
        { label: '💬 Hablar con el vendedor', value: 'whatsapp' },
      ],
    },
    organicos: {
      answer: '🌿 Trabajamos con productos frescos seleccionados diariamente. Algunos son de origen orgánico y están indicados en el catálogo.',
      options: [
        { label: '🛒 ¿Cómo hago un pedido?', value: 'pedido' },
        { label: '🚚 ¿Tienen delivery?', value: 'envios' },
        { label: '💬 Hablar con el vendedor', value: 'whatsapp' },
      ],
    },
    catalogo: {
      answer: '📦 Podés ver todos nuestros productos frescos del día en el catálogo. ¡Actualizamos el stock todos los días!',
      options: [
        { label: '🛒 ¿Cómo hago un pedido?', value: 'pedido' },
        { label: '💬 Hablar con el vendedor', value: 'whatsapp' },
      ],
    },
    whatsapp: {
      answer: '📲 Te voy a conectar con nuestro vendedor ahora mismo. ¡Un momento!',
    },
  }
}

const INITIAL_OPTIONS: Option[] = [
  { label: '🕐 Horarios de atención', value: 'horarios' },
  { label: '🚚 ¿Hacen envíos?', value: 'envios' },
  { label: '📍 ¿Dónde están ubicados?', value: 'ubicacion' },
  { label: '🛒 ¿Cómo hago un pedido?', value: 'pedido' },
  { label: '💰 Costo de envío', value: 'minimo' },
  { label: '💳 Medios de pago', value: 'pagos' },
  { label: '🌿 ¿Tienen orgánicos?', value: 'organicos' },
  { label: '💬 Hablar con el vendedor', value: 'whatsapp' },
]

let nextId = 1

export function WhatsAppChat() {
  const { settings } = useSettings()
  const faq = useMemo(() => buildFAQ(settings), [settings])

  const greeting: Message = useMemo(() => ({
    id: 0,
    from: 'bot',
    text: `¡Hola! 👋 Soy el asistente de *${settings.business_name || 'Romero & Co'}*. ¿En qué te puedo ayudar?`,
    options: INITIAL_OPTIONS,
  }), [settings.business_name])

  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([greeting])
  const [pulse, setPulse] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Update greeting when settings load
  useEffect(() => {
    setMessages([greeting])
  }, [greeting])

  useEffect(() => {
    const t = setTimeout(() => setPulse(false), 3000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  function handleOption(option: Option) {
    const userMsg: Message = { id: nextId++, from: 'user', text: option.label }
    setMessages((prev) => [...prev, userMsg])

    const entry = faq[option.value]
    if (!entry) return

    setTimeout(() => {
      const botMsg: Message = {
        id: nextId++,
        from: 'bot',
        text: entry.answer,
        options: entry.options,
      }
      setMessages((prev) => [...prev, botMsg])

      if (option.value === 'whatsapp') {
        setTimeout(() => {
          openWhatsApp(settings.whatsapp_number, 'Hola! Quiero hacer una consulta.')
        }, 800)
      }
      if (option.value === 'catalogo') {
        setTimeout(() => { window.location.href = '/catalogo' }, 1200)
      }
      if (option.value === 'ubicacion' && settings.business_address?.trim()) {
        // Abrir maps después de mostrar la respuesta
        setTimeout(() => {
          const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(settings.business_address)}`
          const mapsMsg: Message = {
            id: nextId++,
            from: 'bot',
            text: '🗺️ ¿Querés abrir la dirección en Google Maps?',
            options: [
              { label: '📍 Abrir en Maps', value: '__maps__' },
              { label: 'No, gracias', value: '__back__' },
            ],
          }
          setMessages((prev) => [...prev, mapsMsg])
          // Store url for __maps__ handler
          ;(window as any).__mapsUrl = mapsUrl
        }, 600)
      }
    }, 500)
  }

  function handleSpecialOption(option: Option) {
    if (option.value === '__maps__') {
      window.open((window as any).__mapsUrl, '_blank')
      return
    }
    if (option.value === '__back__') {
      const backMsg: Message = {
        id: nextId++,
        from: 'bot',
        text: '¡Perfecto! ¿Hay algo más en lo que pueda ayudarte?',
        options: INITIAL_OPTIONS,
      }
      const userMsg: Message = { id: nextId++, from: 'user', text: option.label }
      setMessages((prev) => [...prev, userMsg, backMsg])
      return
    }
    handleOption(option)
  }

  function formatText(text: string) {
    return text.split('\n').map((line, i, arr) => (
      <span key={i}>
        {line.split(/\*(.*?)\*/g).map((part, j) =>
          j % 2 === 1 ? <strong key={j}>{part}</strong> : part,
        )}
        {i < arr.length - 1 && <br />}
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
        <div className="bg-[#075e54] px-4 py-3 flex items-center gap-3 shrink-0">
          <div className="relative">
            <img src="/logo.png" alt="Romero" className="w-10 h-10 rounded-full object-contain bg-white" />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-[#075e54]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm leading-tight truncate">
              {settings.business_name || 'Romero & Co'}
            </p>
            <p className="text-green-300 text-xs">
              {settings.business_hours || 'En línea'}
            </p>
          </div>
          <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition shrink-0">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto p-3 space-y-3"
          style={{ background: '#ece5dd' }}
        >
          {messages.map((msg) => (
            <div key={msg.id} className={cn('flex flex-col', msg.from === 'user' ? 'items-end' : 'items-start')}>
              <div className={cn(
                'max-w-[85%] px-3 py-2 rounded-2xl text-sm shadow-sm',
                msg.from === 'bot'
                  ? 'bg-white text-gray-800 rounded-tl-none'
                  : 'bg-[#dcf8c6] text-gray-800 rounded-tr-none',
              )}>
                {formatText(msg.text)}
              </div>

              {msg.options && (
                <div className="mt-2 flex flex-col gap-1.5 w-full">
                  {msg.options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleSpecialOption(opt)}
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
        <div className="bg-[#f0f0f0] px-4 py-2 flex items-center gap-2 border-t border-gray-200 shrink-0">
          <button
            onClick={() => handleOption({ label: '💬 Hablar con el vendedor', value: 'whatsapp' })}
            className="flex items-center gap-2 bg-[#25d366] text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-[#1da851] transition w-full justify-center"
          >
            <Send className="h-3.5 w-3.5" />
            Hablar con el vendedor
          </button>
        </div>
      </div>

      {/* FAB */}
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
