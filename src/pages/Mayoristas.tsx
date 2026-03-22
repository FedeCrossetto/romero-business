import { useState } from 'react'
import {
  DollarSign, Package, Truck, Headphones,
  ShoppingBag, Users, Star, CheckCircle,
  MessageCircle, ChevronRight
} from 'lucide-react'
import { useSettings } from '@/hooks/useSettings'
import { openWhatsApp } from '@/lib/whatsapp'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

const highlights = [
  { icon: DollarSign, title: 'Precios Mayoristas', desc: 'Precios especiales por volumen, muy por debajo del retail.' },
  { icon: Package,    title: 'Pedidos por Bulto y Caja', desc: 'Unidades cerradas con mejor precio garantizado.' },
  { icon: Truck,      title: 'Envíos a tu Local', desc: 'Repartimos directo a tu comercio o restaurante.' },
  { icon: Headphones, title: 'Atención Personalizada', desc: 'Un asesor dedicado para tu negocio, rápido y directo.' },
]

const benefits = [
  { icon: ShoppingBag,    title: 'Compra Mínima Accesible', desc: 'Sin mínimos exigentes. Adaptamos el pedido a tu negocio.' },
  { icon: Users,          title: 'Asesoramiento Especializado', desc: 'Te ayudamos a elegir los mejores productos según tu rubro.' },
  { icon: Star,           title: 'Calidad y Frescura Garantizada', desc: 'Seleccionamos los mejores productos frescos cada día.' },
]

const deliveryPerks = [
  'Envío sin cargo en grandes compras',
  'Entrega puntual y segura en tu horario',
  'Stock siempre fresco y variado',
  'Frecuencia de reparto a medida',
]

export function Mayoristas() {
  const { settings } = useSettings()
  const [form, setForm] = useState({ name: '', phone: '', business: '' })
  const [errors, setErrors] = useState<typeof form>({ name: '', phone: '', business: '' })

  function set(key: keyof typeof form, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
    setErrors(prev => ({ ...prev, [key]: '' }))
  }

  function validate() {
    const errs = { name: '', phone: '', business: '' }
    if (!form.name.trim())     errs.name     = 'Ingresá tu nombre'
    if (!form.phone.trim())    errs.phone    = 'Ingresá tu teléfono'
    if (!form.business.trim()) errs.business = 'Ingresá el nombre del negocio'
    setErrors(errs)
    return !Object.values(errs).some(Boolean)
  }

  function handleSend() {
    if (!validate()) return
    const msg = [
      `Hola ${settings.business_name}! Me interesa comprar al por mayor.`,
      ``,
      `*Nombre:* ${form.name}`,
      `*Teléfono:* ${form.phone}`,
      `*Negocio:* ${form.business}`,
      ``,
      `Por favor enviarme la lista de precios mayoristas. ¡Gracias!`,
    ].join('\n')
    openWhatsApp(settings.whatsapp_number, msg)
  }

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6z'/%3E%3C/g%3E%3C/svg%3E\")" }}
        />
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28 relative">
          <div className="inline-flex items-center gap-2 bg-accent-500 rounded-full px-4 py-1.5 text-sm font-bold mb-6 uppercase tracking-wide">
            ¡Precios Especiales para Comercios y Restaurantes!
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
            Mayoristas de<br />
            <span className="text-accent-300">Verdulería</span>
          </h1>
          <p className="text-xl text-primary-100 max-w-xl mb-8">
            Abastecemos restaurantes, servicios de catering, comedores, clubhouse y hoteles con productos frescos al mejor precio del mercado.
          </p>
          <a href="#cotizar">
            <Button size="lg" variant="secondary" className="text-base font-bold">
              Solicitar lista de precios
              <ChevronRight className="h-5 w-5" />
            </Button>
          </a>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 20C1080 60 360 0 0 40L0 60Z" fill="#f9fafb" />
          </svg>
        </div>
      </section>

      {/* ── DESCUENTOS DESTACADOS ── */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Grandes Descuentos por Compras Mayoristas
          </h2>
          <div className="inline-block mt-3 bg-accent-500 text-white text-sm font-bold px-5 py-1.5 rounded-full">
            ¡Ofertas Exclusivas para Negocios!
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {highlights.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-3xl p-6 shadow-card text-center flex flex-col items-center gap-3 hover:shadow-card-hover transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center">
                <Icon className="h-7 w-7 text-primary-600" />
              </div>
              <p className="font-bold text-gray-900 text-sm">{title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FORMULARIO COTIZACIÓN ── */}
      <section id="cotizar" className="bg-gradient-to-br from-primary-600 to-primary-700 py-16">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
          {/* Left copy */}
          <div className="text-white">
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-3">
              Solicitá tu Lista<br />de Precios
            </h2>
            <p className="text-accent-300 text-lg font-bold mb-6">¡Cotizá Hoy Mismo!</p>
            <ul className="space-y-3">
              {[
                'Precios actualizados cada semana',
                'Descuentos por volumen de compra',
                'Atención directa con el dueño',
                'Sin intermediarios',
              ].map(item => (
                <li key={item} className="flex items-center gap-2 text-primary-100 text-sm">
                  <CheckCircle className="h-4 w-4 text-accent-300 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Form */}
          <div className="bg-white rounded-3xl p-7 shadow-2xl space-y-4">
            <h3 className="font-bold text-gray-900 text-lg">Completá tus datos</h3>
            <Input
              id="nombre"
              label="Nombre y apellido *"
              placeholder="Juan García"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              error={errors.name}
            />
            <Input
              id="telefono"
              label="Teléfono / WhatsApp *"
              type="tel"
              placeholder="11 2233 4455"
              value={form.phone}
              onChange={e => set('phone', e.target.value)}
              error={errors.phone}
            />
            <Input
              id="negocio"
              label="Nombre del negocio *"
              placeholder="Restaurante El Jardín"
              value={form.business}
              onChange={e => set('business', e.target.value)}
              error={errors.business}
            />
            <Button size="lg" className="w-full" onClick={handleSend}>
              <MessageCircle className="h-5 w-5" />
              Solicitar Lista por WhatsApp
            </Button>
            <p className="text-xs text-center text-gray-400">
              Al tocar el botón se abre WhatsApp con tu consulta lista para enviar.
            </p>
          </div>
        </div>
      </section>

      {/* ── BENEFICIOS ── */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-10">
          Beneficios para Clientes Mayoristas
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {benefits.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-3xl p-8 shadow-card text-center flex flex-col items-center gap-4 hover:shadow-card-hover transition-shadow">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                <Icon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── REPARTOS DIARIOS ── */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-center mb-2">
            Hacemos <span className="text-accent-400">Repartos Diarios</span> a tu Comercio
          </h2>
          <p className="text-center text-gray-400 mb-10">Tu stock siempre completo, sin preocuparte por el abastecimiento</p>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Truck visual */}
            <div className="bg-gray-800 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 text-center min-h-48">
              <Truck className="h-20 w-20 text-primary-400" />
              <p className="text-primary-300 font-bold text-lg">Reparto propio todos los días</p>
              <p className="text-gray-400 text-sm">Zona GBA Sur y CABA</p>
            </div>

            {/* Perks */}
            <ul className="space-y-4">
              {deliveryPerks.map(perk => (
                <li key={perk} className="flex items-center gap-3 bg-gray-800 rounded-2xl px-5 py-4">
                  <CheckCircle className="h-5 w-5 text-primary-400 shrink-0" />
                  <span className="text-gray-200 font-medium">{perk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-accent-500 to-accent-600 rounded-3xl p-10 text-white text-center">
          <h3 className="text-3xl font-extrabold mb-3">¿Listo para abastecer tu negocio?</h3>
          <p className="text-accent-100 mb-8 max-w-lg mx-auto">
            Contactanos ahora y te enviamos nuestra lista de precios mayoristas actualizada.
          </p>
          <Button
            size="lg"
            className="bg-white text-accent-700 hover:bg-accent-50 mx-auto"
            onClick={() => openWhatsApp(settings.whatsapp_number, 'Hola! Me interesa comprar al por mayor. ¿Me podés enviar la lista de precios?')}
          >
            <MessageCircle className="h-5 w-5" />
            Consultar por WhatsApp
          </Button>
        </div>
      </section>
    </>
  )
}
