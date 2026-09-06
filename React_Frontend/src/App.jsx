import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [rootMessage, setRootMessage] = useState('Loading...')
  const [healthStatus, setHealthStatus] = useState('Loading...')
  const [payload, setPayload] = useState('{"message":"Hello from the frontend"}')
  const [echoResponse, setEchoResponse] = useState(null)
  const [echoStatus, setEchoStatus] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function getBackendStatus() {
      try {
        const [rootResponse, healthResponse] = await Promise.all([
          window.fetch('http://localhost:8000/', { signal: controller.signal }),
          window.fetch('http://localhost:8000/health', {
            signal: controller.signal,
          }),
        ])

        if (!rootResponse.ok || !healthResponse.ok) {
          throw new Error('Unable to read the backend status')
        }

        const rootData = await rootResponse.json()
        const healthData = await healthResponse.json()
        setRootMessage(rootData.message)
        setHealthStatus(healthData.status)
      } catch (error) {
        if (error.name !== 'AbortError') {
          setRootMessage(error.message || 'Backend unavailable')
          setHealthStatus('Unavailable')
        }
      }
    }

    getBackendStatus()

    return () => controller.abort()
  }, [])

  async function handleEcho(event) {
    event.preventDefault()
    setEchoStatus('Sending...')
    setEchoResponse(null)

    try {
      const response = await window.fetch('http://localhost:8000/echo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.detail || `HTTP error: ${response.status}`)
      }

      setEchoResponse(result)
      setEchoStatus('Echo received')
    } catch (error) {
      setEchoStatus(error.message || 'Unable to send payload')
    }
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <p className="eyebrow">Local service console</p>
        <h1>Hello world</h1>
        <p className="intro">A small React frontend connected to the demo backend.</p>
      </header>

      <section className="status-panel" aria-labelledby="backend-status-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Connection</p>
            <h2 id="backend-status-heading">Demo Backend</h2>
          </div>
          <span className={`status-dot ${healthStatus === 'ok' ? 'is-online' : ''}`} />
        </div>
        <div className="status-grid">
          <div>
            <span className="label">Message</span>
            <p>{rootMessage}</p>
          </div>
          <div>
            <span className="label">Health</span>
            <p>{healthStatus}</p>
          </div>
        </div>
      </section>

      <section className="echo-panel" aria-labelledby="echo-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Request lab</p>
            <h2 id="echo-heading">Echo a JSON payload</h2>
          </div>
          <span className="endpoint">POST /echo</span>
        </div>
        <form onSubmit={handleEcho}>
          <label htmlFor="echo-payload">Payload</label>
          <textarea
            id="echo-payload"
            value={payload}
            onChange={(event) => setPayload(event.target.value)}
            rows={6}
          />
          <div className="form-footer">
            <span className="form-status" role="status">{echoStatus}</span>
            <button type="submit">Send request</button>
          </div>
        </form>

        {echoResponse && (
          <div className="response-block">
            <span className="label">Response</span>
            <pre>{JSON.stringify(echoResponse, null, 2)}</pre>
          </div>
        )}
      </section>
    </main>
  )
}

export default App
