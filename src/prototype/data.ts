// Sample data for the UX prototype (G4). Fictional tasks, no real users.
export type Task = {
  id: string
  title: string
  minutes: number
  description: string
  starter: string
  // Words a solution must contain to pass each fake hidden test.
  checks: { name: string; mustContain: string }[]
}

export type Category = { id: string; name: string; tasks: Task[] }

export const categories: Category[] = [
  {
    id: 'sql',
    name: 'SQL',
    tasks: [
      {
        id: 'sql-top-customers',
        title: 'Top 3 customers by order total',
        minutes: 15,
        description:
          'The orders table has customer_id and total. Write one query that returns the 3 customers with the highest sum of total, highest first.',
        starter: 'SELECT customer_id, SUM(total) AS spent\nFROM orders\n-- your query here',
        checks: [
          { name: 'Groups orders by customer', mustContain: 'group by' },
          { name: 'Sorts from highest to lowest', mustContain: 'desc' },
          { name: 'Returns only 3 rows', mustContain: 'limit 3' },
        ],
      },
    ],
  },
  {
    id: 'frontend',
    name: 'Junior Frontend',
    tasks: [
      {
        id: 'fe-counter',
        title: 'Counter button',
        minutes: 20,
        description: 'Write a function onClick that adds 1 to count and shows the new value in the element with id "count".',
        starter: 'let count = 0\nfunction onClick() {\n  // your code here\n}',
        checks: [
          { name: 'Increases the count', mustContain: 'count++' },
          { name: 'Updates the page', mustContain: 'getelementbyid' },
        ],
      },
    ],
  },
  { id: 'backend', name: 'Junior Backend', tasks: [] },
]

export type CheckResult = { name: string; passed: boolean }

export function runChecks(task: Task, solution: string): CheckResult[] {
  const code = solution.toLowerCase().replace(/\s+/g, ' ')
  return task.checks.map((c) => ({ name: c.name, passed: code.includes(c.mustContain) }))
}
