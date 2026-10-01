import { ipcRenderer, contextBridge } from 'electron'

contextBridge.exposeInMainWorld('plannerApi', {
  getData: () => ipcRenderer.invoke('planner:get-data'),
  saveShortPlans: (plans: unknown[]) => ipcRenderer.invoke('planner:save-short-plans', plans),
  saveShortTasks: (tasks: unknown[]) => ipcRenderer.invoke('planner:save-short-tasks', tasks),
  saveLongTasks: (tasks: unknown[]) => ipcRenderer.invoke('planner:save-long-tasks', tasks),
  savePreferences: (preferences: unknown) => ipcRenderer.invoke('planner:save-preferences', preferences),
  celebrate: () => ipcRenderer.send('planner:celebrate'),
})
