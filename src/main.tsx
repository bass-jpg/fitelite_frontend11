import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {error: Error | null}> {
  constructor(props: any) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{padding:'40px',fontFamily:'monospace',background:'#020617',color:'#fff',minHeight:'100vh'}}>
          <h1 style={{color:'#f97316',fontSize:'24px'}}>⚠ Erreur de rendu</h1>
          <pre style={{background:'#1e293b',padding:'20px',borderRadius:'8px',overflow:'auto',fontSize:'13px',color:'#fca5a5',marginTop:'20px'}}>
            {this.state.error.message}
            {'\n\n'}
            {this.state.error.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
)
