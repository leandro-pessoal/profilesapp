import { useEffect, useState } from 'react'
import personalizeLogo from '/Arch_Amazon-Personalize_64.svg'
import './App.css'

function App() {
  const [userId, setUserId] = useState('76')
  const [recs, setRecs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function fetchRecommendations(id) {
    setLoading(true)
    setError(null)
    setRecs([])
    try {
      const url = `https://7waziao4cc.execute-api.us-east-1.amazonaws.com/get_recomendation?userId=${encodeURIComponent(
        id,
      )}`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setRecs(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // fetch default recommendations on mount
    if (userId) fetchRecommendations(userId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="App">
      <header style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={personalizeLogo} className="logo personalize" alt="React personalize" />
        </a>
        <h1 style={{ margin: 0 }}>Recommendations</h1>
      </header>

      <section style={{ marginTop: 18 }}>
        <label>
          User ID:{' '}
          <input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            style={{ width: 100 }}
          />
        </label>
        <button
          onClick={() => fetchRecommendations(userId)}
          style={{ marginLeft: 12 }}
        >
          Get recommendations
        </button>
      </section>

      <section style={{ marginTop: 18 }}>
        {loading && <p>Loading recommendations…</p>}
        {error && (
          <p style={{ color: 'crimson' }}>Error fetching: {error}</p>
        )}

        {!loading && !error && recs.length === 0 && (
          <p>No recommendations yet.</p>
        )}

        {recs.length > 0 && (
          <ol>
            {recs.map((r) => (
              <li key={r.movieId} style={{ marginBottom: 8 }}>
                <div>
                  <strong>{r.title}</strong> — <em>{r.genres}</em>
                </div>
                <div style={{ fontSize: 12, color: '#555' }}>
                  Rank: {r.rank} • Score: {r.score}
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  )
}

export default App
