import { ReactNode, useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  ariaLabel?: string
  closeOnOverlay?: boolean
  initialFocusRef?: React.RefObject<HTMLElement>
  className?: string
  children: ReactNode
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  ariaLabel = 'Dialog',
  closeOnOverlay = true,
  initialFocusRef,
  className = '',
  children
}: ModalProps) {
  const titleId = useId()
  const descriptionId = useId()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const previousFocus = document.activeElement as HTMLElement | null
    const focusTarget = initialFocusRef?.current ?? panelRef.current
    focusTarget?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previousFocus?.focus()
    }
  }, [isOpen, onClose, initialFocusRef])

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-[var(--transition-base)] ease-[var(--easing)] motion-reduce:transition-none"
        onClick={closeOnOverlay ? onClose : undefined}
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        aria-label={title ? undefined : ariaLabel}
        className={`relative z-[101] w-full max-w-lg rounded-ds-lg border border-border bg-card text-foreground shadow-strong transition-all duration-[var(--transition-base)] ease-[var(--easing)] motion-reduce:transition-none ${className}`}
      >
        {(title || description) && (
          <div className="px-6 pt-6">
            {title && (
              <h2 id={titleId} className="text-lg font-semibold">
                {title}
              </h2>
            )}
            {description && (
              <p id={descriptionId} className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}
        <div className="px-6 pb-6 pt-4">{children}</div>
      </div>
    </div>,
    document.body
  )
}
