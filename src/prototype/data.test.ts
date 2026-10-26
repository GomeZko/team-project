import { describe, expect, it } from 'vitest'
import { categories, runChecks, searchTasks } from './data'

const task = (id: string) => categories.flatMap((c) => c.tasks).find((t) => t.id === id)!
const score = (id: string, code: string) => runChecks(task(id), code).filter((r) => r.passed).length

describe('runChecks with the demo solutions', () => {
  it.each([
    ['sql-top-customers', 'SELECT customer_id, SUM(total) AS spent\nFROM orders\nGROUP BY customer_id\nORDER BY spent DESC\nLIMIT 3', 3],
    ['fe-counter', "let count = 0\nfunction onClick() {\n  count++\n  document.getElementById('count').textContent = count\n}", 3],
    ['java-sum', 'public static int sum(int a, int b) {\n  return a + b;\n}', 2],
    ['java-is-even', 'public static boolean isEven(int n) {\n  return n % 2 == 0;\n}', 3],
    ['py-greet', 'def greet(name):\n    return "Hello, " + name + "!"', 4],
    ['py-greet', 'def greet(name):\n    return f"Hello, {name}!"', 4],
    ['py-largest', 'def largest(numbers):\n    return max(numbers)', 2],
  ])('%s passes every check', (id, code, all) => {
    expect(score(id, code)).toBe(all)
  })
})

describe('runChecks catches weak solutions (hallway test A)', () => {
  it('fails a greeting that ignores the name, and gives a tip', () => {
    const results = runChecks(task('py-greet'), 'def greet(name):\n    return "Hello!"')
    const usesName = results.find((r) => r.name === 'Uses the name')!
    expect(usesName.passed).toBe(false)
    expect(usesName.tip).toContain('name')
  })

  it('fails when pass is left in the code, but not because of the comment', () => {
    expect(runChecks(task('py-largest'), 'def largest(numbers):\n    pass\n    return max(numbers)')[0].passed).toBe(false)
    expect(runChecks(task('py-largest'), 'def largest(numbers):\n    # replace pass with your code\n    return max(numbers)')[0].passed).toBe(true)
  })

  it('accepts a loop instead of max()', () => {
    expect(score('py-largest', 'def largest(numbers):\n    best = numbers[0]\n    for n in numbers:\n        if n > best:\n            best = n\n    return best')).toBe(2)
  })
})

describe('searchTasks (MCP tool search_items)', () => {
  it('finds tasks by category, title or description, ignoring case', () => {
    expect(searchTasks('python').map((t) => t.id)).toEqual(['py-greet', 'py-largest'])
    expect(searchTasks('COUNTER').map((t) => t.id)).toEqual(['fe-counter'])
    expect(searchTasks('orders table')[0]).toMatchObject({ id: 'sql-top-customers', category: 'SQL', minutes: 15 })
  })

  it('returns nothing for an unknown word, and every task for an empty query', () => {
    expect(searchTasks('kotlin')).toEqual([])
    expect(searchTasks('  ')).toHaveLength(categories.flatMap((c) => c.tasks).length)
  })
})
