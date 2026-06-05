import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

const defaultProps = {
 xmlns: 'http://www.w3.org/2000/svg' as const,
 viewBox: '0 0 24 24',
 fill: 'none',
 stroke: 'currentColor',
 strokeWidth: 2,
 strokeLinecap: 'round' as const,
 strokeLinejoin: 'round' as const,
}

export function IconLogin({ size = 24, ...props }: IconProps) {
 return (
 <svg width={size} height={size} {...defaultProps} {...props}>
 <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
 <polyline points="10 17 15 12 10 7" />
 <line x1="15" y1="12" x2="3" y2="12" />
 </svg>
 )
}

export function IconSearch({ size = 24, ...props }: IconProps) {
 return (
 <svg width={size} height={size} {...defaultProps} {...props}>
 <circle cx="11" cy="11" r="8" />
 <line x1="21" y1="21" x2="16.65" y2="16.65" />
 </svg>
 )
}

export function IconLogout({ size = 24, ...props }: IconProps) {
 return (
 <svg width={size} height={size} {...defaultProps} {...props}>
 <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
 <polyline points="16 17 21 12 16 7" />
 <line x1="21" y1="12" x2="9" y2="12" />
 </svg>
 )
}

export function IconCart({ size = 24, ...props }: IconProps) {
 return (
 <svg width={size} height={size} {...defaultProps} {...props}>
 <circle cx="9" cy="21" r="1" />
 <circle cx="20" cy="21" r="1" />
 <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
 </svg>
 )
}

export function IconUser({ size = 24, ...props }: IconProps) {
 return (
 <svg width={size} height={size} {...defaultProps} {...props}>
 <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
 <circle cx="12" cy="7" r="4" />
 </svg>
 )
}

export function IconMenu({ size = 24, ...props }: IconProps) {
 return (
 <svg width={size} height={size} {...defaultProps} {...props}>
 <line x1="3" y1="12" x2="21" y2="12" />
 <line x1="3" y1="6" x2="21" y2="6" />
 <line x1="3" y1="18" x2="21" y2="18" />
 </svg>
 )
}

export function IconClose({ size = 24, ...props }: IconProps) {
 return (
 <svg width={size} height={size} {...defaultProps} {...props}>
 <line x1="18" y1="6" x2="6" y2="18" />
 <line x1="6" y1="6" x2="18" y2="18" />
 </svg>
 )
}

export function IconTruck({ size = 24, ...props }: IconProps) {
 return (
 <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" {...props}>
 <rect x="1" y="3" width="15" height="13" />
 <rect x="16" y="8" width="6" height="8" />
 <path d="M22 11h-6V8h2.5L22 11z" />
 <circle cx="6.5" cy="18.5" r="2.5" />
 <circle cx="18.5" cy="18.5" r="2.5" />
 <path d="M6.5 18.5h12" />
 </svg>
 )
}

export function IconReturn({ size = 24, ...props }: IconProps) {
 return (
 <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" {...props}>
 <path d="M3 12h15c3.314 0 6 2.686 6 6s-2.686 6-6 6H9" />
 <path d="M9 20l-4-4 4-4" />
 </svg>
 )
}

export function IconCreditCard({ size = 24, ...props }: IconProps) {
 return (
 <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" {...props}>
 <rect x="1" y="4" width="22" height="16" rx="2" />
 <line x1="1" y1="10" x2="23" y2="10" />
 <line x1="5" y1="15" x2="8" y2="15" />
 <line x1="13" y1="15" x2="16" y2="15" />
 </svg>
 )
}
