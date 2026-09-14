import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

function ErrorFallback({ error, reset }: { error?: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-amz-areia dark:bg-amz-terra-dark flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-amz-terra-dark/80 rounded-xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-amz-terra/10 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-amz-terra" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-amz-terra dark:text-amz-areia mb-2">
          Algo deu errado
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Ocorreu um erro inesperado. Por favor, tente novamente.
        </p>
        <button
          onClick={reset}
          className="w-full px-6 py-3 bg-amz-terra text-white rounded-lg hover:bg-amz-terra/90 transition-colors font-semibold"
        >
          Tentar Novamente
        </button>
        {error && (
          <p className="mt-4 text-xs text-gray-400 break-all">
            {error.message}
          </p>
        )}
      </div>
    </div>
  )
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} reset={this.reset} />
    }
    return this.props.children
  }
}
