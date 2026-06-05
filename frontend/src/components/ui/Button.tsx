import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'gold' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
 variant?: ButtonVariant
 size?: ButtonSize
 loading?: boolean
 children: ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
 primary:
 'bg-primary text-white hover:bg-primary-dark border-transparent',
 gold:
 'bg-gold text-carbon hover:bg-gold-light border-transparent',
 outline:
 'bg-transparent text-primary border-primary hover:bg-primary hover:text-white',
 ghost:
 'bg-transparent text-carbon border-transparent hover:bg-gray-50',
}

const sizeClasses: Record<ButtonSize, string> = {
 sm: 'px-3 py-1.5 text-xs',
 md: 'px-6 py-3 text-sm',
 lg: 'px-8 py-3.5 text-base',
}

export default function Button({
 variant = 'primary',
 size = 'md',
 loading = false,
 disabled,
 className = '',
 children,
 ...props
}: ButtonProps) {
 const isDisabled = disabled || loading

 return (
 <button
 disabled={isDisabled}
 className={`
 inline-flex items-center justify-center gap-2 font-semibold
 transition-all duration-200
 border
 ${variantClasses[variant]}
 ${sizeClasses[size]}
 ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
 ${className}
 `.trim()}
 {...props}
 >
 {loading && (
 <span className="w-4 h-4 border-2 border-current border-t-transparent animate-spin" />
 )}
 {children}
 </button>
 )
}
