import { useEffect, useState } from 'react'
import type { CheckResult } from './data'
import { openSharedReport, type SharedReport as Report } from './store'

export function ResultList({ results }: { results: CheckResult[] }) {
  return (
    <ul className="results">
      {results.map((r) => (
        <li key={r.name}>
          {r.passed ? '✅' : '❌'} {r.name}
          {r.tip && <span className="tip"> Tip: {r.tip}</span>}
        </li>
      ))}
    </ul>
  )
}

// FR8: the page an employer opens from a report link. No account needed, and no name or email on it.
export default function SharedReport({ id }: { id: string }) {
  const [report, setReport] = useState<Report | null | 'loading'>('loading')

  useEffect(() => {
    let current = true
    openSharedReport(id)
      .catch(() => null)
      .then((found) => {
        if (current) setReport(found)
      })
    return () => {
      current = false
    }
  }, [id])

  return (
    <>
      <header className="topbar">
        <strong className="brand">JobBridge</strong>
      </header>
      <main>
        {report === 'loading' && <p className="hint">Loading…</p>}
        {report === null && (
          <>
            <h1>Skill report</h1>
            <p className="error" role="alert">We could not open this report. The link may be wrong, or the report is not shared.</p>
          </>
        )}
        {report && report !== 'loading' && (
          <>
            <h1>Skill report</h1>
            <p className="lead">{report.taskTitle} · {new Date(report.date).toLocaleDateString('en-GB')}</p>
            <h2>Score: {report.score} / 100</h2>
            <h3>Automated tests: {report.results.filter((r) => r.passed).length} of {report.results.length} passed</h3>
            <ResultList results={report.results} />
            <p className="hint">Prototype: the checks look for key parts of the code, they do not run it yet, and the score is not independently verified.</p>
          </>
        )}
      </main>
    </>
  )
}
