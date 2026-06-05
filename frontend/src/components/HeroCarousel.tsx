import { useState, useEffect } from 'react'

export interface HeroSlide {
 title: string
 subtitle?: string | null
 cta: string
 ctaLink: string
 imageUrl?: string | null
}

interface HeroCarouselProps {
 slides: HeroSlide[]
 interval?: number
}

export default function HeroCarousel({ slides, interval = 5000 }: HeroCarouselProps) {
 const [current, setCurrent] = useState(0)

 useEffect(() => {
 if (slides.length <= 1) return
 const id = setInterval(() => {
 setCurrent((prev) => (prev + 1) % slides.length)
 }, interval)
 return () => clearInterval(id)
 }, [slides.length, interval])

 if (!slides.length) return null

 const slide = slides[current]

 return (
 <section className="relative bg-gradient-to-br from-black to-[#1a1a1a] text-white overflow-hidden">
 {/* Background image */}
 {slide.imageUrl && (
 <img
 src={slide.imageUrl}
 alt=""
 fetchPriority={current === 0 ? 'high' : undefined}
 className="absolute inset-0 w-full h-full object-cover opacity-55"
 />
 )}
 {/* Pattern overlay */}
 <div className="absolute inset-0 opacity-10">
 <div className="absolute top-10 left-10 w-72 h-72 bg-gold/30 blur-3xl" />
 <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 blur-3xl" />
 </div>

 <div className="relative max-w-7xl mx-auto px-4 lg:px-6 py-20 md:py-30 lg:py-[238px]">
 <div className="max-w-2xl transition-all duration-500">
 <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
 {slide.title}
 </h1>
 {slide.subtitle && (
 <p className="text-base md:text-lg text-gray-200 mb-8 leading-relaxed">
 {slide.subtitle}
 </p>
 )}
 <a
 href={slide.ctaLink}
 className="inline-block bg-gold text-carbon px-8 py-3.5 font-semibold text-sm hover:bg-gold-light transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
 >
 {slide.cta}
 </a>
 </div>

 {/* Dots */}
 {slides.length > 1 && (
 <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
 {slides.map((_, i) => (
 <button
 key={i}
 onClick={() => setCurrent(i)}
 className={`w-2 h-2 transition-all duration-300 ${
 i === current ? 'bg-gold w-6' : 'bg-white/40 hover:bg-white/60'
 }`}
 aria-label={`Slide ${i + 1}`}
 />
 ))}
 </div>
 )}
 </div>
 </section>
 )
}
