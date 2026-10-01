import { app, BrowserWindow, screen } from 'electron'
import glass from '@hicccc77/electron-liquid-glass'

app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 96,
    height: 96,
    show: false,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
  })

  const bounds = screen.dipToScreenRect(win, win.getBounds())
  const dpr = screen.getDisplayMatching(win.getBounds()).scaleFactor
  const panel = glass.createPanel({
    ...bounds,
    dpr,
    cornerRadius: 24 * dpr,
    blurSigma: 2 * dpr,
    displacementScale: 40 * dpr,
    aberrationIntensity: 1,
    saturation: 1.1,
    anchorWindow: win,
  })

  if (!glass.isSupported() || !panel) {
    throw new Error('Native liquid-glass panel is unavailable')
  }

  console.log(JSON.stringify({ supported: true, panelId: panel.id, dpr, bounds }))
  panel.destroy()
  win.destroy()
  glass.shutdown()
  app.quit()
})
