import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const script = path.join(root, 'scripts', 'generate-icon.ps1')

const powershell = path.join(process.env.SystemRoot ?? 'C:\\Windows', 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe')

execFileSync(powershell, [
  '-NoProfile',
  '-ExecutionPolicy',
  'Bypass',
  '-File',
  script,
], {
  cwd: root,
  stdio: 'inherit',
})
