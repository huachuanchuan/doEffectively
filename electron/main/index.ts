import {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  Menu,
  nativeImage,
  Notification,
  screen,
  shell,
  Tray,
} from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import os from 'node:os'
import { existsSync } from 'node:fs'
import { execFile } from 'node:child_process'
import Store from 'electron-store'
import * as liquidGlass from '@hicccc77/electron-liquid-glass'
import type { GlassPanel } from '@hicccc77/electron-liquid-glass'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '../..')

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

if (os.release().startsWith('6.1')) app.disableHardwareAcceleration()

if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

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

type PlannerStoreShape = {
  get<K extends keyof PlannerData>(key: K): PlannerData[K]
  set<K extends keyof PlannerData>(key: K, value: PlannerData[K]): void
  readonly store: PlannerData
}

const WIDGET_WIDTH = 530
const WIDGET_HEIGHT = 620
const WIDGET_RADIUS = 32
const MAX_SHORT_PLANS = 500
const MAX_SHORT_TASKS = 5000
const MAX_LONG_TASKS = 1000
const DEFAULT_PREFERENCES: AppearancePreferences = {
  fontFamily: 'system',
  fontSize: 14,
  accentColor: '#2f7cff',
  textColor: '#17334d',
  glassTint: '#bfeeff',
  motto: '把今天的行动，放进长期的节奏里',
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function cleanText(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function cleanIso(value: unknown, fallback = new Date().toISOString()) {
  if (typeof value !== 'string') return fallback
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? fallback : date.toISOString()
}

function cleanInputDate(value: unknown) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return ''
  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime()) ? '' : value
}

function cleanPlanDate(value: unknown) {
  return typeof value === 'string' && /^\d{8}$/.test(value) ? value : ''
}

function cleanHexColor(value: unknown, fallback: string) {
  return typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value) ? value.toLowerCase() : fallback
}

function sanitizePreferences(value: unknown): AppearancePreferences {
  if (!isRecord(value)) return { ...DEFAULT_PREFERENCES }
  const fontFamily = ['system', 'rounded', 'serif', 'mono'].includes(String(value.fontFamily))
    ? value.fontFamily as FontFamilyPreference
    : DEFAULT_PREFERENCES.fontFamily
  const rawFontSize = typeof value.fontSize === 'number' && Number.isFinite(value.fontSize)
    ? value.fontSize
    : DEFAULT_PREFERENCES.fontSize

  return {
    fontFamily,
    fontSize: Math.max(12, Math.min(18, Math.round(rawFontSize))),
    accentColor: cleanHexColor(value.accentColor, DEFAULT_PREFERENCES.accentColor),
    textColor: cleanHexColor(value.textColor, DEFAULT_PREFERENCES.textColor),
    glassTint: cleanHexColor(value.glassTint, DEFAULT_PREFERENCES.glassTint),
    motto: cleanText(value.motto, 120) || DEFAULT_PREFERENCES.motto,
  }
}

function sanitizeShortPlans(value: unknown): ShortPlan[] {
  if (!Array.isArray(value)) return []
  return value.slice(0, MAX_SHORT_PLANS).flatMap((item) => {
    if (!isRecord(item)) return []
    const id = cleanText(item.id, 128)
    const name = cleanText(item.name, 160)
    const planDate = cleanPlanDate(item.planDate)
    if (!id || !name || !planDate) return []
    return [{ id, name, planDate, createdAt: cleanIso(item.createdAt) }]
  })
}

function sanitizeShortTasks(value: unknown): ShortTask[] {
  if (!Array.isArray(value)) return []
  return value.slice(0, MAX_SHORT_TASKS).flatMap((item) => {
    if (!isRecord(item)) return []
    const id = cleanText(item.id, 128)
    const title = cleanText(item.title, 240)
    const planId = cleanText(item.planId, 128)
    const planDate = cleanPlanDate(item.planDate)
    const priority = Number(item.priority)
    if (!id || !title || !planId || !planDate || ![1, 2, 3, 4].includes(priority)) return []
    const longTaskId = item.longTaskId == null ? null : cleanText(item.longTaskId, 128) || null
    return [{
      id,
      title,
      planId,
      planDate,
      longTaskId,
      priority: priority as Priority,
      dueAt: cleanIso(item.dueAt),
      completed: item.completed === true,
      createdAt: cleanIso(item.createdAt),
    }]
  })
}

function sanitizeLongTasks(value: unknown): LongTask[] {
  if (!Array.isArray(value)) return []
  return value.slice(0, MAX_LONG_TASKS).flatMap((item) => {
    if (!isRecord(item)) return []
    const id = cleanText(item.id, 128)
    const name = cleanText(item.name, 240)
    const start = cleanInputDate(item.start)
    const end = cleanInputDate(item.end)
    if (!id || !name || !start || !end) return []
    const rawProgress = typeof item.progress === 'number' && Number.isFinite(item.progress) ? item.progress : 0
    const progressMode = item.progressMode === 'manual' || item.progressMode === 'time' ? item.progressMode : 'linked'
    return [{
      id,
      name,
      start,
      end: end < start ? start : end,
      progress: Math.max(0, Math.min(100, rawProgress)),
      progressMode,
      completed: item.completed === true,
      delayedAt: item.delayedAt == null ? null : cleanIso(item.delayedAt, ''),
    }]
  })
}

const plannerStoreBase = new Store<PlannerData>({
  name: 'planner-data',
  defaults: {
    shortPlans: [],
    shortTasks: [],
    longTasks: [],
    notifiedTaskIds: [],
    preferences: DEFAULT_PREFERENCES,
  },
})
const plannerStore = plannerStoreBase as unknown as PlannerStoreShape

let win: BrowserWindow | null = null
let tray: Tray | null = null
let celebrateWin: BrowserWindow | null = null
let reminderTimer: NodeJS.Timeout | null = null
let glassPanel: GlassPanel | null = null
let glassPanelDpr = 0
let isQuitting = false
let snapCorner: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' = 'top-right'
let snapTimer: NodeJS.Timeout | null = null
let bottomTimer: NodeJS.Timeout | null = null
let programmaticMoveTimer: NodeJS.Timeout | null = null
let isProgrammaticMove = false

const preload = path.join(__dirname, '../preload/index.mjs')
const indexHtml = path.join(RENDERER_DIST, 'index.html')

function roundedWindowShape(width: number, height: number, radius: number) {
  const safeRadius = Math.max(0, Math.min(radius, Math.floor(Math.min(width, height) / 2)))
  const rows: Electron.Rectangle[] = []
  let spanStart = 0
  let previousInset = -1

  for (let y = 0; y < height; y += 1) {
    const edgeY = y < safeRadius ? safeRadius - y - 0.5 : y >= height - safeRadius ? y - (height - safeRadius) + 0.5 : 0
    const inset = edgeY > 0
      ? Math.ceil(safeRadius - Math.sqrt(Math.max(0, safeRadius * safeRadius - edgeY * edgeY)))
      : 0

    if (previousInset !== -1 && inset !== previousInset) {
      rows.push({ x: previousInset, y: spanStart, width: width - previousInset * 2, height: y - spanStart })
      spanStart = y
    }
    previousInset = inset
  }

  rows.push({ x: previousInset, y: spanStart, width: width - previousInset * 2, height: height - spanStart })
  return rows.filter(row => row.width > 0 && row.height > 0)
}

function applyRoundedWindowShape(target: BrowserWindow) {
  if (process.platform !== 'win32' || target.isDestroyed()) return
  const { width, height } = target.getContentBounds()
  target.setShape(roundedWindowShape(width, height, WIDGET_RADIUS))
}

function physicalWidgetBounds(target: BrowserWindow) {
  return screen.dipToScreenRect(target, target.getBounds())
}

function destroyGlassPanel() {
  glassPanel?.destroy()
  glassPanel = null
  glassPanelDpr = 0
}

function ensureGlassPanel(target: BrowserWindow) {
  if (glassPanel || target.isDestroyed()) return

  try {
    if (process.platform === 'win32' && liquidGlass.isSupported()) {
      const bounds = physicalWidgetBounds(target)
      const dpr = screen.getDisplayMatching(target.getBounds()).scaleFactor
      glassPanel = liquidGlass.createPanel({
        ...bounds,
        dpr,
        cornerRadius: WIDGET_RADIUS * dpr,
        blurSigma: 2.4 * dpr,
        displacementScale: 54 * dpr,
        aberrationIntensity: 1.2,
        saturation: 1.18,
        excludeFromCapture: true,
        anchorWindow: target,
      })
      glassPanelDpr = glassPanel ? dpr : 0
    }
  } catch {
    glassPanel = null
  }

  if (!glassPanel && process.platform === 'win32') {
    target.setBackgroundMaterial('acrylic')
  }
}

function syncGlassPanelBounds(target = win) {
  if (!target || target.isDestroyed()) return
  if (!glassPanel) {
    ensureGlassPanel(target)
    return
  }

  const dpr = screen.getDisplayMatching(target.getBounds()).scaleFactor
  if (Math.abs(dpr - glassPanelDpr) > 0.01) {
    destroyGlassPanel()
    ensureGlassPanel(target)
    return
  }

  glassPanel.setBounds(physicalWidgetBounds(target))
  glassPanel.anchor(target)
}

function getCornerPosition(target: BrowserWindow, corner: typeof snapCorner) {
  const { workArea } = screen.getDisplayMatching(target.getBounds())
  const margin = 0
  const bounds = target.getBounds()
  const left = workArea.x + margin
  const right = workArea.x + workArea.width - bounds.width - margin
  const top = workArea.y + margin
  const bottom = workArea.y + workArea.height - bounds.height - margin

  return {
    x: corner.endsWith('right') ? right : left,
    y: corner.startsWith('bottom') ? bottom : top,
  }
}

function snapWidgetToCorner(target: BrowserWindow, corner = snapCorner) {
  const position = getCornerPosition(target, corner)
  const x = Math.round(position.x)
  const y = Math.round(position.y)
  const bounds = target.getBounds()

  snapCorner = corner

  if (Math.abs(bounds.x - x) <= 1 && Math.abs(bounds.y - y) <= 1) {
    return
  }

  if (programmaticMoveTimer) clearTimeout(programmaticMoveTimer)
  isProgrammaticMove = true
  target.setPosition(x, y, false)
  programmaticMoveTimer = setTimeout(() => {
    isProgrammaticMove = false
    programmaticMoveTimer = null
  }, 160)
}

function nearestSnapCorner(target: BrowserWindow) {
  const bounds = target.getBounds()
  const { workArea } = screen.getDisplayMatching(bounds)
  const centerX = bounds.x + bounds.width / 2
  const centerY = bounds.y + bounds.height / 2
  const horizontal = centerX < workArea.x + workArea.width / 2 ? 'left' : 'right'
  const vertical = centerY < workArea.y + workArea.height / 2 ? 'top' : 'bottom'
  return `${vertical}-${horizontal}` as typeof snapCorner
}

function scheduleSnap(target: BrowserWindow) {
  if (isProgrammaticMove) return
  if (snapTimer) clearTimeout(snapTimer)
  snapTimer = setTimeout(() => {
    snapTimer = null
    if (!target.isDestroyed()) {
      snapWidgetToCorner(target, nearestSnapCorner(target))
    }
  }, 520)
}

function nativeWindowHandle(target: BrowserWindow) {
  const handle = target.getNativeWindowHandle()
  return process.arch === 'x64' ? handle.readBigUInt64LE(0).toString() : handle.readUInt32LE(0).toString()
}

function zOrderHelperPath() {
  const helperName = 'zorder-helper.exe'
  if (app.isPackaged) return path.join(process.resourcesPath, helperName)
  return path.join(process.env.APP_ROOT, 'build', helperName)
}

function sendWidgetBehindOtherApps(target = win) {
  if (!target || target.isDestroyed()) return

  target.setAlwaysOnTop(false)
  target.setSkipTaskbar(true)

  if (process.platform !== 'win32') {
    return
  }

  if (!target.isVisible()) return

  const helper = zOrderHelperPath()
  if (!existsSync(helper)) return

  const hwnd = nativeWindowHandle(target)
  execFile(helper, [hwnd], { windowsHide: true, timeout: 1000 }, () => {
    if (glassPanel && target === win) glassPanel.anchor(target)
  })
}

function scheduleWidgetBehindOtherApps(delay = 80) {
  if (bottomTimer) clearTimeout(bottomTimer)
  bottomTimer = setTimeout(() => {
    bottomTimer = null
    sendWidgetBehindOtherApps()
  }, delay)
}

function showWidget(focus = false) {
  if (!win || win.isDestroyed()) return
  win.setSkipTaskbar(true)
  win.setFocusable(true)
  win.setIgnoreMouseEvents(false)
  snapWidgetToCorner(win)
  win.showInactive()
  ensureGlassPanel(win)
  syncGlassPanelBounds(win)
  glassPanel?.show(focus ? 120 : 60)
  win.setSkipTaskbar(true)
  scheduleWidgetBehindOtherApps(focus ? 260 : 40)
}

function bringWidgetToFrontTemporarily() {
  if (!win || win.isDestroyed()) return
  showWidget(false)
  scheduleWidgetBehindOtherApps(120)
}

function updateTrayMenu() {
  if (!tray) return

  const visible = Boolean(win && !win.isDestroyed() && win.isVisible())
  const menu = Menu.buildFromTemplate([
    {
      label: visible ? '隐藏窗口' : '显示窗口',
      click: () => {
        if (!win || win.isDestroyed()) return
        if (win.isVisible()) {
          win.hide()
        } else {
          showWidget(true)
        }
        updateTrayMenu()
      },
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        isQuitting = true
        app.quit()
      },
    },
  ])

  tray.setToolTip('计划小组件')
  tray.setContextMenu(menu)
}

function createTray() {
  if (tray) return

  const iconPath = path.join(process.env.VITE_PUBLIC, 'favicon.ico')
  const image = nativeImage.createFromPath(iconPath)
  tray = new Tray(image.isEmpty() ? iconPath : image)
  tray.on('click', () => {
    if (!win || win.isDestroyed()) return
    if (win.isVisible()) {
      win.hide()
    } else {
      showWidget(true)
    }
    updateTrayMenu()
  })
  tray.on('double-click', () => {
    if (!win || win.isDestroyed()) return
    showWidget(true)
    updateTrayMenu()
  })
  updateTrayMenu()
}

function showCelebrateOverlay() {
  if (celebrateWin && !celebrateWin.isDestroyed()) return

  const { bounds } = screen.getDisplayNearestPoint(screen.getCursorScreenPoint())
  celebrateWin = new BrowserWindow({
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    frame: false,
    transparent: true,
    resizable: false,
    skipTaskbar: true,
    focusable: false,
    alwaysOnTop: true,
    backgroundColor: '#00000000',
    webPreferences: {
      preload,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  })

  celebrateWin.setIgnoreMouseEvents(true, { forward: true })

  if (VITE_DEV_SERVER_URL) {
    celebrateWin.loadURL(`${VITE_DEV_SERVER_URL}#celebrate`)
  } else {
    celebrateWin.loadFile(indexHtml, { hash: 'celebrate' })
  }

  setTimeout(() => {
    if (celebrateWin && !celebrateWin.isDestroyed()) {
      celebrateWin.close()
    }
    celebrateWin = null
  }, 2200)
}

function checkAndNotifyDueTasks() {
  if (!Notification.isSupported()) return

  const now = Date.now()
  const remindAheadMs = 5 * 60 * 1000
  const shortTasks = plannerStore.get('shortTasks')
  const notified = new Set(plannerStore.get('notifiedTaskIds'))

  for (const task of shortTasks) {
    if (task.completed) continue

    const dueTs = new Date(task.dueAt).getTime()
    if (Number.isNaN(dueTs)) continue

    const diff = dueTs - now
    if (diff >= 0 && diff <= remindAheadMs && !notified.has(task.id)) {
      new Notification({
        title: '任务提醒',
        body: `${task.title} 将在 5 分钟内到期`,
        silent: false,
      }).show()
      notified.add(task.id)
    }
  }

  plannerStore.set('notifiedTaskIds', [...notified])
}

function startReminderLoop() {
  if (reminderTimer) clearInterval(reminderTimer)
  checkAndNotifyDueTasks()
  reminderTimer = setInterval(checkAndNotifyDueTasks, 60 * 1000)
}

function setupAutoLaunch() {
  if (process.platform !== 'win32') return
  if (!app.isPackaged) return

  app.setLoginItemSettings({
    openAtLogin: true,
    openAsHidden: true,
    path: process.execPath,
    args: ['--hidden'],
  })
}

function registerIpc() {
  ipcMain.handle('planner:get-data', () => ({
    shortPlans: sanitizeShortPlans(plannerStore.get('shortPlans')),
    shortTasks: sanitizeShortTasks(plannerStore.get('shortTasks')),
    longTasks: sanitizeLongTasks(plannerStore.get('longTasks')),
    notifiedTaskIds: Array.isArray(plannerStore.get('notifiedTaskIds'))
      ? plannerStore.get('notifiedTaskIds').filter(id => typeof id === 'string').slice(0, MAX_SHORT_TASKS)
      : [],
    preferences: sanitizePreferences(plannerStore.get('preferences')),
  }))

  ipcMain.handle('planner:save-short-plans', (_event, plans: unknown) => {
    const sanitized = sanitizeShortPlans(plans)
    plannerStore.set('shortPlans', sanitized)
    return sanitized
  })

  ipcMain.handle('planner:save-short-tasks', (_event, tasks: unknown) => {
    const sanitized = sanitizeShortTasks(tasks)
    plannerStore.set('shortTasks', sanitized)
    const alive = new Set(sanitized.filter(task => !task.completed).map(task => task.id))
    const notified = plannerStore.get('notifiedTaskIds').filter(id => alive.has(id))
    plannerStore.set('notifiedTaskIds', notified)
    return sanitized
  })

  ipcMain.handle('planner:save-long-tasks', (_event, tasks: unknown) => {
    const sanitized = sanitizeLongTasks(tasks)
    plannerStore.set('longTasks', sanitized)
    return sanitized
  })

  ipcMain.handle('planner:save-preferences', (_event, preferences: unknown) => {
    const sanitized = sanitizePreferences(preferences)
    plannerStore.set('preferences', sanitized)
    return sanitized
  })

  ipcMain.on('planner:celebrate', () => {
    showCelebrateOverlay()
  })

}

async function createWindow() {
  const startHidden = !process.argv.includes('--show')

  win = new BrowserWindow({
    title: '计划小组件',
    width: WIDGET_WIDTH,
    height: WIDGET_HEIGHT,
    minWidth: WIDGET_WIDTH,
    minHeight: WIDGET_HEIGHT,
    maxWidth: WIDGET_WIDTH,
    maxHeight: WIDGET_HEIGHT,
    useContentSize: true,
    show: false,
    frame: false,
    transparent: true,
    skipTaskbar: true,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    focusable: true,
    alwaysOnTop: false,
    hasShadow: false,
    backgroundColor: '#00000000',
    backgroundMaterial: 'none',
    icon: path.join(process.env.VITE_PUBLIC, 'favicon.ico'),
    webPreferences: {
      preload,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  })
  win.setSkipTaskbar(true)
  applyRoundedWindowShape(win)
  win.webContents.setZoomFactor(1)
  void win.webContents.setVisualZoomLevelLimits(1, 1)

  snapWidgetToCorner(win)

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(indexHtml)
  }

  win.once('ready-to-show', () => {
    if (!startHidden) {
      showWidget(true)
      bringWidgetToFrontTemporarily()
    } else {
      updateTrayMenu()
    }
  })

  setTimeout(() => {
    if (win && !win.isDestroyed() && !startHidden) {
      showWidget(true)
      bringWidgetToFrontTemporarily()
    }
  }, 1200)

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
    if (!startHidden) {
      showWidget(true)
    }
    updateTrayMenu()
  })

  win.on('show', () => {
    if (win) {
      win.setAlwaysOnTop(false)
      win.setSkipTaskbar(true)
      snapWidgetToCorner(win)
      ensureGlassPanel(win)
      syncGlassPanelBounds(win)
      glassPanel?.show(80)
      scheduleWidgetBehindOtherApps(40)
      updateTrayMenu()
    }
  })

  win.on('hide', () => {
    glassPanel?.hide(80)
    updateTrayMenu()
  })
  win.on('focus', () => scheduleWidgetBehindOtherApps(80))
  win.on('blur', () => scheduleWidgetBehindOtherApps(40))

  win.on('resize', () => {
    if (win) {
      applyRoundedWindowShape(win)
      snapWidgetToCorner(win)
      syncGlassPanelBounds(win)
      scheduleWidgetBehindOtherApps(120)
    }
  })

  win.on('move', () => {
    if (win && !win.isDestroyed() && !isProgrammaticMove) scheduleSnap(win)
    syncGlassPanelBounds(win)
    scheduleWidgetBehindOtherApps(180)
    updateTrayMenu()
  })

  win.on('close', (event) => {
    if (isQuitting) return
    event.preventDefault()
    win?.hide()
  })

  win.webContents.setWindowOpenHandler(({ url }) => {
    try {
      const target = new URL(url)
      if (target.protocol === 'https:') void shell.openExternal(target.toString())
    } catch {
      // Ignore malformed or untrusted external URLs.
    }
    return { action: 'deny' }
  })

  win.webContents.on('will-navigate', (event) => {
    event.preventDefault()
  })

}

app.whenReady().then(() => {
  setupAutoLaunch()
  registerIpc()
  createTray()
  createWindow()
  startReminderLoop()
  screen.on('display-metrics-changed', () => {
    if (win && !win.isDestroyed()) snapWidgetToCorner(win)
  })

  globalShortcut.register('CommandOrControl+Shift+T', () => {
    if (!win || win.isDestroyed()) return
    if (win.isVisible()) {
      win.hide()
      updateTrayMenu()
    } else {
      showWidget(true)
    }
  })
})

app.on('before-quit', () => {
  isQuitting = true
})

app.on('window-all-closed', () => {
  if (process.platform === 'darwin') return
  if (isQuitting) app.quit()
})

app.on('will-quit', () => {
  if (reminderTimer) clearInterval(reminderTimer)
  if (snapTimer) clearTimeout(snapTimer)
  if (bottomTimer) clearTimeout(bottomTimer)
  if (programmaticMoveTimer) clearTimeout(programmaticMoveTimer)
  globalShortcut.unregisterAll()
  destroyGlassPanel()
  liquidGlass.shutdown()
  tray?.destroy()
  tray = null
})

app.on('second-instance', () => {
  if (win && !win.isDestroyed()) {
    if (win.isMinimized()) win.restore()
    showWidget(true)
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length) {
    showWidget(true)
  } else {
    createWindow()
  }
})
