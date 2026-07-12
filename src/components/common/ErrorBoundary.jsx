import React from 'react';
import ErrorFallback from './ErrorFallback';

/**
 * Global React Error Boundary Component
 * Catches rendering errors, logs them, and displays fallback UI
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error details (ready for future Sentry/LogRocket integration)
    console.error('ErrorBoundary caught an unexpected rendering error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Allow custom fallback UI, default to ErrorFallback
      const FallbackComponent = this.props.fallback || ErrorFallback;
      return <FallbackComponent error={this.state.error} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
