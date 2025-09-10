import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

/**
 * ErrorBoundary: Shows a simple fallback UI if a child throws during render.
 */
class ErrorBoundary extends React.Component {
  // PUBLIC_INTERFACE
  /** Renders children and catches errors to avoid blank screen on runtime exceptions. */
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('Runtime error caught by ErrorBoundary:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 16, fontFamily: 'sans-serif' }}>
          <h2>Something went wrong.</h2>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#b00020' }}>
            {String(this.state.error)}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

// Ensure a root element exists (some wrapper hosts like preview.html may lack #root)
let rootEl = document.getElementById('root');
if (!rootEl) {
  rootEl = document.createElement('div');
  rootEl.id = 'root';
  document.body.appendChild(rootEl);
  // eslint-disable-next-line no-console
  console.warn('No #root element found. Created one dynamically for mount.');
}

const root = ReactDOM.createRoot(rootEl);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
