import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('JAVERISA could not start because the #root element is missing from index.html.')
}

if (import.meta.env.DEV) {
  console.info('[JAVERISA] Starting React application.')
  window.addEventListener('error', (event) => {
    console.error('[JAVERISA] Browser runtime error:', event.error || event.message)
  })
  window.addEventListener('unhandledrejection', (event) => {
    console.error('[JAVERISA] Unhandled promise rejection:', event.reason)
  })
}

class AppErrorBoundary extends React.Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('[JAVERISA] Application rendering failed:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="startup-error" role="alert">
          <span className="eyebrow">JAVERISA</span>
          <h1>We couldn’t open the storefront.</h1>
          <p>The application hit an error while rendering. Check the browser console for details, then reload the page.</p>
          {import.meta.env.DEV && <p>For local development, start the app with <code>npm run dev</code> and open Vite’s URL.</p>}
        </main>
      )
    }
    return this.props.children
  }
}

try {
  createRoot(rootElement).render(
    <React.StrictMode>
      <AppErrorBoundary>
        <HashRouter>
          <App />
        </HashRouter>
      </AppErrorBoundary>
    </React.StrictMode>,
  )
} catch (error) {
  console.error('[JAVERISA] Application startup failed:', error)
  rootElement.innerHTML = '<main class="startup-error" role="alert"><span class="eyebrow">JAVERISA</span><h1>We couldn’t start the storefront.</h1><p>Check the browser console for the startup error, then reload the page.</p><p>For local development, run <code>npm run dev</code> and open Vite’s URL.</p></main>'
}