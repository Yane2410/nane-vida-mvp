interface SkeletonProps {
  className?: string
  rounded?: 'sm' | 'md' | 'lg' | 'full'
}

const roundedMap = {
  sm: 'rounded-ds-sm',
  md: 'rounded-ds-md',
  lg: 'rounded-ds-lg',
  full: 'rounded-full'
}

export default function Skeleton({ className = 'h-4 w-full', rounded = 'md' }: SkeletonProps) {
  return (
    <div
      className={`bg-muted ${roundedMap[rounded]} ${className} animate-pulse motion-reduce:animate-none`}
      aria-hidden="true"
    />
  )
}
