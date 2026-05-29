/// <reference types="vite/client" />

type Priority = 1 | 2 | 3 | 4

interface ShortTask {
  id: string
  title: string
  planId: string
  planDate: string
  longTaskId?: string | null
  priority: Priority
  dueAt: string
  completed: boolean
  createdAt: string
}

interface ShortPlan {
  id: string
  name: string
  planDate: string
  createdAt: string
}

interface LongTask {
  id: string
  name: string
  start: string
  end: string
  progress: number
  progressMode?: 'linked' | 'manual' | 'time'
  dependencies?: string[]
  color?: string
  completed?: boolean
  delayedAt?: string | null
}

interface PlannerData {
  shortPlans: ShortPlan[]
  shortTasks: ShortTask[]
  longTasks: LongTask[]
  notifiedTaskIds: string[]
}

interface PlannerApi {
  getData: () => Promise<PlannerData>
  saveShortPlans: (plans: ShortPlan[]) => Promise<ShortPlan[]>
  saveShortTasks: (tasks: ShortTask[]) => Promise<ShortTask[]>
  saveLongTasks: (tasks: LongTask[]) => Promise<LongTask[]>
  celebrate: () => void
  setInteractive: (interactive: boolean) => void
  toggleWidget: () => Promise<boolean>
  onInteractiveChanged: (listener: (interactive: boolean) => void) => () => void
}

interface Window {
  ipcRenderer: import('electron').IpcRenderer
  plannerApi: PlannerApi
}

declare module 'canvas-confetti'
