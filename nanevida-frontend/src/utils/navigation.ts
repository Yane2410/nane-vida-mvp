/**
 * Utilidad para navegación suave entre páginas
 * Scroll automático al top y limpieza de focus
 */

export function smoothNavigate(callback: () => void) {
  // Scroll to top con smooth behavior (ya configurado en styles.css)
  window.scrollTo({ top: 0, behavior: 'smooth' })
  
  // Limpiar focus de elementos activos
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur()
  }
  
  // Ejecutar navegación después de un frame para permitir animación
  requestAnimationFrame(() => {
    callback()
  })
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
