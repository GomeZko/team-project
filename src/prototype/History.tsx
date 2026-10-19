import type { Attempt } from './store'

// S8 in the prototype: every attempt, newest first. Selecting one opens its report.
export default function History({ attempts, onOpen }: { attempts: Attempt[]; onOpen: (a: Attempt) => void }) {
  return (
    <>
      <h1>History</h1>
      {attempts.length === 0 ? (
        <p role="status">No attempts yet. Your reports appear here after you submit a task.</p>
      ) : (
        <table className="history">
          <caption>All your attempts, newest first</caption>
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Task</th>
              <th scope="col">Tests passed</th>
              <th scope="col">Score</th>
              <th scope="col"><span className="visually-hidden">Report</span></th>
            </tr>
          </thead>
          <tbody>
            {attempts.map((a) => (
              <tr key={a.id}>
                <td>{new Date(a.date).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' })}</td>
                <td>{a.taskTitle}</td>
                <td>{a.results.filter((r) => r.passed).length} of {a.results.length}</td>
                <td>{a.score} / 100</td>
                <td>
                  <button className="link" onClick={() => onOpen(a)} aria-label={`Open report: ${a.taskTitle}, ${a.score} / 100`}>
                    Open report
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}
