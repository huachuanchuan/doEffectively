import { ipcRenderer, contextBridge, type IpcRendererEvent } from 'electron'

contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...rest) => listener(event, ...rest))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },
})

contextBridge.exposeInMainWorld('plannerApi', {
  getData: () => ipcRenderer.invoke('planner:get-data'),
  saveShortPlans: (plans: unknown[]) => ipcRenderer.invoke('planner:save-short-plans', plans),
  saveShortTasks: (tasks: unknown[]) => ipcRenderer.invoke('planner:save-short-tasks', tasks),
  saveLongTasks: (tasks: unknown[]) => ipcRenderer.invoke('planner:save-long-tasks', tasks),
  celebrate: () => ipcRenderer.send('planner:celebrate'),
  setInteractive: (interactive: boolean) => ipcRenderer.send('planner:set-interactive', interactive),
  toggleWidget: () => ipcRenderer.invoke('planner:toggle-widget'),
  onInteractiveChanged: (listener: (interactive: boolean) => void) => {
    const handler = (_event: IpcRendererEvent, interactive: boolean) => listener(interactive)
    ipcRenderer.on('planner:interactive-changed', handler)
    return () => {
      ipcRenderer.off('planner:interactive-changed', handler)
    }
  },
})
