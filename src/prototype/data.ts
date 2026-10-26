// Sample data for the UX prototype (G4). Fictional tasks, no real users.
// A check passes when the solution contains at least one of anyOf, and none of mustNotContain.
// It still does not run the code: the real version will run real tests on a server.
export type Check = { name: string; anyOf: string[]; mustNotContain?: string[]; tip: string }

export type Task = {
  id: string
  title: string
  minutes: number
  description: string
  examples: string[]
  starter: string
  checks: Check[]
}

export type Category = { id: string; name: string; tasks: Task[] }

const returnsValue: Check = { name: 'Returns a value', anyOf: ['return'], tip: 'Use return to give the result back.' }

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
          'The orders table has the columns customer_id and total. Write one query that returns the 3 customers who spent the most in total, highest first.',
        examples: ['Columns in the result: customer_id, spent', 'Rows: 3, sorted from the highest spent to the lowest'],
        starter: 'SELECT customer_id, SUM(total) AS spent\nFROM orders\n-- your query here',
        checks: [
          { name: 'Groups orders by customer', anyOf: ['group by customer_id'], tip: 'Add GROUP BY customer_id so SUM adds up each customer separately.' },
          { name: 'Sorts from highest to lowest', anyOf: ['order by spent desc', 'order by sum(total) desc'], tip: 'Sort with ORDER BY spent DESC.' },
          { name: 'Returns only 3 rows', anyOf: ['limit 3'], tip: 'Keep only the first 3 rows with LIMIT 3.' },
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
        description: 'Write the function onClick so that it adds 1 to count and shows the new value in the element with id "count".',
        examples: ['count is 0, onClick() runs once → the page shows 1', 'onClick() runs again → the page shows 2'],
        starter: 'let count = 0\nfunction onClick() {\n  // your code here\n}',
        checks: [
          { name: 'Increases the count', anyOf: ['count++', '++count', 'count+=1', 'count=count+1'], tip: 'Add 1 to count, for example count++.' },
          { name: 'Updates the page', anyOf: ["getelementbyid('count')", 'getelementbyid("count")', "queryselector('#count')", 'queryselector("#count")'], tip: 'Find the element with document.getElementById("count").' },
          { name: 'Shows the new value', anyOf: ['textcontent=count', 'innertext=count', 'innerhtml=count'], tip: "Set the element's textContent to count." },
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
        description: 'Complete the method sum so that it returns the sum of a and b.',
        examples: ['sum(2, 3) → 5', 'sum(-1, 1) → 0'],
        starter: 'public static int sum(int a, int b) {\n  // your code here\n}',
        checks: [
          returnsValue,
          { name: 'Adds a and b', anyOf: ['returna+b', 'returnb+a'], tip: 'Return a + b.' },
        ],
      },
      {
        id: 'java-is-even',
        title: 'Is the number even?',
        minutes: 5,
        description: 'Complete the method isEven so that it returns true when n is even and false when it is odd.',
        examples: ['isEven(4) → true', 'isEven(7) → false'],
        starter: 'public static boolean isEven(int n) {\n  // your code here\n}',
        checks: [
          returnsValue,
          { name: 'Uses the remainder of dividing by 2', anyOf: ['n%2'], tip: 'n % 2 gives the remainder after dividing by 2.' },
          { name: 'Compares the remainder with 0', anyOf: ['n%2==0', '0==n%2'], tip: 'An even number has remainder 0: n % 2 == 0.' },
        ],
      },
    ],
  },
  {
    id: 'python',
    name: 'Python',
    tasks: [
      {
        id: 'py-greet',
        title: 'Say hello',
        minutes: 5,
        description:
          'Complete the function greet so that it returns "Hello, " plus the name and "!". In Python, pass means "do nothing": replace it with a return line.',
        examples: ['greet("Anna") → "Hello, Anna!"', 'greet("Sam") → "Hello, Sam!"'],
        starter: 'def greet(name):\n    # replace pass with your code\n    pass',
        checks: [
          { ...returnsValue, mustNotContain: ['pass'], tip: 'Replace pass with a return line.' },
          { name: 'Starts with "Hello, "', anyOf: ['"hello,', "'hello,"], tip: 'The text must start with "Hello, " including the comma.' },
          { name: 'Uses the name', anyOf: ['+name', '{name}', '%name', 'format(name)'], tip: 'Put the name into the text, for example "Hello, " + name + "!".' },
          { name: 'Ends with "!"', anyOf: ['!"', "!'"], tip: 'Add "!" at the end of the text.' },
        ],
      },
      {
        id: 'py-largest',
        title: 'Largest number in a list',
        minutes: 5,
        description:
          'Complete the function largest so that it returns the biggest number in the list. You may use the built-in max() or a loop. Replace pass with your code.',
        examples: ['largest([3, 9, 2]) → 9', 'largest([-5, -1]) → -1'],
        starter: 'def largest(numbers):\n    # replace pass with your code\n    pass',
        checks: [
          { ...returnsValue, mustNotContain: ['pass'], tip: 'Replace pass with a return line.' },
          { name: 'Finds the biggest number', anyOf: ['max(numbers)', 'fornin', 'forxin', 'fornumberin'], tip: 'Use max(numbers), or loop over the list and keep the biggest value.' },
        ],
      },
    ],
  },
  { id: 'backend', name: 'Junior Backend', tasks: [] },
]

export type CheckResult = { name: string; passed: boolean; tip?: string }

// Ignores case and spaces, so "a+b" and "a + b" count the same.
const squash = (text: string) => text.toLowerCase().replace(/\s+/g, '')
// Drops comment lines (# , // , --), so "# replace pass with your code" is not read as code.
const withoutComments = (code: string) => code.replace(/^\s*(#|\/\/|--).*$/gm, '')

export function runChecks(task: Task, solution: string): CheckResult[] {
  const code = squash(withoutComments(solution))
  return task.checks.map((c) => {
    const found = c.anyOf.some((t) => code.includes(squash(t)))
    const forbidden = (c.mustNotContain ?? []).some((t) => code.includes(squash(t)))
    const passed = found && !forbidden
    return passed ? { name: c.name, passed } : { name: c.name, passed, tip: c.tip }
  })
}

export function withCustomTasks(custom: { categoryId: string; task: Task }[]): Category[] {
  return categories.map((c) => ({ ...c, tasks: [...c.tasks, ...custom.filter((t) => t.categoryId === c.id).map((t) => t.task)] }))
}

// For the MCP tool search_items (mcp/server.ts): the sample tasks whose category, title or
// description contain the query, ignoring case. An empty query lists every task.
export function searchTasks(query: string) {
  const q = query.trim().toLowerCase()
  return categories.flatMap((c) =>
    c.tasks
      .filter((t) => `${c.name} ${t.title} ${t.description}`.toLowerCase().includes(q))
      .map((t) => ({ id: t.id, category: c.name, title: t.title, minutes: t.minutes, description: t.description, checks: t.checks.map((ch) => ch.name) })),
  )
}
