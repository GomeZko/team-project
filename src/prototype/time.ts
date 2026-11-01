// Time on a task (S9). The timer is soft: when time is up the person can still submit,
// and the report shows how long they took next to the limit.

// 754 seconds → "12:34"
export function clock(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds))
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

// 552 seconds → "9 min 12 s", 45 → "45 s"
export function duration(seconds: number): string {
  const s = Math.max(0, Math.round(seconds))
  const min = Math.floor(s / 60)
  return min === 0 ? `${s} s` : `${min} min ${s % 60} s`
}
