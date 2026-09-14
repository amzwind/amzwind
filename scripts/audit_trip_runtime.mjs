import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const envFiles = ['.env', '.env.local', '.env.production', '.env.development']
const status = { url: 'MISSING', anonKey: 'MISSING', localEnv: 'MISSING', authSession: 'NOT_AVAILABLE', e2eTooling: 'NOT_INSTALLED' }

function readEnvFile(file) {
  const full = path.join(root, file)
  if (!fs.existsSync(full)) return {}
  const entries = {}
  for (const raw of fs.readFileSync(full, 'utf8').split(/\r?\n/)) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    const idx = line.indexOf('=')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    const value = line.slice(idx + 1).trim()
    entries[key] = value
  }
  return entries
}

const envSummary = {}
for (const file of envFiles) {
  Object.assign(envSummary, readEnvFile(file))
}

if (envSummary.VITE_SUPABASE_URL) {
  status.url = 'PRESENT'
}
if (envSummary.VITE_SUPABASE_ANON_KEY) {
  status.anonKey = 'PRESENT'
}
for (const file of envFiles) {
  if (fs.existsSync(path.join(root, file))) {
    status.localEnv = file
    break
  }
}

console.log('=== FASE 18: trip runtime audit ===')
console.log(`PROJECT_ROOT=${root}`)
console.log(`SUPABASE_URL=${status.url}`)
console.log(`SUPABASE_ANON_KEY=${status.anonKey}`)
console.log(`ENV_FILE=${status.localEnv}`)
console.log(`AUTH_SESSION=${status.authSession}`)
console.log(`E2E_TOOLING=${status.e2eTooling}`)

if (status.url === 'PRESENT') {
  const url = envSummary.VITE_SUPABASE_URL
  const checkUrl = new URL('/auth/v1/health', url).toString()
  try {
    const res = await fetch(checkUrl)
    const text = await res.text()
    const preview = text.replace(/\s+/g, ' ').slice(0, 180)
    console.log(`SUPABASE_HEALTH_URL=${checkUrl}`)
    console.log(`HTTP_STATUS=${res.status}`)
    console.log(`CONTENT_TYPE=${res.headers.get('content-type') || 'unknown'}`)
    console.log(`BODY_PREVIEW=${preview}`)
  } catch (error) {
    console.log(`SUPABASE_HEALTH_ERROR=${error.message}`)
  }
}

console.log('AUTH_E2E=BLOCKED')
console.log('REASON=No authenticated session and no test user credentials are available in this environment, and no E2E tool is installed.')
console.log('TRIP_RUNTIME_RESULT=UNVERIFIABLE_IN_CURRENT_ENVIRONMENT')
