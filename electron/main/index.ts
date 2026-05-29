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
import Store from 'electron-store'

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

interface PlannerData {
  shortPlans: ShortPlan[]
  shortTasks: ShortTask[]
  longTasks: LongTask[]
  notifiedTaskIds: string[]
}

type PlannerStoreShape = {
  get<K extends keyof PlannerData>(key: K): PlannerData[K]
  set<K extends keyof PlannerData>(key: K, value: PlannerData[K]): void
  readonly store: PlannerData
}

const plannerStoreBase = new Store<PlannerData>({
  name: 'planner-data',
  defaults: {
    shortPlans: [],
    shortTasks: [],
    longTasks: [],
    notifiedTaskIds: [],
  },
})
const plannerStore = plannerStoreBase as unknown as PlannerStoreShape

let win: BrowserWindow | null = null
let tray: Tray | null = null
let celebrateWin: BrowserWindow | null = null
let reminderTimer: NodeJS.Timeout | null = null
let isInteractive = true
let isQuitting = false
let snapCorner: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' = 'top-right'
let snapTimer: NodeJS.Timeout | null = null
let programmaticMoveTimer: NodeJS.Timeout | null = null
let isProgrammaticMove = false

const preload = path.join(__dirname, '../preload/index.mjs')
const indexHtml = path.join(RENDERER_DIST, 'index.html')

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

function showWidget(focus = false) {
  if (!win || win.isDestroyed()) return
  isInteractive = true
  win.setFocusable(true)
  win.setIgnoreMouseEvents(false)
  snapWidgetToCorner(win)
  if (focus) {
    win.show()
    win.moveTop()
    win.focus()
  } else {
    win.showInactive()
  }
}

function bringWidgetToFrontTemporarily() {
  if (!win || win.isDestroyed()) return
  win.setAlwaysOnTop(true, 'floating')
  win.show()
  win.moveTop()
  win.focus()
  setTimeout(() => {
    if (win && !win.isDestroyed()) {
      win.setAlwaysOnTop(false)
    }
  }, 1500)
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

function applyInteractiveState(interactive: boolean, focus = false) {
  if (!win || win.isDestroyed()) return

  isInteractive = interactive
  win.setAlwaysOnTop(false)
  win.setVisibleOnAllWorkspaces(false)
  win.setFocusable(interactive)
  win.setIgnoreMouseEvents(!interactive, { forward: true })

  if (interactive) {
    showWidget(focus)
  } else if (win.isVisible()) {
    win.blur()
    showWidget(false)
  }

  if (!win.webContents.isDestroyed()) {
    win.webContents.send('planner:interactive-changed', interactive)
  }

  updateTrayMenu()
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
  ipcMain.handle('planner:get-data', () => plannerStore.store)

  ipcMain.handle('planner:save-short-plans', (_event, plans: ShortPlan[]) => {
    plannerStore.set('shortPlans', plans)
    return plans
  })

  ipcMain.handle('planner:save-short-tasks', (_event, tasks: ShortTask[]) => {
    plannerStore.set('shortTasks', tasks)
    const alive = new Set(tasks.filter(task => !task.completed).map(task => task.id))
    const notified = plannerStore.get('notifiedTaskIds').filter(id => alive.has(id))
    plannerStore.set('notifiedTaskIds', notified)
    return tasks
  })

  ipcMain.handle('planner:save-long-tasks', (_event, tasks: LongTask[]) => {
    plannerStore.set('longTasks', tasks)
    return tasks
  })

  ipcMain.on('planner:celebrate', () => {
    showCelebrateOverlay()
  })

  ipcMain.on('planner:set-interactive', (_event, interactive: boolean) => {
    applyInteractiveState(interactive, interactive)
  })

  ipcMain.handle('planner:toggle-widget', () => {
    if (!win || win.isDestroyed()) return false
    if (win.isVisible()) {
      win.hide()
      updateTrayMenu()
      return false
    }
    showWidget(true)
    updateTrayMenu()
    return true
  })
}

async function createWindow() {
  const startHidden = !process.argv.includes('--show')

  win = new BrowserWindow({
    title: '计划小组件',
    width: 530,
    height: 540,
    minWidth: 460,
    minHeight: 480,
    show: false,
    frame: false,
    transparent: true,
    skipTaskbar: true,
    resizable: true,
    focusable: true,
    alwaysOnTop: false,
    hasShadow: false,
    backgroundColor: '#00000000',
    icon: path.join(process.env.VITE_PUBLIC, 'favicon.ico'),
    webPreferences: {
      preload,
      contextIsolation: true,
      nodeIntegration: false,
    },
  })
  win.setSkipTaskbar(true)

  snapWidgetToCorner(win)

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(indexHtml)
  }

  win.once('ready-to-show', () => {
    if (!startHidden) {
      applyInteractiveState(true, true)
      bringWidgetToFrontTemporarily()
    } else {
      updateTrayMenu()
    }
  })

  setTimeout(() => {
    if (win && !win.isDestroyed() && !startHidden) {
      applyInteractiveState(true, true)
      bringWidgetToFrontTemporarily()
    }
  }, 1200)

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
    if (!startHidden) {
      showWidget(true)
      applyInteractiveState(true, true)
    }
    updateTrayMenu()
  })

  win.on('show', () => {
    if (win) {
      win.setAlwaysOnTop(false)
      snapWidgetToCorner(win)
      updateTrayMenu()
    }
  })

  win.on('hide', updateTrayMenu)

  win.on('resize', () => {
    if (win) snapWidgetToCorner(win)
  })

  win.on('move', () => {
    if (win && !win.isDestroyed() && !isProgrammaticMove) scheduleSnap(win)
    updateTrayMenu()
  })

  win.on('close', (event) => {
    if (isQuitting) return
    event.preventDefault()
    win?.hide()
  })

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
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
  if (programmaticMoveTimer) clearTimeout(programmaticMoveTimer)
  globalShortcut.unregisterAll()
  tray?.destroy()
  tray = null
})

app.on('second-instance', () => {
  if (win && !win.isDestroyed()) {
    if (win.isMinimized()) win.restore()
    showWidget(true)
    applyInteractiveState(true, true)
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length) {
    showWidget(true)
    applyInteractiveState(true, true)
  } else {
    createWindow()
  }
})

ipcMain.handle('open-win', async (_event, arg) => {
  if (!win || win.isDestroyed()) return
  if (!win.isVisible()) showWidget(true)
  if (typeof arg === 'string' && arg === 'toggle-widget') {
    applyInteractiveState(!isInteractive, true)
  }
})
