import { app, BrowserWindow } from 'electron'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const output = path.join(root, 'build', 'ui-preview.png')
const settingsOutput = path.join(root, 'build', 'settings-preview.png')
const completedOutput = path.join(root, 'build', 'completed-preview.png')

function formatPlanDate(date) {
  const year = date.getFullYear().toString()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}${month}${day}`
}

app.whenReady().then(async () => {
  const now = new Date()
  const planDate = formatPlanDate(now)
  const createdAt = now.toISOString()
  const dueAt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 21).toISOString()
  const data = {
    shortPlans: [
      { id: 'active-plan', name: '今日专注', planDate, createdAt },
      { id: 'done-plan', name: '晨间收尾', planDate, createdAt: new Date(now.getTime() - 1000).toISOString() },
    ],
    shortTasks: [
      { id: 'active-task', title: '整理项目的下一步行动', planId: 'active-plan', planDate, priority: 3, dueAt, completed: false, createdAt, longTaskId: 'long-active' },
      { id: 'done-task-1', title: '检查邮件', planId: 'done-plan', planDate, priority: 2, dueAt, completed: true, createdAt, longTaskId: null },
      { id: 'done-task-2', title: '更新日历', planId: 'done-plan', planDate, priority: 1, dueAt, completed: true, createdAt, longTaskId: null },
    ],
    longTasks: [
      { id: 'long-active', name: '发布新版本', start: '2026-09-01', end: '2026-10-15', progress: 0, progressMode: 'time', completed: false, delayedAt: null },
      { id: 'long-done', name: '完成产品梳理', start: '2026-08-01', end: '2026-09-20', progress: 100, progressMode: 'time', completed: true, delayedAt: null },
    ],
    notifiedTaskIds: [],
    preferences: {
      fontFamily: 'system',
      fontSize: 14,
      accentColor: '#2f7cff',
      textColor: '#17334d',
      glassTint: '#bfeeff',
      motto: '把重要的事，做得从容而坚定',
    },
  }

  const win = new BrowserWindow({
    width: 530,
    height: 620,
    useContentSize: true,
    show: false,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  })

  await win.loadFile(path.join(root, 'dist', 'index.html'))
  await win.webContents.executeJavaScript(`localStorage.setItem('glass-planner-data', ${JSON.stringify(JSON.stringify(data))})`)
  await win.reload()
  await new Promise(resolve => setTimeout(resolve, 400))
  const image = await win.webContents.capturePage()
  await writeFile(output, image.toPNG())
  await win.webContents.executeJavaScript("document.querySelector('.long-done-collapse')?.setAttribute('open', '')")
  await new Promise(resolve => setTimeout(resolve, 180))
  await win.webContents.executeJavaScript("const scroller = document.querySelector('.long-panel-scroll'); if (scroller) scroller.scrollTop = scroller.scrollHeight")
  await new Promise(resolve => setTimeout(resolve, 120))
  const completedImage = await win.webContents.capturePage()
  await writeFile(completedOutput, completedImage.toPNG())
  await win.webContents.executeJavaScript("location.hash = '#settings'")
  await new Promise(resolve => {
    win.webContents.once('did-finish-load', resolve)
    win.reload()
  })
  await new Promise(resolve => setTimeout(resolve, 400))
  const settingsImage = await win.webContents.capturePage()
  await writeFile(settingsOutput, settingsImage.toPNG())
  win.destroy()
  app.quit()
})
