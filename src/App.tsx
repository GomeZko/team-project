import Prototype from './prototype/Prototype'
import SharedReport from './prototype/SharedReport'

// The start page: sign-in, then the dashboard. Screens follow docs/UX.md.
// Old links to /?prototype still work, they open the same page.
// A shared report link, /?report=<id>, opens that report without signing in.
export default function App() {
  const reportId = new URLSearchParams(window.location.search).get('report')
  return reportId ? <SharedReport id={reportId} /> : <Prototype />
}
