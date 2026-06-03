import { Link } from 'react-router-dom'

interface PromoBannerProps {
  title: string
  subtitle: string
  cta: string
  ctaLink: string
  imageUrl?: string | null
  bgColor?: string
  accentColor?: string
}

export default function PromoBanner({
  title,
  subtitle,
  cta,
  ctaLink,
  imageUrl,
  bgColor = 'bg-carbon',
  accentColor = 'text-gold',
}: PromoBannerProps) {
  return (
    <section className={`relative overflow-hidden ${bgColor} text-white`}>
      {/* Background image — 16:9 crop, ocupa ~75% del ancho desde la derecha */}
      {imageUrl && (
        <div className="absolute inset-0 flex justify-end">
          <div
            className="w-3/4 h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${imageUrl})`, aspectRatio: '16/9' }}
          />
        </div>
      )}

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 lg:px-6 py-12 md:py-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <h3 className={`text-2xl md:text-3xl font-bold mb-2 ${accentColor}`}>
              {title}
            </h3>
            <p className="text-sm text-gray-300">
              {subtitle}
            </p>
          </div>
          <Link
            to={ctaLink}
            className="shrink-0 bg-gold text-carbon px-8 py-3 rounded-lg font-semibold text-sm hover:bg-gold-light transition-all duration-200 whitespace-nowrap"
          >
            {cta}
          </Link>
        </div>
      </div>
    </section>
  )
}
