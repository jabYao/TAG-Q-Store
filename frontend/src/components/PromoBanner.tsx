import { Link } from 'react-router-dom'

interface PromoBannerProps {
  title: string
  subtitle: string
  cta: string
  ctaLink: string
  bgColor?: string
  accentColor?: string
}

export default function PromoBanner({
  title,
  subtitle,
  cta,
  ctaLink,
  bgColor = 'bg-carbon',
  accentColor = 'text-gold',
}: PromoBannerProps) {
  return (
    <section className={`${bgColor} text-white`}>
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10 md:py-14">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className={`text-2xl md:text-3xl font-bold mb-2 ${accentColor}`}>
              {title}
            </h3>
            <p className="text-sm text-gray-300 max-w-xl">
              {subtitle}
            </p>
          </div>
          <Link
            to={ctaLink}
            className="shrink-0 bg-gold text-carbon px-8 py-3 rounded-lg font-semibold text-sm hover:bg-[#e0c456] transition-all duration-200 whitespace-nowrap"
          >
            {cta}
          </Link>
        </div>
      </div>
    </section>
  )
}
