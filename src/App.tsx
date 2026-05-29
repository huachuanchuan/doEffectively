import { type CSSProperties, type FormEvent, useEffect, useMemo, useState } from 'react'
import confetti from 'canvas-confetti'
import { useDynamicUrgency } from './hooks/useDynamicUrgency'
import './App.css'

const PRIORITY_OPTIONS: Array<{ value: Priority, label: string, short: string }> = [
  { value: 4, label: '立即处理', short: '急' },
  { value: 3, label: '很紧急', short: '紧' },
  { value: 2, label: '重要推进', short: '重' },
  { value: 1, label: '常规安排', short: '常' },
]

const STORAGE_KEY = 'glass-planner-data'

function todayInputDate() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function formatPlanDate(date: Date) {
  const year = date.getFullYear().toString()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}${month}${day}`
}

function toInputDate(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function addDays(value: string, days: number) {
  const date = parseInputDate(value) ?? new Date()
  date.setDate(date.getDate() + days)
  return toInputDate(date)
}

function toDueIso(planDate: string, timeHHMM: string) {
  const year = Number(planDate.slice(0, 4))
  const month = Number(planDate.slice(4, 6)) - 1
  const day = Number(planDate.slice(6, 8))
  const [hourRaw, minuteRaw] = timeHHMM.split(':')
  const hour = Number(hourRaw)
  const minute = Number(minuteRaw)
  const safeHour = Number.isFinite(hour) ? hour : 23
  const safeMinute = Number.isFinite(minute) ? minute : 59
  return new Date(year, month, day, safeHour, safeMinute, 0).toISOString()
}

function displayPlanDate(planDate: string) {
  if (planDate.length === 8) {
    return `${planDate.slice(0, 4)}-${planDate.slice(4, 6)}-${planDate.slice(6, 8)}`
  }
  return planDate
}

function displayDueTime(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '时间未设置'
  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function toInputTime(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '21:00'
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  return `${hour}:${minute}`
}

function priorityMeta(priority: Priority) {
  return PRIORITY_OPTIONS.find(item => item.value === priority) ?? PRIORITY_OPTIONS[3]
}

function planTitle(planDate: string) {
  return `${displayPlanDate(planDate)} 计划`
}

function normalizeShortTasks(tasks: ShortTask[]) {
  return tasks.map((task) => {
    const dueDate = new Date(task.dueAt)
    const fallbackPlanDate = Number.isNaN(dueDate.getTime()) ? formatPlanDate(new Date()) : formatPlanDate(dueDate)
    const normalizedPlanDate = task.planDate || fallbackPlanDate
    const normalizedPlanId = task.planId || `legacy-${normalizedPlanDate}`
    return {
      ...task,
      planId: normalizedPlanId,
      planDate: normalizedPlanDate,
      dueAt: task.dueAt || toDueIso(normalizedPlanDate, '23:59'),
      createdAt: task.createdAt || new Date().toISOString(),
      longTaskId: task.longTaskId ?? null,
    }
  })
}

function normalizeShortPlans(plans: ShortPlan[]) {
  return plans.map((plan) => {
    const createdAt = plan.createdAt || new Date().toISOString()
    const derivedDate = formatPlanDate(new Date(createdAt))
    return {
      ...plan,
      name: plan.name?.trim() || '未命名计划',
      planDate: plan.planDate || derivedDate,
      createdAt,
    }
  })
}

function reconcileShortPlanData(shortPlans: ShortPlan[], shortTasks: ShortTask[]) {
  const normalizedPlans = normalizeShortPlans(shortPlans)
  const normalizedTasks = normalizeShortTasks(shortTasks)
  const planMap = new Map(normalizedPlans.map(plan => [plan.id, plan]))

  for (const task of normalizedTasks) {
    if (!planMap.has(task.planId)) {
      planMap.set(task.planId, {
        id: task.planId,
        name: planTitle(task.planDate),
        planDate: task.planDate,
        createdAt: task.createdAt,
      })
    }
  }

  return {
    plans: [...planMap.values()].sort((left, right) => right.createdAt.localeCompare(left.createdAt)),
    tasks: normalizedTasks,
  }
}

function normalizeLongTasks(tasks: LongTask[]) {
  return tasks.map(task => ({
    ...task,
    progress: typeof task.progress === 'number' ? Math.max(0, Math.min(100, task.progress)) : 0,
    progressMode: task.progressMode ?? 'linked',
    completed: task.completed ?? false,
    delayedAt: task.delayedAt ?? null,
  }))
}

function parseInputDate(value: string) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return null
  const [, year, month, day] = match
  return new Date(Number(year), Number(month) - 1, Number(day), 0, 0, 0, 0)
}

function timeProgress(task: LongTask, now = new Date()) {
  if (task.completed) return 100

  const start = parseInputDate(task.start)
  const end = parseInputDate(task.end)
  if (!start || !end) return task.progress

  const endExclusive = new Date(end)
  endExclusive.setDate(endExclusive.getDate() + 1)

  const total = Math.max(1, endExclusive.getTime() - start.getTime())
  const elapsed = now.getTime() - start.getTime()
  return Math.max(0, Math.min(100, Math.round((elapsed / total) * 100)))
}

function isLongTaskOverdue(task: LongTask, today = todayInputDate()) {
  return !task.completed && task.end < today
}

function createBrowserPlannerApi(): PlannerApi {
  const read = (): PlannerData => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) throw new Error('No local data')
      return JSON.parse(raw) as PlannerData
    } catch {
      return {
        shortPlans: [],
        shortTasks: [],
        longTasks: [],
        notifiedTaskIds: [],
      }
    }
  }

  const write = (data: PlannerData) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  return {
    getData: async () => read(),
    saveShortPlans: async (plans) => {
      const data = read()
      write({ ...data, shortPlans: plans })
      return plans
    },
    saveShortTasks: async (tasks) => {
      const data = read()
      write({ ...data, shortTasks: tasks })
      return tasks
    },
    saveLongTasks: async (tasks) => {
      const data = read()
      write({ ...data, longTasks: tasks })
      return tasks
    },
    celebrate: () => undefined,
    setInteractive: () => undefined,
    toggleWidget: async () => true,
    onInteractiveChanged: () => () => undefined,
  }
}

function fireCelebration() {
  const endAt = Date.now() + 1400
  const launch = () => {
    confetti({
      particleCount: 6,
      spread: 70,
      startVelocity: 45,
      origin: { x: Math.random(), y: Math.random() * 0.35 + 0.2 },
      zIndex: 9999,
    })
    if (Date.now() < endAt) {
      requestAnimationFrame(launch)
    }
  }
  launch()
}

function App() {
  const plannerApi = useMemo(() => window.plannerApi ?? createBrowserPlannerApi(), [])
  const [shortPlans, setShortPlans] = useState<ShortPlan[]>([])
  const [shortTasks, setShortTasks] = useState<ShortTask[]>([])
  const [longTasks, setLongTasks] = useState<LongTask[]>([])
  const [dataReady, setDataReady] = useState(false)
  const [clockTick, setClockTick] = useState(() => Date.now())

  const [showShortPlanCreator, setShowShortPlanCreator] = useState(false)
  const [newShortPlanName, setNewShortPlanName] = useState('')
  const [activeTaskCreatorPlanId, setActiveTaskCreatorPlanId] = useState<string | null>(null)
  const [newShortTaskTitle, setNewShortTaskTitle] = useState('')
  const [newShortTaskTime, setNewShortTaskTime] = useState('21:00')
  const [newShortPriority, setNewShortPriority] = useState<Priority>(3)
  const [newShortLongTaskId, setNewShortLongTaskId] = useState('')
  const [editingShortPlanId, setEditingShortPlanId] = useState<string | null>(null)
  const [editShortPlanName, setEditShortPlanName] = useState('')
  const [editingShortTaskId, setEditingShortTaskId] = useState<string | null>(null)
  const [editShortTaskTitle, setEditShortTaskTitle] = useState('')
  const [editShortTaskTime, setEditShortTaskTime] = useState('21:00')
  const [editShortPriority, setEditShortPriority] = useState<Priority>(3)
  const [editShortLongTaskId, setEditShortLongTaskId] = useState('')

  const [showLongCreator, setShowLongCreator] = useState(false)
  const [newLongName, setNewLongName] = useState('')
  const [newLongStartDate, setNewLongStartDate] = useState(todayInputDate())
  const [newLongEndDate, setNewLongEndDate] = useState(todayInputDate())
  const [editingLongTaskId, setEditingLongTaskId] = useState<string | null>(null)
  const [editLongName, setEditLongName] = useState('')
  const [editLongStartDate, setEditLongStartDate] = useState(todayInputDate())
  const [editLongEndDate, setEditLongEndDate] = useState(todayInputDate())

  const urgentShortTasks = useDynamicUrgency(shortTasks)

  const longTaskMap = useMemo(
    () => new Map(longTasks.map(task => [task.id, task])),
    [longTasks],
  )

  const longTaskStats = useMemo(() => {
    const map = new Map<string, { total: number, completed: number }>()
    for (const task of shortTasks) {
      if (!task.longTaskId) continue
      const current = map.get(task.longTaskId) ?? { total: 0, completed: 0 }
      current.total += 1
      if (task.completed) current.completed += 1
      map.set(task.longTaskId, current)
    }
    return map
  }, [shortTasks])

  function displayLongProgress(task: LongTask) {
    if (task.completed) return 100
    return timeProgress(task, new Date(clockTick))
  }

  const shortPlanTaskMap = useMemo(() => {
    const map = new Map<string, typeof urgentShortTasks>()
    for (const task of urgentShortTasks) {
      const existing = map.get(task.planId) ?? []
      existing.push(task)
      map.set(task.planId, existing)
    }

    for (const entry of map.values()) {
      entry.sort((left, right) => {
        if (left.completed !== right.completed) {
          return left.completed ? 1 : -1
        }
        return right.urgencyScore - left.urgencyScore
      })
    }

    return map
  }, [urgentShortTasks])

  const orderedShortPlans = useMemo(
    () => shortPlans.slice().sort((left, right) => right.createdAt.localeCompare(left.createdAt)),
    [shortPlans],
  )

  const orderedLongTasks = useMemo(
    () => longTasks.slice().sort((left, right) => {
      if (left.completed !== right.completed) return left.completed ? 1 : -1
      return left.end.localeCompare(right.end)
    }),
    [longTasks],
  )

  const { activeShortPlanCards, doneShortPlanCards } = useMemo(() => {
    const activeCards: Array<{ plan: ShortPlan, tasks: typeof urgentShortTasks }> = []
    const doneCards: Array<{ plan: ShortPlan, tasks: typeof urgentShortTasks }> = []

    for (const plan of orderedShortPlans) {
      const tasks = shortPlanTaskMap.get(plan.id) ?? []
      if (tasks.length > 0 && tasks.every(task => task.completed)) {
        doneCards.push({ plan, tasks })
      } else {
        activeCards.push({ plan, tasks })
      }
    }

    return { activeShortPlanCards: activeCards, doneShortPlanCards: doneCards }
  }, [orderedShortPlans, shortPlanTaskMap])

  const stats = useMemo(() => {
    const now = clockTick
    const today = todayInputDate()
    const overdueShortPlanIds = new Set(
      activeShortPlanCards
        .filter(({ tasks }) => tasks.some(task => !task.completed && new Date(task.dueAt).getTime() < now))
        .map(({ plan }) => plan.id),
    )
    const completedLong = longTasks.filter(task => task.completed).length
    const overdueLong = longTasks.filter(task => isLongTaskOverdue(task, today)).length
    return {
      shortPending: activeShortPlanCards.length - overdueShortPlanIds.size,
      shortCompleted: doneShortPlanCards.length,
      shortOverdue: overdueShortPlanIds.size,
      longPlanning: longTasks.length - completedLong - overdueLong,
      longCompleted: completedLong,
      longOverdue: overdueLong,
    }
  }, [activeShortPlanCards, clockTick, doneShortPlanCards, longTasks])

  useEffect(() => {
    if (window.location.hash === '#celebrate') {
      fireCelebration()
      return
    }

    plannerApi.getData()
      .then((data) => {
        const normalizedLong = normalizeLongTasks(data.longTasks ?? [])
        const validLongIds = new Set(normalizedLong.map(task => task.id))
        const { plans: normalizedShortPlans, tasks: normalizedShort } = reconcileShortPlanData(
          data.shortPlans ?? [],
          data.shortTasks ?? [],
        )
        const cleanedShort = normalizedShort.map(task => ({
          ...task,
          longTaskId: task.longTaskId && validLongIds.has(task.longTaskId) ? task.longTaskId : null,
        }))

        setShortPlans(normalizedShortPlans)
        setShortTasks(cleanedShort)
        setLongTasks(normalizedLong)

        void plannerApi.saveShortPlans(normalizedShortPlans)
        void plannerApi.saveShortTasks(cleanedShort)
        void plannerApi.saveLongTasks(normalizedLong)
      })
      .finally(() => {
        setDataReady(true)
      })
  }, [plannerApi])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setClockTick(Date.now())
    }, 60 * 1000)

    return () => window.clearInterval(timer)
  }, [])

  function shouldCelebrateTodayPlan(tasks: ShortTask[]) {
    const todayPlanDate = formatPlanDate(new Date())
    const todayTasks = tasks.filter(task => task.planDate === todayPlanDate)
    if (!todayTasks.length) return false
    return todayTasks.every(task => task.completed)
  }

  async function addShortPlan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const name = newShortPlanName.trim()
    if (!name) return

    const planDate = formatPlanDate(new Date())
    const plan: ShortPlan = {
      id: crypto.randomUUID(),
      name,
      planDate,
      createdAt: new Date().toISOString(),
    }

    const next = [plan, ...shortPlans]
    setShortPlans(next)
    await plannerApi.saveShortPlans(next)
    setNewShortPlanName('')
    setShowShortPlanCreator(false)
  }

  async function deleteShortPlan(planId: string) {
    const nextPlans = shortPlans.filter(plan => plan.id !== planId)
    const nextTasks = shortTasks.filter(task => task.planId !== planId)
    setShortPlans(nextPlans)
    setShortTasks(nextTasks)
    await plannerApi.saveShortPlans(nextPlans)
    await plannerApi.saveShortTasks(nextTasks)
  }

  function startEditShortPlan(plan: ShortPlan) {
    setActiveTaskCreatorPlanId(null)
    setEditingShortTaskId(null)
    setEditingShortPlanId(plan.id)
    setEditShortPlanName(plan.name)
  }

  async function saveShortPlanEdit(event: FormEvent<HTMLFormElement>, planId: string) {
    event.preventDefault()
    const name = editShortPlanName.trim()
    if (!name) return

    const next = shortPlans.map(plan => plan.id === planId ? { ...plan, name } : plan)
    setShortPlans(next)
    await plannerApi.saveShortPlans(next)
    setEditingShortPlanId(null)
    setEditShortPlanName('')
  }

  async function addShortTask(event: FormEvent<HTMLFormElement>, plan: ShortPlan) {
    event.preventDefault()
    const title = newShortTaskTitle.trim()
    if (!title) return

    const planDate = plan.planDate || formatPlanDate(new Date())
    const task: ShortTask = {
      id: crypto.randomUUID(),
      title,
      planId: plan.id,
      planDate,
      priority: newShortPriority,
      dueAt: toDueIso(planDate, newShortTaskTime),
      completed: false,
      createdAt: new Date().toISOString(),
      longTaskId: newShortLongTaskId || null,
    }

    const next = [task, ...shortTasks]
    setShortTasks(next)
    await plannerApi.saveShortTasks(next)
    setNewShortTaskTitle('')
    setNewShortLongTaskId('')
    setActiveTaskCreatorPlanId(null)
  }

  async function toggleShortTask(taskId: string, checked: boolean) {
    const next = shortTasks.map(task => task.id === taskId ? { ...task, completed: checked } : task)
    setShortTasks(next)
    await plannerApi.saveShortTasks(next)

    if (checked && shouldCelebrateTodayPlan(next)) {
      fireCelebration()
      plannerApi.celebrate()
    }
  }

  async function deleteShortTask(taskId: string) {
    const next = shortTasks.filter(task => task.id !== taskId)
    setShortTasks(next)
    await plannerApi.saveShortTasks(next)
  }

  function startEditShortTask(task: ShortTask) {
    setActiveTaskCreatorPlanId(null)
    setEditingShortPlanId(null)
    setEditingShortTaskId(task.id)
    setEditShortTaskTitle(task.title)
    setEditShortTaskTime(toInputTime(task.dueAt))
    setEditShortPriority(task.priority)
    setEditShortLongTaskId(task.longTaskId ?? '')
  }

  async function saveShortTaskEdit(event: FormEvent<HTMLFormElement>, task: ShortTask) {
    event.preventDefault()
    const title = editShortTaskTitle.trim()
    if (!title) return

    const next = shortTasks.map(item => item.id === task.id
      ? {
        ...item,
        title,
        priority: editShortPriority,
        dueAt: toDueIso(item.planDate, editShortTaskTime),
        longTaskId: editShortLongTaskId || null,
      }
      : item)

    setShortTasks(next)
    await plannerApi.saveShortTasks(next)
    setEditingShortTaskId(null)
    setEditShortTaskTitle('')
    setEditShortLongTaskId('')
  }

  function toggleTaskCreator(planId: string) {
    setEditingShortPlanId(null)
    setEditingShortTaskId(null)
    setNewShortTaskTitle('')
    setNewShortTaskTime('21:00')
    setNewShortPriority(3)
    setNewShortLongTaskId('')
    setActiveTaskCreatorPlanId(current => current === planId ? null : planId)
  }

  function openShortPlanCreator() {
    setEditingShortPlanId(null)
    setShowShortPlanCreator(value => !value)
  }

  function openLongCreator() {
    setEditingLongTaskId(null)
    setShowLongCreator(value => !value)
  }

  async function addLongTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const name = newLongName.trim()
    if (!name) return

    const start = newLongStartDate || todayInputDate()
    const end = newLongEndDate >= start ? newLongEndDate : start
    const task: LongTask = {
      id: crypto.randomUUID(),
      name,
      start,
      end,
      progress: 0,
      progressMode: 'time',
      completed: false,
      delayedAt: null,
    }

    const next = [...longTasks, task]
    setLongTasks(next)
    await plannerApi.saveLongTasks(next)
    setNewLongName('')
    setNewLongStartDate(todayInputDate())
    setNewLongEndDate(todayInputDate())
    setShowLongCreator(false)
  }

  async function updateLongTasks(next: LongTask[]) {
    setLongTasks(next)
    await plannerApi.saveLongTasks(next)
  }

  async function toggleLongTask(taskId: string, checked: boolean) {
    const next = longTasks.map(task => task.id === taskId
      ? {
        ...task,
        completed: checked,
        progress: checked ? 100 : Math.min(task.progress, 95),
        progressMode: 'time' as const,
      }
      : task)

    await updateLongTasks(next)
  }

  async function delayLongTask(taskId: string) {
    const next = longTasks.map(task => task.id === taskId
      ? {
        ...task,
        end: addDays(task.end, 7),
        completed: false,
        delayedAt: new Date().toISOString(),
        progress: 0,
        progressMode: 'time' as const,
      }
      : task)

    await updateLongTasks(next)
  }

  function startEditLongTask(task: LongTask) {
    setShowLongCreator(false)
    setEditingLongTaskId(task.id)
    setEditLongName(task.name)
    setEditLongStartDate(task.start || todayInputDate())
    setEditLongEndDate(task.end || todayInputDate())
  }

  async function saveLongTaskEdit(event: FormEvent<HTMLFormElement>, taskId: string) {
    event.preventDefault()
    const name = editLongName.trim()
    if (!name) return

    const start = editLongStartDate || todayInputDate()
    const end = editLongEndDate >= start ? editLongEndDate : start
    const next = longTasks.map(task => task.id === taskId
      ? { ...task, name, start, end, progressMode: 'time' as const }
      : task)

    await updateLongTasks(next)
    setEditingLongTaskId(null)
    setEditLongName('')
  }

  async function deleteLongTask(taskId: string) {
    const nextLong = longTasks.filter(task => task.id !== taskId)
    const nextShort = shortTasks.map(task => task.longTaskId === taskId ? { ...task, longTaskId: null } : task)
    setShortTasks(nextShort)
    await plannerApi.saveShortTasks(nextShort)
    await updateLongTasks(nextLong)
  }

  if (window.location.hash === '#celebrate') {
    return <div className='celebration-canvas' />
  }

  return (
    <div className='widget-shell'>
      <header className='widget-header'>
        <div className='title-stack'>
          <h1>计划小组件</h1>
        </div>
      </header>

      <div className='stats-strip short-stats' aria-label='短期计划总览'>
        <div className='stats-row'>
          <span className='stats-label'>短期</span>
          <div className='stat-pill'>
            <strong>{stats.shortPending}</strong>
            <span>待办</span>
          </div>
          <div className='stat-pill stat-good'>
            <strong>{stats.shortCompleted}</strong>
            <span>已完成</span>
          </div>
          <div className='stat-pill stat-alert'>
            <strong>{stats.shortOverdue}</strong>
            <span>已逾期</span>
          </div>
        </div>
      </div>

      <section className='panel-block short-panel' aria-labelledby='short-title'>
        <div className='panel-title-row'>
          <div>
            <h2 id='short-title'>短期计划</h2>
            <p>短任务可以关联长期规划，完成后自动推进进度</p>
          </div>
          <button
            type='button'
            className='icon-button add-button'
            onClick={openShortPlanCreator}
            aria-label='添加短期计划'
            title='添加短期计划'
          >
            +
          </button>
        </div>

        {showShortPlanCreator && (
          <form className='inline-add-form' onSubmit={addShortPlan}>
            <input
              value={newShortPlanName}
              onChange={event => setNewShortPlanName(event.target.value)}
              placeholder='例如：今天收尾 / 周四复盘'
              autoFocus
            />
            <button type='submit' className='submit-button'>创建</button>
          </form>
        )}

        <div className='short-plan-scroll'>
          {!dataReady && <div className='empty-state'>正在载入计划...</div>}

          {dataReady && activeShortPlanCards.length > 0 && activeShortPlanCards.map(({ plan, tasks }) => (
            <article key={plan.id} className='plan-card short-plan-card'>
              <div className='plan-card-header'>
                {editingShortPlanId === plan.id
                  ? (
                    <form
                      className='edit-title-form'
                      onSubmit={(event) => {
                        void saveShortPlanEdit(event, plan.id)
                      }}
                    >
                      <input
                        value={editShortPlanName}
                        onChange={event => setEditShortPlanName(event.target.value)}
                        autoFocus
                        aria-label='修改短期计划名称'
                      />
                      <button type='submit' className='submit-button mini-action'>保存</button>
                      <button
                        type='button'
                        className='submit-button mini-action'
                        onClick={() => setEditingShortPlanId(null)}
                      >
                        取消
                      </button>
                    </form>
                  )
                  : (
                    <div className='plan-card-meta'>
                      <h3>{plan.name}</h3>
                      <small>{displayPlanDate(plan.planDate)} · {tasks.filter(task => !task.completed).length} 项待办</small>
                    </div>
                  )}
                <div className='card-actions'>
                  <button
                    type='button'
                    className='icon-button ghost-button edit-button'
                    aria-label='修改计划'
                    title='修改计划'
                    onClick={() => startEditShortPlan(plan)}
                  >
                    改
                  </button>
                  <button
                    type='button'
                    className='icon-button ghost-button'
                    aria-label='添加任务'
                    title='添加任务'
                    onClick={() => toggleTaskCreator(plan.id)}
                  >
                    +
                  </button>
                  <button
                    type='button'
                    className='icon-button ghost-button danger-button'
                    aria-label='删除计划'
                    title='删除计划'
                    onClick={() => {
                      void deleteShortPlan(plan.id)
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>

              {activeTaskCreatorPlanId === plan.id && (
                <form
                  className='creator-form task-creator-form'
                  onSubmit={(event) => {
                    void addShortTask(event, plan)
                  }}
                >
                  <input
                    value={newShortTaskTitle}
                    onChange={event => setNewShortTaskTitle(event.target.value)}
                    placeholder='输入任务名称'
                    autoFocus
                  />
                  <div className='creator-grid task-creator-grid'>
                    <input
                      type='time'
                      value={newShortTaskTime}
                      onChange={event => setNewShortTaskTime(event.target.value)}
                      aria-label='截止时间'
                    />
                    <select
                      value={newShortPriority}
                      onChange={event => setNewShortPriority(Number(event.target.value) as Priority)}
                      aria-label='优先级'
                    >
                      {PRIORITY_OPTIONS.map(item => (
                        <option key={item.value} value={item.value}>{item.label}</option>
                      ))}
                    </select>
                    <select
                      value={newShortLongTaskId}
                      onChange={event => setNewShortLongTaskId(event.target.value)}
                      aria-label='关联长期规划'
                    >
                      <option value=''>不关联长期规划</option>
                      {longTasks.filter(task => !task.completed).map(task => (
                        <option key={task.id} value={task.id}>{task.name}</option>
                      ))}
                    </select>
                    <button type='submit' className='submit-button'>添加</button>
                  </div>
                </form>
              )}

              {tasks.length > 0
                ? (
                  <div className='task-list plan-task-list'>
                    {tasks.map(task => {
                      const meta = priorityMeta(task.priority)
                      const longTask = task.longTaskId ? longTaskMap.get(task.longTaskId) : null
                      if (editingShortTaskId === task.id) {
                        return (
                          <form
                            key={task.id}
                            className='creator-form task-edit-form'
                            onSubmit={(event) => {
                              void saveShortTaskEdit(event, task)
                            }}
                          >
                            <input
                              value={editShortTaskTitle}
                              onChange={event => setEditShortTaskTitle(event.target.value)}
                              autoFocus
                              aria-label='修改任务名称'
                            />
                            <div className='creator-grid task-edit-grid'>
                              <input
                                type='time'
                                value={editShortTaskTime}
                                onChange={event => setEditShortTaskTime(event.target.value)}
                                aria-label='修改截止时间'
                              />
                              <select
                                value={editShortPriority}
                                onChange={event => setEditShortPriority(Number(event.target.value) as Priority)}
                                aria-label='修改优先级'
                              >
                                {PRIORITY_OPTIONS.map(item => (
                                  <option key={item.value} value={item.value}>{item.label}</option>
                                ))}
                              </select>
                              <select
                                value={editShortLongTaskId}
                                onChange={event => setEditShortLongTaskId(event.target.value)}
                                aria-label='修改关联长期规划'
                              >
                                <option value=''>不关联长期规划</option>
                                {longTasks.filter(item => !item.completed || item.id === task.longTaskId).map(item => (
                                  <option key={item.id} value={item.id}>{item.name}</option>
                                ))}
                              </select>
                              <button type='submit' className='submit-button mini-action'>保存</button>
                              <button
                                type='button'
                                className='submit-button mini-action'
                                onClick={() => setEditingShortTaskId(null)}
                              >
                                取消
                              </button>
                            </div>
                          </form>
                        )
                      }
                      return (
                        <div
                          key={task.id}
                          className={task.completed ? 'task-item task-item-complete' : 'task-item'}
                          style={{ '--urgency': task.urgencyColor } as CSSProperties}
                        >
                          <label className='task-check'>
                            <input
                              type='checkbox'
                              checked={task.completed}
                              onChange={event => {
                                void toggleShortTask(task.id, event.target.checked)
                              }}
                            />
                            <span aria-hidden='true' />
                          </label>
                          <div className='task-meta'>
                            <span>{task.title}</span>
                            <small>
                              <b>{meta.short}</b> {meta.label} · 截止 {displayDueTime(task.dueAt)}
                              {longTask ? ` · 关联 ${longTask.name}` : ' · 无长期关联'}
                            </small>
                          </div>
                          <button
                            type='button'
                            className='icon-button ghost-button edit-button'
                            aria-label='修改任务'
                            title='修改任务'
                            onClick={() => startEditShortTask(task)}
                          >
                            改
                          </button>
                          <button
                            type='button'
                            className='icon-button ghost-button danger-button'
                            aria-label='删除任务'
                            title='删除任务'
                            onClick={() => {
                              void deleteShortTask(task.id)
                            }}
                          >
                            ×
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )
                : <div className='empty-state plan-empty-state'>这个计划还没有任务</div>}
            </article>
          ))}

          {dataReady && activeShortPlanCards.length === 0 && !showShortPlanCreator && (
            <div className='empty-state'>还没有短期计划，进入编辑模式后创建第一项</div>
          )}

          {doneShortPlanCards.length > 0 && (
            <details className='collapse-block short-done-collapse'>
              <summary>已完成的短期计划 <span>{doneShortPlanCards.length}</span></summary>
              {doneShortPlanCards.map(({ plan, tasks }) => (
                <div key={plan.id} className='collapse-row'>
                  {editingShortPlanId === plan.id
                    ? (
                      <form
                        className='collapse-edit-form'
                        onSubmit={(event) => {
                          void saveShortPlanEdit(event, plan.id)
                        }}
                      >
                        <input
                          value={editShortPlanName}
                          onChange={event => setEditShortPlanName(event.target.value)}
                          autoFocus
                          aria-label='修改已完成短期计划名称'
                        />
                        <button type='submit' className='submit-button mini-action'>保存</button>
                        <button
                          type='button'
                          className='submit-button mini-action'
                          onClick={() => setEditingShortPlanId(null)}
                        >
                          取消
                        </button>
                      </form>
                    )
                    : (
                      <>
                        <strong>{plan.name}</strong>
                        <span>{tasks.length} 项完成</span>
                        <button
                          type='button'
                          className='icon-button ghost-button edit-button'
                          aria-label='修改已完成计划'
                          title='修改已完成计划'
                          onClick={() => startEditShortPlan(plan)}
                        >
                          改
                        </button>
                      </>
                    )}
                </div>
              ))}
            </details>
          )}
        </div>
      </section>

      <div className='stats-strip long-stats' aria-label='长期规划总览'>
        <div className='stats-row'>
          <span className='stats-label'>长期</span>
          <div className='stat-pill'>
            <strong>{stats.longPlanning}</strong>
            <span>规划</span>
          </div>
          <div className='stat-pill stat-good'>
            <strong>{stats.longCompleted}</strong>
            <span>已完成</span>
          </div>
          <div className='stat-pill stat-alert'>
            <strong>{stats.longOverdue}</strong>
            <span>已逾期</span>
          </div>
        </div>
      </div>

      <section className='panel-block long-panel' aria-labelledby='long-title'>
        <div className='panel-title-row'>
          <div>
            <h2 id='long-title'>长期规划</h2>
            <p>按起止时间自动推算进度，100% 后选择完成或延期</p>
          </div>
          <button
            type='button'
            className='icon-button add-button'
            onClick={openLongCreator}
            aria-label='添加长期规划'
            title='添加长期规划'
          >
            +
          </button>
        </div>

        <div className='long-panel-scroll'>
          {showLongCreator && (
            <form className='creator-form' onSubmit={addLongTask}>
              <input
                value={newLongName}
                onChange={event => setNewLongName(event.target.value)}
                placeholder='例如：论文初稿 / 产品发布'
                autoFocus
              />
              <div className='creator-grid long-creator-grid'>
                <input
                  type='date'
                  value={newLongStartDate}
                  onChange={event => setNewLongStartDate(event.target.value)}
                  aria-label='开始日期'
                />
                <input
                  type='date'
                  value={newLongEndDate}
                  onChange={event => setNewLongEndDate(event.target.value)}
                  aria-label='结束日期'
                />
                <button type='submit' className='submit-button'>创建</button>
              </div>
            </form>
          )}

          {dataReady && orderedLongTasks.length > 0
            ? orderedLongTasks.map(task => {
              const linked = longTaskStats.get(task.id) ?? { total: 0, completed: 0 }
              const progress = displayLongProgress(task)
              const canResolve = progress >= 100 && !task.completed
              if (editingLongTaskId === task.id) {
                return (
                  <article key={task.id} className='long-card long-edit-card'>
                    <form
                      className='creator-form long-edit-form'
                      onSubmit={(event) => {
                        void saveLongTaskEdit(event, task.id)
                      }}
                    >
                      <input
                        value={editLongName}
                        onChange={event => setEditLongName(event.target.value)}
                        autoFocus
                        aria-label='修改长期规划名称'
                      />
                      <div className='creator-grid long-edit-grid'>
                        <input
                          type='date'
                          value={editLongStartDate}
                          onChange={event => setEditLongStartDate(event.target.value)}
                          aria-label='修改开始日期'
                        />
                        <input
                          type='date'
                          value={editLongEndDate}
                          onChange={event => setEditLongEndDate(event.target.value)}
                          aria-label='修改结束日期'
                        />
                        <button type='submit' className='submit-button mini-action'>保存</button>
                        <button
                          type='button'
                          className='submit-button mini-action'
                          onClick={() => setEditingLongTaskId(null)}
                        >
                          取消
                        </button>
                      </div>
                    </form>
                  </article>
                )
              }
              return (
                <article key={task.id} className={task.completed ? 'long-card long-card-complete' : 'long-card'}>
                  <div className='long-card-head'>
                    <div>
                      <h3>{task.name}</h3>
                      <small>{task.start} 至 {task.end}</small>
                    </div>
                    <strong>{progress}%</strong>
                  </div>
                  <div className='long-progress-row'>
                    <div className='progress-track' aria-label={`${task.name} 进度 ${progress}%`}>
                      <span style={{ width: `${progress}%` }} />
                    </div>
                    <div className='long-card-actions'>
                      {task.completed
                        ? (
                          <button
                            type='button'
                            className='submit-button compact-action'
                            onClick={() => {
                              void toggleLongTask(task.id, false)
                            }}
                          >
                            恢复
                          </button>
                        )
                        : canResolve
                          ? (
                            <>
                              <button
                                type='button'
                                className='submit-button compact-action'
                                onClick={() => {
                                  void toggleLongTask(task.id, true)
                                }}
                              >
                                完成
                              </button>
                              <button
                                type='button'
                                className='submit-button compact-action delay-action'
                                onClick={() => {
                                  void delayLongTask(task.id)
                                }}
                              >
                                延期 7 天
                              </button>
                            </>
                          )
                          : (
                            <button
                              type='button'
                              className='submit-button compact-action delay-action'
                              onClick={() => {
                                void delayLongTask(task.id)
                              }}
                            >
                              延期 7 天
                            </button>
                          )}
                      <button
                        type='button'
                        className='submit-button compact-action edit-action'
                        onClick={() => startEditLongTask(task)}
                      >
                        修改
                      </button>
                      <button
                        type='button'
                        className='icon-button ghost-button danger-button compact-delete'
                        aria-label='删除长期规划'
                        title='删除长期规划'
                        onClick={() => {
                          void deleteLongTask(task.id)
                        }}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  <div className='long-card-meta'>
                    <span>关联任务 {linked.completed}/{linked.total}</span>
                    <span>{task.completed ? '已完成' : canResolve ? '等待确认' : task.delayedAt ? '已延期' : '推进中'}</span>
                  </div>
                </article>
              )
            })
            : dataReady && !showLongCreator && <div className='empty-state'>还没有长期规划，创建后可在短期任务里关联它</div>}
        </div>
      </section>
    </div>
  )
}

export default App
