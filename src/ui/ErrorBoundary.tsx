/**
 * Error Boundary Component
 * Catches React errors and provides recovery options.
 * Prevents the entire game from crashing when a modal or component fails.
 */

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  private resetTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorCount: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);

    this.props.onError?.(error, errorInfo);

    this.setState(prev => ({ errorCount: prev.errorCount + 1 }));

    // Auto-recover after 3 seconds if error count is low
    if (this.state.errorCount < 3) {
      this.resetTimeout = setTimeout(() => {
        this.handleReset();
      }, 3000);
    }
  }

  componentWillUnmount() {
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
    }
  }

  handleReset = () => {
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
      this.resetTimeout = null;
    }

    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: '20px',
              padding: '40px',
              maxWidth: '400px',
              width: '90%',
              border: '3px solid #FF5722',
              boxShadow: '0 0 40px rgba(255, 87, 34, 0.3)',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '60px' }}>🔧</span>
            <h2 style={{ color: '#FF5722', marginTop: '15px' }}>
              Oops! Something went wrong
            </h2>
            <p style={{ color: '#888', marginBottom: '25px' }}>
              Don't worry! We can fix this.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={this.handleReset}
                style={{
                  padding: '15px 30px',
                  background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                Continue Playing
              </button>

              <button
                onClick={this.handleReload}
                style={{
                  padding: '12px 25px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                  color: '#888',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                Reload Game
              </button>
            </div>

            {this.state.errorCount >= 3 && (
              <p style={{ color: '#f44336', marginTop: '20px', fontSize: '12px' }}>
                Multiple errors detected. If problems persist, try reloading.
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Game-specific error boundary for 3D scene
 * Handles WebGL context lost and other 3D rendering errors
 */
export class GameErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorCount: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[GameErrorBoundary] 3D rendering error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          }}
        >
          <span style={{ fontSize: '80px', marginBottom: '20px' }}>🎮</span>
          <h2 style={{ color: '#FFD700', marginBottom: '10px' }}>
            Game Paused
          </h2>
          <p style={{ color: '#888', marginBottom: '30px', textAlign: 'center', maxWidth: '300px' }}>
            The 3D world needs a moment to reset. Click below to continue your adventure!
          </p>
          <button
            onClick={this.handleRetry}
            style={{
              padding: '15px 40px',
              background: 'linear-gradient(135deg, #4CAF50, #45a049)',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(76, 175, 80, 0.4)',
            }}
          >
            Resume Game
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
