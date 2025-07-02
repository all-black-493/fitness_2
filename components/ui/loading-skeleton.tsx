import { cn } from '@/lib/utils'

interface LoadingSkeletonProps {
    className?: string
    variant?: 'bar' | 'block'
}

export function LoadingSkeleton({ className, variant = 'bar' }: LoadingSkeletonProps) {
    return (
        <div
            className={cn(
                'animate-pulse bg-muted rounded',
                variant === 'bar' ? 'h-4 w-full' : 'h-24 w-full',
                className
            )}
            aria-busy="true"
            aria-label="Loading..."
        />
    )
} 