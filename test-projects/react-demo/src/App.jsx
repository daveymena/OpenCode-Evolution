import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState('')

  const handleClick = () => {
    setCount(count + 1)
    setMessage(`¡Has hecho clic ${count + 1} veces!`)
    console.log('Contador actualizado:', count + 1)
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🎨 OpenCode Preview Demo</h1>
        <p className="subtitle">Previsualizador Profesional en Acción</p>
      </header>

      <main className="main">
        <div className="card">
          <h2>Contador Interactivo</h2>
          <div className="counter-display">
            <span className="count">{count}</span>
          </div>
          <button onClick={handleClick} className="button">
            Incrementar Contador
          </button>
          {message && (
            <p className="message">{message}</p>
          )}
        </div>

        <div className="features">
          <h3>✨ Características del Previsualizador</h3>
          <ul>
            <li>✅ Hot Reload en tiempo real</li>
            <li>✅ Consola integrada para logs</li>
            <li>✅ Vista responsive (Desktop, Tablet, Mobile)</li>
            <li>✅ Soporte multi-lenguaje</li>
            <li>✅ Ejecución en la nube</li>
          </ul>
        </div>

        <div className="info">
          <h3>🚀 Frameworks Soportados</h3>
          <div className="frameworks">
            <span className="badge">React</span>
            <span className="badge">Vue</span>
            <span className="badge">Angular</span>
            <span className="badge">Svelte</span>
            <span className="badge">Next.js</span>
            <span className="badge">Python</span>
            <span className="badge">Go</span>
            <span className="badge">Node.js</span>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>Hecho con ❤️ por OpenCode Evolved</p>
      </footer>
    </div>
  )
}

export default App
