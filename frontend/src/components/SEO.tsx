import { Helmet } from 'react-helmet-async'

interface SEOProps {
 title: string
 description?: string
 image?: string
 url?: string
 type?: 'website' | 'product' | 'article'
 publishedAt?: string
 noIndex?: boolean
}

const SITE_NAME = 'TAG-Q'
const DEFAULT_DESCRIPTION = 'Relojería de lujo en Colombia. Encuentra los mejores relojes con envío gratis desde $400.000 COP.'
const DEFAULT_IMAGE = '/og-default.jpg'
const SITE_URL = 'https://tagq.co'

export default function SEO({
 title,
 description = DEFAULT_DESCRIPTION,
 image = DEFAULT_IMAGE,
 url,
 type = 'website',
 publishedAt,
 noIndex = false,
}: SEOProps) {
 const fullTitle = `${title} | ${SITE_NAME}`
 const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL
 const fullImage = typeof image === 'string' && image.startsWith('http') ? image : `${SITE_URL}${image}`

 return (
 <Helmet>
 {/* Title & description */}
 <title>{fullTitle}</title>
 <meta name="description" content={description.slice(0, 160)} />

 {/* Canonical */}
 <link rel="canonical" href={fullUrl} />

 {/* Open Graph */}
 <meta property="og:type" content={type} />
 <meta property="og:site_name" content={SITE_NAME} />
 <meta property="og:title" content={fullTitle} />
 <meta property="og:description" content={description.slice(0, 160)} />
 <meta property="og:url" content={fullUrl} />
 <meta property="og:image" content={fullImage} />
 <meta property="og:image:width" content="1200" />
 <meta property="og:image:height" content="630" />
 <meta property="og:locale" content="es_CO" />

 {/* Twitter Card */}
 <meta name="twitter:card" content="summary_large_image" />
 <meta name="twitter:title" content={fullTitle} />
 <meta name="twitter:description" content={description.slice(0, 160)} />
 <meta name="twitter:image" content={fullImage} />

 {/* Published date (for articles/products) */}
 {publishedAt && (
 <meta property="article:published_time" content={publishedAt} />
 )}

 {/* No index */}
 {noIndex && <meta name="robots" content="noindex, nofollow" />}
 </Helmet>
 )
}
