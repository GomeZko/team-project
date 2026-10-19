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
  {
    id: 'java',
    name: 'Java',
    tasks: [
      {
        id: 'java-sum',
        title: 'Sum of two numbers',
        minutes: 5,
        description: 'Complete the method sum so that it returns the sum of a and b. Example: sum(2, 3) returns 5.',
        starter: 'public static int sum(int a, int b) {\n  // your code here\n}',
        checks: [
          { name: 'Returns a value', mustContain: 'return' },
          { name: 'Adds a and b', mustContain: 'a + b' },
        ],
      },
      {
        id: 'java-is-even',
        title: 'Is the number even?',
        minutes: 5,
        description: 'Complete the method isEven so that it returns true when n is even and false when it is odd. Example: isEven(4) returns true.',
        starter: 'public static boolean isEven(int n) {\n  // your code here\n}',
        checks: [
          { name: 'Returns a value', mustContain: 'return' },
          { name: 'Uses the remainder of dividing by 2', mustContain: 'n % 2' },
          { name: 'Compares the remainder with 0', mustContain: '== 0' },
        ],
      },
    ],
  },
  { id: 'backend', name: 'Junior Backend', tasks: [] },
]

export type CheckResult = { name: string; passed: boolean }

// Ignores case and spaces, so "a+b" and "a + b" count the same.
const squash = (text: string) => text.toLowerCase().replace(/\s+/g, '')

export function runChecks(task: Task, solution: string): CheckResult[] {
  const code = squash(solution)
  return task.checks.map((c) => ({ name: c.name, passed: code.includes(squash(c.mustContain)) }))
}

export function withCustomTasks(custom: { categoryId: string; task: Task }[]): Category[] {
  return categories.map((c) => ({ ...c, tasks: [...c.tasks, ...custom.filter((t) => t.categoryId === c.id).map((t) => t.task)] }))
}
