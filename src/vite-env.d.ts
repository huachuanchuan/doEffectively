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

type FontFamilyPreference = 'system' | 'rounded' | 'serif' | 'mono'

interface AppearancePreferences {
  fontFamily: FontFamilyPreference
  fontSize: number
  accentColor: string
  textColor: string
  glassTint: string
  motto: string
}

interface PlannerData {
  shortPlans: ShortPlan[]
  shortTasks: ShortTask[]
  longTasks: LongTask[]
  notifiedTaskIds: string[]
  preferences: AppearancePreferences
}

interface PlannerApi {
  getData: () => Promise<PlannerData>
  saveShortPlans: (plans: ShortPlan[]) => Promise<ShortPlan[]>
  saveShortTasks: (tasks: ShortTask[]) => Promise<ShortTask[]>
  saveLongTasks: (tasks: LongTask[]) => Promise<LongTask[]>
  savePreferences: (preferences: AppearancePreferences) => Promise<AppearancePreferences>
  celebrate: () => void
}

interface Window {
  plannerApi: PlannerApi
}

declare module 'canvas-confetti'
