import { describe, expect, it } from 'vitest'
import { clock, duration } from './time'

describe('time on a task', () => {
  it('shows the time left as minutes and seconds', () => {
    expect(clock(754)).toBe('12:34')
    expect(clock(20 * 60)).toBe('20:00')
    expect(clock(5)).toBe('00:05')
  })

  it('never shows negative time', () => {
    expect(clock(-3)).toBe('00:00')
  })

  it('writes the time taken in words for the report', () => {
    expect(duration(552)).toBe('9 min 12 s')
    expect(duration(45)).toBe('45 s')
    expect(duration(1200)).toBe('20 min 0 s')
  })
})
