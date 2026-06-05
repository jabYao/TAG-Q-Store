import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
 label?: string
 error?: string
 helperText?: string
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
 label?: string
 error?: string
 helperText?: string
}

const baseClasses =
 'w-full px-4 py-2.5 text-sm text-carbon placeholder-gray-400 transition-colors outline-none'
const defaultBorder = 'border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary'
const errorBorder = 'border border-red-400 bg-red-50 focus:bg-white focus:ring-2 focus:ring-red-400 focus:border-red-400'
const disabledClasses = 'opacity-60 cursor-not-allowed'

export const Input = forwardRef<HTMLInputElement, InputProps>(
 ({ label, error, helperText, className = '', disabled, ...props }, ref) => {
 return (
 <div className="space-y-1">
 {label && (
 <label className="block text-xs font-medium text-carbon">
 {label}
 </label>
 )}
 <input
 ref={ref}
 disabled={disabled}
 className={`
 ${baseClasses}
 ${error ? errorBorder : defaultBorder}
 ${disabled ? disabledClasses : ''}
 ${className}
 `.trim()}
 {...props}
 />
 {error && (
 <p className="text-xs text-red-500">{error}</p>
 )}
 {helperText && !error && (
 <p className="text-xs text-gray-400">{helperText}</p>
 )}
 </div>
 )
 }
)
Input.displayName = 'Input'

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
 ({ label, error, helperText, className = '', disabled, ...props }, ref) => {
 return (
 <div className="space-y-1">
 {label && (
 <label className="block text-xs font-medium text-carbon">
 {label}
 </label>
 )}
 <textarea
 ref={ref}
 disabled={disabled}
 className={`
 ${baseClasses}
 ${error ? errorBorder : defaultBorder}
 ${disabled ? disabledClasses : ''}
 resize-y min-h-[100px]
 ${className}
 `.trim()}
 {...props}
 />
 {error && (
 <p className="text-xs text-red-500">{error}</p>
 )}
 {helperText && !error && (
 <p className="text-xs text-gray-400">{helperText}</p>
 )}
 </div>
 )
 }
)
Textarea.displayName = 'Textarea'
