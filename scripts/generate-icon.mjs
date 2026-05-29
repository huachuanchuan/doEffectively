import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

const sizes = [16, 32, 48, 64, 128, 256]

function clamp(value, min = 0, max = 255) {
  return Math.max(min, Math.min(max, value))
}

function smoothstep(edge0, edge1, value) {
  const x = clamp((value - edge0) / (edge1 - edge0), 0, 1)
  return x * x * (3 - 2 * x)
}

function roundedRectAlpha(x, y, left, top, right, bottom, radius) {
  const cx = clamp(x, left + radius, right - radius)
  const cy = clamp(y, top + radius, bottom - radius)
  const dist = Math.hypot(x - cx, y - cy) - radius
  return 1 - smoothstep(-1.2, 1.2, dist)
}

function lineAlpha(x, y, x1, y1, x2, y2, width) {
  const vx = x2 - x1
  const vy = y2 - y1
  const lenSq = vx * vx + vy * vy
  const t = lenSq === 0 ? 0 : clamp(((x - x1) * vx + (y - y1) * vy) / lenSq, 0, 1)
  const px = x1 + vx * t
  const py = y1 + vy * t
  const dist = Math.hypot(x - px, y - py)
  return 1 - smoothstep(width * 0.5 - 1.2, width * 0.5 + 1.2, dist)
}

function composite(pixel, color, alpha) {
  if (alpha <= 0) return pixel
  const sourceAlpha = clamp(alpha, 0, 1)
  const outAlpha = sourceAlpha + pixel.a * (1 - sourceAlpha)
  if (outAlpha <= 0) return { r: 0, g: 0, b: 0, a: 0 }

  return {
    r: (color.r * sourceAlpha + pixel.r * pixel.a * (1 - sourceAlpha)) / outAlpha,
    g: (color.g * sourceAlpha + pixel.g * pixel.a * (1 - sourceAlpha)) / outAlpha,
    b: (color.b * sourceAlpha + pixel.b * pixel.a * (1 - sourceAlpha)) / outAlpha,
    a: outAlpha,
  }
}

function drawIcon(size) {
  const pixels = new Uint8Array(size * size * 4)
  const s = size / 256

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const ux = (x + 0.5) / s
      const uy = (y + 0.5) / s
      let pixel = { r: 0, g: 0, b: 0, a: 0 }

      const shell = roundedRectAlpha(ux, uy, 21, 21, 235, 235, 54)
      const inner = roundedRectAlpha(ux, uy, 34, 34, 222, 222, 43)
      const shade = 0.95 + (1 - uy / 256) * 0.12
      pixel = composite(pixel, { r: 96 * shade, g: 182 * shade, b: 210 * shade }, shell * 0.82)
      pixel = composite(pixel, { r: 246, g: 252, b: 255 }, inner * 0.16)

      const border = shell * (1 - roundedRectAlpha(ux, uy, 27, 27, 229, 229, 48))
      pixel = composite(pixel, { r: 255, g: 255, b: 255 }, border * 0.82)

      const highlight = roundedRectAlpha(ux, uy, 48, 38, 208, 96, 28)
      pixel = composite(pixel, { r: 255, g: 255, b: 255 }, highlight * 0.22)

      const timelineA = roundedRectAlpha(ux, uy, 72, 146, 186, 165, 9)
      const timelineB = roundedRectAlpha(ux, uy, 96, 178, 206, 197, 9)
      const timelineC = roundedRectAlpha(ux, uy, 55, 111, 154, 130, 9)
      pixel = composite(pixel, { r: 255, g: 255, b: 255 }, timelineA * 0.7)
      pixel = composite(pixel, { r: 255, g: 255, b: 255 }, timelineB * 0.5)
      pixel = composite(pixel, { r: 255, g: 255, b: 255 }, timelineC * 0.42)

      const check =
        lineAlpha(ux, uy, 67, 86, 107, 126, 18) +
        lineAlpha(ux, uy, 105, 126, 189, 67, 18)
      pixel = composite(pixel, { r: 255, g: 255, b: 255 }, Math.min(1, check) * 0.94)

      const smallDot = roundedRectAlpha(ux, uy, 52, 174, 72, 194, 10)
      pixel = composite(pixel, { r: 255, g: 255, b: 255 }, smallDot * 0.62)

      const index = (y * size + x) * 4
      pixels[index] = clamp(Math.round(pixel.r))
      pixels[index + 1] = clamp(Math.round(pixel.g))
      pixels[index + 2] = clamp(Math.round(pixel.b))
      pixels[index + 3] = clamp(Math.round(pixel.a * 255))
    }
  }

  return pixels
}

function bitmapIcoImage(size) {
  const pixels = drawIcon(size)
  const rowBytes = size * 4
  const maskRowBytes = Math.ceil(size / 32) * 4
  const imageSize = rowBytes * size
  const maskSize = maskRowBytes * size
  const header = Buffer.alloc(40)
  header.writeUInt32LE(40, 0)
  header.writeInt32LE(size, 4)
  header.writeInt32LE(size * 2, 8)
  header.writeUInt16LE(1, 12)
  header.writeUInt16LE(32, 14)
  header.writeUInt32LE(0, 16)
  header.writeUInt32LE(imageSize + maskSize, 20)
  header.writeInt32LE(0, 24)
  header.writeInt32LE(0, 28)
  header.writeUInt32LE(0, 32)
  header.writeUInt32LE(0, 36)

  const bitmap = Buffer.alloc(imageSize)
  for (let y = 0; y < size; y += 1) {
    const sourceY = size - 1 - y
    for (let x = 0; x < size; x += 1) {
      const source = (sourceY * size + x) * 4
      const target = y * rowBytes + x * 4
      bitmap[target] = pixels[source + 2]
      bitmap[target + 1] = pixels[source + 1]
      bitmap[target + 2] = pixels[source]
      bitmap[target + 3] = pixels[source + 3]
    }
  }

  return Buffer.concat([header, bitmap, Buffer.alloc(maskSize)])
}

function writeIco(filePath) {
  mkdirSync(dirname(filePath), { recursive: true })
  const images = sizes.map(size => ({ size, buffer: bitmapIcoImage(size) }))
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(images.length, 4)

  const entries = Buffer.alloc(16 * images.length)
  let offset = header.length + entries.length

  images.forEach((image, index) => {
    const entry = index * 16
    entries[entry] = image.size >= 256 ? 0 : image.size
    entries[entry + 1] = image.size >= 256 ? 0 : image.size
    entries[entry + 2] = 0
    entries[entry + 3] = 0
    entries.writeUInt16LE(1, entry + 4)
    entries.writeUInt16LE(32, entry + 6)
    entries.writeUInt32LE(image.buffer.length, entry + 8)
    entries.writeUInt32LE(offset, entry + 12)
    offset += image.buffer.length
  })

  writeFileSync(filePath, Buffer.concat([header, entries, ...images.map(image => image.buffer)]))
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <rect x="21" y="21" width="214" height="214" rx="54" fill="#63b8d2" fill-opacity=".82"/>
  <rect x="34" y="34" width="188" height="188" rx="43" fill="#fff" fill-opacity=".16"/>
  <path d="M67 86l40 40 82-59" fill="none" stroke="#fff" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="55" y="111" width="99" height="19" rx="9" fill="#fff" fill-opacity=".42"/>
  <rect x="72" y="146" width="114" height="19" rx="9" fill="#fff" fill-opacity=".70"/>
  <rect x="96" y="178" width="110" height="19" rx="9" fill="#fff" fill-opacity=".50"/>
  <circle cx="62" cy="184" r="10" fill="#fff" fill-opacity=".62"/>
  <rect x="48" y="38" width="160" height="58" rx="28" fill="#fff" fill-opacity=".20"/>
  <rect x="21" y="21" width="214" height="214" rx="54" fill="none" stroke="#fff" stroke-opacity=".78" stroke-width="6"/>
</svg>
`

writeIco('public/favicon.ico')
writeIco('build/icon.ico')
writeFileSync('build/icon.svg', svg)
