import { databaseStatus } from './lib/databaseStatus'
import Prototype from './prototype/Prototype'

// This is your start page. Change the heading to your product name in session 4.
// Then replace this page, one story at a time.
export default function App() {
  // The G4 prototype opens at /?prototype. See docs/UX.md.
  if (new URLSearchParams(window.location.search).has('prototype')) return <Prototype />

  const database = databaseStatus(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
  )

  return (
    <main>
      <h1>JobBridge</h1>
      <p className="lead">Prove your coding skills with a short task and a shareable skill report.</p>

      <p>
        <a href="?prototype">Try the prototype</a>
      </p>

      <ul className="checks">
        <li>
          <strong>Next step:</strong> open <code>docs/SETUP.md</code> and follow it.
        </li>
        <li>
          <strong>Database:</strong>{' '}
          {database === 'connected'
            ? 'connected.'
            : 'not connected. That is fine. You add one later, only if your product needs to save data.'}
        </li>
      </ul>
    </main>
  )
}
