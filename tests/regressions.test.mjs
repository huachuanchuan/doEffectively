import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8')
const tests = []
const test = (name, run) => tests.push({ name, run })

test('completed short plans are not clipped by an inner fixed height', async () => {
  const css = await read('src/App.css')
  const rule = css.match(/\.short-done-collapse\s*\{([^}]*)\}/s)?.[1] ?? ''

  assert.doesNotMatch(rule, /max-height\s*:/)
  assert.doesNotMatch(rule, /overflow\s*:\s*(?:auto|hidden)/)
})

test('every long plan renders a native completion checkbox', async () => {
  const app = await read('src/App.tsx')

  assert.match(app, /className='[^']*long-task-check[^']*'/)
  assert.match(app, /type='checkbox'[\s\S]*checked=\{!!task\.completed\}/)
  assert.match(app, /toggleLongTask\(task\.id, event\.target\.checked\)/)
})

test('the widget window has a fixed content size across displays', async () => {
  const main = await read('electron/main/index.ts')

  assert.match(main, /useContentSize:\s*true/)
  assert.match(main, /resizable:\s*false/)
  assert.match(main, /const WIDGET_WIDTH = 530/)
  assert.match(main, /const WIDGET_HEIGHT = 620/)
  assert.match(main, /maxWidth:\s*WIDGET_WIDTH/)
  assert.match(main, /maxHeight:\s*WIDGET_HEIGHT/)
})

test('the preload exposes only the scoped planner API', async () => {
  const preload = await read('electron/preload/index.ts')

  assert.doesNotMatch(preload, /exposeInMainWorld\('ipcRenderer'/)
  assert.match(preload, /exposeInMainWorld\('plannerApi'/)
})

test('planner IPC validates persisted collections before writing', async () => {
  const main = await read('electron/main/index.ts')

  assert.match(main, /sanitizeShortPlans\(plans\)/)
  assert.match(main, /sanitizeShortTasks\(tasks\)/)
  assert.match(main, /sanitizeLongTasks\(tasks\)/)
})

test('liquid glass uses an edge displacement layer instead of blur alone', async () => {
  const app = await read('src/App.tsx')
  const css = await read('src/App.css')

  assert.match(app, /id='liquid-glass-edge'/)
  assert.match(app, /<feDisplacementMap/)
  assert.match(css, /filter:\s*url\(#liquid-glass-edge\)/)
  assert.match(css, /--pointer-x/)
})

test('motto is edited in place and persisted without a separate edit button', async () => {
  const app = await read('src/App.tsx')
  const main = await read('electron/main/index.ts')

  assert.match(app, /className='motto-display'/)
  assert.match(app, /onClick=\{startEditingMotto\}/)
  assert.match(app, /className='motto-input'/)
  assert.match(app, /savePreferences/)
  assert.match(main, /sanitizePreferences/)
})

test('appearance settings expose font, size, accent, text, and glass tint controls', async () => {
  const app = await read('src/App.tsx')

  assert.match(app, /id='font-family'/)
  assert.match(app, /id='font-size'/)
  assert.match(app, /id='accent-color'/)
  assert.match(app, /id='text-color'/)
  assert.match(app, /id='glass-tint'/)
})

test('completed long plans render in their own collapsible section', async () => {
  const app = await read('src/App.tsx')

  assert.match(app, /completedLongTasks/)
  assert.match(app, /className='collapse-block long-done-collapse'/)
  assert.match(app, /已完成的长期计划/)
})

test('delay action directly selects a new end date and has no fixed seven-day logic', async () => {
  const app = await read('src/App.tsx')

  assert.match(app, /className='submit-button compact-action delay-picker'/)
  assert.match(app, /type='date'[\s\S]*delayLongTask\(task\.id, event\.target\.value\)/)
  assert.doesNotMatch(app, /function addDays/)
  assert.doesNotMatch(app, /延期 7 天/)
})

test('the native window is rounded instead of exposing a rectangular acrylic backdrop', async () => {
  const main = await read('electron/main/index.ts')

  assert.match(main, /backgroundMaterial:\s*'none'/)
  assert.match(main, /function applyRoundedWindowShape/)
  assert.match(main, /target\.setShape\(roundedWindowShape/)
})

test('desktop wallpaper refraction is provided by a dedicated native glass panel', async () => {
  const main = await read('electron/main/index.ts')
  const builder = await read('electron-builder.json')

  assert.match(main, /@hicccc77\/electron-liquid-glass/)
  assert.match(main, /createPanel\(\{/)
  assert.match(main, /syncGlassPanelBounds/)
  assert.match(builder, /asarUnpack/)
})

test('completed checkboxes keep a neutral translucent glass treatment', async () => {
  const css = await read('src/App.css')
  const checkedRule = css.match(/\.task-check input:checked \+ span\s*\{([^}]*)\}/s)?.[1] ?? ''

  assert.doesNotMatch(checkedRule, /#5ed4b4|#15947b|rgba\(26,\s*153,\s*125/)
  assert.match(checkedRule, /rgba\(255,\s*255,\s*255/)
})

let failed = 0
for (const { name, run } of tests) {
  try {
    await run()
    console.log(`PASS ${name}`)
  } catch (error) {
    failed += 1
    console.error(`FAIL ${name}`)
    console.error(error instanceof Error ? error.message : error)
  }
}

if (failed > 0) {
  process.exitCode = 1
  console.error(`\n${failed}/${tests.length} regression checks failed`)
} else {
  console.log(`\n${tests.length}/${tests.length} regression checks passed`)
}
