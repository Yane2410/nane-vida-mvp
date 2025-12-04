import { ReactNode, memo } from 'react'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}

const EmptyState = memo(function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="text-6xl mb-4 opacity-50">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-slate-700 dark:text-slate-200 mb-6 max-w-md">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  )
})

export default EmptyState
