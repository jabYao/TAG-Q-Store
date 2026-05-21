interface HeroBannerProps {
  title: string
  subtitle: string
  cta: string
  ctaLink: string
  imageUrl?: string
}

export default function HeroBanner({ title, subtitle, cta, ctaLink, imageUrl }: HeroBannerProps) {
  return (
    <section className="relative bg-gradient-to-br from-primary to-[#081d55] text-white overflow-hidden">
      {imageUrl && (
        <img
          src={imageUrl}
          alt=""
          fetchpriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
      )}
      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gold/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 lg:px-6 py-16 md:py-24 lg:py-32">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            {title}
          </h1>
          <p className="text-base md:text-lg text-gray-200 mb-8 leading-relaxed">
            {subtitle}
          </p>
          <a
            href={ctaLink}
            className="inline-block bg-gold text-carbon px-8 py-3.5 rounded-lg font-semibold text-sm hover:bg-[#e0c456] transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            {cta}
          </a>
        </div>
      </div>
    </section>
  )
}
