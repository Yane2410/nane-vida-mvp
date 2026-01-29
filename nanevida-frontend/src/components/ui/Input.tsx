import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef, useId, ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helper?: string
  error?: string
  icon?: ReactNode
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helper, error, icon, leftIcon, rightIcon, className = '', ...props }, ref) => {
    const generatedId = useId()
    const inputId = props.id || (label ? `input-${generatedId}` : undefined)
    const errorId = inputId ? `${inputId}-error` : undefined
    const helperId = inputId ? `${inputId}-help` : undefined
    const describedBy = [error ? errorId : null, !error && helper ? helperId : null]
      .filter(Boolean)
      .join(' ') || undefined
    const effectiveLeftIcon = leftIcon ?? icon

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {effectiveLeftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {effectiveLeftIcon}
            </div>
          )}
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {rightIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full px-4 py-3 ${effectiveLeftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''} rounded-ds-sm border border-input bg-card text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent transition-[border,box-shadow] duration-[var(--transition-fast)] ease-[var(--easing)] disabled:cursor-not-allowed disabled:opacity-50 ${error ? 'border-error focus-visible:ring-error' : ''} ${className}`}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            {...props}
          />
        </div>
        {error && (
          <p id={errorId} className="mt-1 text-xs text-error">
            {error}
          </p>
        )}
        {!error && helper && (
          <p id={helperId} className="mt-1 text-xs text-muted-foreground">
            {helper}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  helper?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helper, error, className = '', ...props }, ref) => {
    const generatedId = useId()
    const textareaId = props.id || (label ? `textarea-${generatedId}` : undefined)
    const errorId = textareaId ? `${textareaId}-error` : undefined
    const helperId = textareaId ? `${textareaId}-help` : undefined
    const describedBy = [error ? errorId : null, !error && helper ? helperId : null]
      .filter(Boolean)
      .join(' ') || undefined

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-foreground mb-2"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`w-full px-4 py-3 rounded-ds-sm border border-input bg-card text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent transition-[border,box-shadow] duration-[var(--transition-fast)] ease-[var(--easing)] resize-none disabled:cursor-not-allowed disabled:opacity-50 ${error ? 'border-error focus-visible:ring-error' : ''} ${className}`}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          {...props}
        />
        {error && (
          <p id={errorId} className="mt-1 text-xs text-error">
            {error}
          </p>
        )}
        {!error && helper && (
          <p id={helperId} className="mt-1 text-xs text-muted-foreground">
            {helper}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
