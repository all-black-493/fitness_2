"use client"

import { ReactNode } from 'react'

interface ErrorBoundaryProps {
    children: ReactNode
    fallback?: ReactNode
}

interface ErrorBoundaryState {
    hasError: boolean
    error: Error | null
}

import React from 'react'

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: any) {
        // Log error to monitoring service
        console.error('ErrorBoundary caught an error', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="p-4 text-center text-red-600">
                    <h2 className="text-lg font-bold">Something went wrong.</h2>
                    <pre className="mt-2 text-xs whitespace-pre-wrap">{this.state.error?.message}</pre>
                </div>
            )
        }
        return this.props.children
    }
} 