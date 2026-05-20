import { Link } from 'react-router-dom'

const sections = [
  {
    title: 'Términos y Condiciones de Uso',
    content: `Al acceder y utilizar el sitio web TAG-Q (en adelante, "el Sitio"), aceptás los siguientes términos y condiciones. Si no estás de acuerdo con alguno de estos términos, te recomendamos no utilizar este sitio.

TAG-Q se reserva el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigencia inmediatamente después de su publicación en el Sitio. Es tu responsabilidad revisar periódicamente estos términos.`,
  },
  {
    title: 'Política de Privacidad',
    content: `En TAG-Q nos tomamos muy en serio la privacidad de tus datos personales. La información que nos proporcionás al registrarte o realizar una compra se utiliza exclusivamente para procesar tu pedido, mejorar tu experiencia de compra y comunicarnos con vos respecto a tu cuenta.

No compartimos tus datos personales con terceros sin tu consentimiento explícito, salvo cuando sea necesario para procesar tu pago (Wompi) o realizar la entrega del producto (empresa de mensajería).

Podés solicitar la eliminación de tus datos en cualquier momento escribiéndonos a contacto@tagq.co.`,
  },
  {
    title: 'Política de Envíos',
    content: `Realizamos envíos a todo Colombia a través de nuestras empresas de mensajería aliadas.

• El envío es GRATIS para pedidos superiores a $400.000 COP.
• Para pedidos menores a $400.000, el costo de envío es de $15.000 COP.
• El tiempo de entrega estimado es de 3 a 5 días hábiles para ciudades principales (Bogotá, Medellín, Cali, Barranquilla) y de 5 a 8 días hábiles para el resto del país.
• Una vez despachado tu pedido, recibirás un número de guía para rastrear tu envío.
• No realizamos envíos a casillas postales ni apartados aéreos.`,
  },
  {
    title: 'Política de Cambios y Devoluciones',
    content: `Aceptamos cambios y devoluciones dentro de los 30 días posteriores a la recepción del producto.

Condiciones:
• El producto debe estar sin uso, en perfecto estado y con su empaque original.
• Los relojes con personalización o grabados no tienen cambio.
• Para iniciar el proceso, contactanos a través de nuestro formulario de contacto o al WhatsApp +57 300 000 0000.
• El costo de envío de la devolución corre por cuenta del cliente, salvo que el producto presente defectos de fábrica.
• Una vez recibido y verificado el producto, realizaremos el reembolso en un plazo de 5 a 10 días hábiles.

Excepciones: No se aceptan devoluciones de productos en oferta o liquidación, salvo que presenten defectos de fabricación.`,
  },
  {
    title: 'Política de Garantía',
    content: `Todos nuestros relojes cuentan con una garantía de 2 años contra defectos de fábrica.

La garantía cubre:
• Defectos en el movimiento
• Fallas en la maquinaria
• Problemas en el cristal (no por golpes)
• Defectos en el mecanismo de cuerda o corona

La garantía no cubre:
• Daños por mal uso o golpes
• Desgaste natural de la correa
• Daños por agua en relojes no resistentes
• Pérdida o robo

Para hacer efectiva la garantía, contactanos con tu factura de compra y una descripción del problema.`,
  },
  {
    title: 'Medios de Pago',
    content: `Trabajamos con Wompi como plataforma de pagos, lo que nos permite ofrecerte múltiples opciones seguras:

• Tarjetas de crédito y débito (Visa, Mastercard, American Express)
• PSE (transferencia bancaria online)
• Nequi y Daviplata
• Efecty y Baloto
• Contraentrega (pago en efectivo al recibir el producto, con un recargo de $10.000 COP)

Todos los pagos se procesan de forma segura a través de la plataforma Wompi. No almacenamos información de tarjetas de crédito en nuestros servidores.`,
  },
]

export default function Policies() {
  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-6">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="mx-1">/</span>
        <span className="text-carbon">Políticas</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-semibold text-carbon mb-2">Políticas Legales</h1>
      <p className="text-sm text-gray-400 mb-8">Términos y condiciones de uso de TAG-Q</p>

      <div className="space-y-10">
        {sections.map((section, i) => (
          <section key={i}>
            <h2 className="text-lg md:text-xl font-semibold text-carbon mb-3">{section.title}</h2>
            <div className="text-sm text-gray-500 leading-relaxed space-y-3">
              {section.content.split('\n\n').map((paragraph, j) => (
                <p key={j}>{paragraph.trim()}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-gray-100 text-sm text-gray-400">
        <p>Última actualización: 19 de mayo, 2026</p>
        <p className="mt-1">
          Si tenés preguntas sobre estas políticas, contactanos en{' '}
          <a href="mailto:contacto@tagq.co" className="text-primary hover:underline">contacto@tagq.co</a>
        </p>
      </div>
    </div>
  )
}
