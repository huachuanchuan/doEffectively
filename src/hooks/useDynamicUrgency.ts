import { useEffect, useMemo, useState } from 'react'

export interface UrgentTask extends ShortTask {
  urgencyScore: number
  urgencyColor: string
}

const PRIORITY_BASE: Record<Priority, number> = {
  1: 15,
  2: 30,
  3: 45,
  4: 60,
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function colorFromScore(score: number) {
  const hue = Math.round((1 - score / 100) * 120)
  return `hsl(${hue} 85% 45% / 0.25)`
}

function calcUrgency(task: ShortTask, now: number) {
  if (task.completed) return 0

  const dueTs = new Date(task.dueAt).getTime()
  if (Number.isNaN(dueTs)) return PRIORITY_BASE[task.priority]

  const horizon = 48 * 60 * 60 * 1000
  const msLeft = dueTs - now
  const pressure = clamp((horizon - msLeft) / horizon, 0, 1)
  const overdue = msLeft < 0 ? clamp(Math.abs(msLeft) / (24 * 60 * 60 * 1000), 0, 1) : 0

  return clamp(Math.round(PRIORITY_BASE[task.priority] + pressure * 30 + overdue * 10), 0, 100)
}

export function useDynamicUrgency(tasks: ShortTask[], tickMs = 30_000): UrgentTask[] {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now())
    }, tickMs)
    return () => window.clearInterval(timer)
  }, [tickMs])

  return useMemo(() => {
    return tasks.map(task => {
      const urgencyScore = calcUrgency(task, now)
      return {
        ...task,
        urgencyScore,
        urgencyColor: colorFromScore(urgencyScore),
      }
    })
  }, [tasks, now])
}
