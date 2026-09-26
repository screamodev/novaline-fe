// Fails when a component or page hardcodes a colour instead of using the theme tokens (constitution II).
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const ROOTS = ['app/components', 'app/pages', 'app/layouts']
const PATTERN = /#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(|oklch\(/g
const walk = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f)
  return statSync(p).isDirectory() ? walk(p) : p.endsWith('.vue') || p.endsWith('.ts') ? [p] : []
})

const hits = ROOTS.flatMap((root) => {
  try { return walk(root) } catch { return [] }
}).flatMap((file) =>
  readFileSync(file, 'utf8').split('\n').flatMap((line, i) =>
    [...line.matchAll(PATTERN)].map((m) => `${file}:${i + 1}: ${m[0]}`)))

if (hits.length) {
  console.error(`Hardcoded colours found (use app/theme/colors.ts tokens):\n${hits.join('\n')}`)
  process.exit(1)
}
console.log('lint:colors — no hardcoded colours')
