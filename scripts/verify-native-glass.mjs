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
  win.setContentProtection(true)

  const bounds = screen.dipToScreenRect(win, win.getBounds())
  const dpr = screen.getDisplayMatching(win.getBounds()).scaleFactor
  const panel = glass.createPanel({
    ...bounds,
    dpr,
    cornerRadius: 24 * dpr,
    blurSigma: 0.35 * dpr,
    displacementScale: 72 * dpr,
    aberrationIntensity: 0.35,
    saturation: 1,
    excludeFromCapture: true,
    anchorWindow: win,
  })

  if (!glass.isSupported() || !panel) {
    throw new Error('Native liquid-glass panel is unavailable')
  }

  console.log(JSON.stringify({
    supported: true,
    contentProtectionRequested: true,
    panelId: panel.id,
    dpr,
    bounds,
  }))
  panel.destroy()
  win.destroy()
  glass.shutdown()
  app.quit()
})
