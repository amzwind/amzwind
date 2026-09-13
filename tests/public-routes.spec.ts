import { test, expect, type Page } from '@playwright/test'

const publicRoutes = [
  { path: '/', label: 'home' },
  { path: '/sobre', label: 'sobre' },
  { path: '/galeria', label: 'galeria' },
  { path: '/experiencias', label: 'experiencias' },
  { path: '/login', label: 'login' },
  { path: '/comunidade', label: 'comunidade' },
  { path: '/trips', label: 'trips' },
  { path: '/produtos', label: 'produtos' },
  { path: '/rota-inexistente', label: 'notfound' },
]

async function collectConsoleErrors(page: Page) {
  const pageErrors: string[] = []
  const consoleErrors: string[] = []

  page.on('pageerror', error => pageErrors.push(error.message))
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text())
  })

  return { pageErrors, consoleErrors }
}

for (const { path, label } of publicRoutes) {
  test(`public route loads: ${label} (${path})`, async ({ page }) => {
    const listeners = await collectConsoleErrors(page)

    const response = await page.goto(path, { waitUntil: 'domcontentloaded' })
    expect(response).not.toBeNull()
    expect(response!.status()).toBeLessThan(400)

    await expect(page.locator('body')).toBeVisible()

    if (path === '/rota-inexistente') {
      await expect(page.locator('body')).toContainText(/404|Página não encontrada|Page not found/i)
    }

    expect(listeners.pageErrors).toHaveLength(0)
    expect(listeners.consoleErrors).toHaveLength(0)
  })
}
