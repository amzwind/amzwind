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

test('experiencias page shows fallback data and supports search', async ({ page }) => {
  const listeners = await collectConsoleErrors(page)

  await page.goto('/experiencias', { waitUntil: 'domcontentloaded' })

  const searchBox = page.getByPlaceholder(/buscar experiência|buscar experiências|search/i)
  await expect(searchBox).toBeVisible()

  const cards = page.locator('a[href*="/experiencia/"] h3')
  await expect(cards.first()).toBeVisible()

  const firstTitle = (await cards.first().textContent())?.trim() || ''
  const searchValue = firstTitle.split(/\s+/).slice(0, 2).join(' ')

  await searchBox.fill(searchValue)
  await expect(cards.first()).toContainText(new RegExp(searchValue, 'i'))

  expect(listeners.pageErrors).toHaveLength(0)
  expect(listeners.consoleErrors).toHaveLength(0)
})

test('trips page supports search and status filter', async ({ page }) => {
  const listeners = await collectConsoleErrors(page)

  await page.goto('/trips', { waitUntil: 'domcontentloaded' })

  const searchBox = page.getByPlaceholder(/buscar trip|buscar viagem|search/i)
  await expect(searchBox).toBeVisible()

  const cards = page.locator('button:has(h3)')
  await expect(cards.first()).toBeVisible()

  const firstTitle = (await cards.first().locator('h3').textContent())?.trim() || ''
  const searchValue = firstTitle.split(/\s+/).slice(0, 2).join(' ')

  await searchBox.fill(searchValue)
  await expect(cards.first()).toContainText(new RegExp(searchValue, 'i'))

  await page.getByRole('combobox').selectOption('published')
  await expect(page.getByText(/Aberta|Open|Published/i)).toBeVisible()

  expect(listeners.pageErrors).toHaveLength(0)
  expect(listeners.consoleErrors).toHaveLength(0)
})

test('produtos page supports search and fallback catalog', async ({ page }) => {
  const listeners = await collectConsoleErrors(page)

  await page.goto('/produtos', { waitUntil: 'domcontentloaded' })

  const searchBox = page.getByPlaceholder(/buscar produto|buscar produtos|search/i)
  await expect(searchBox).toBeVisible()

  const cards = page.locator('a[href*="/produto/"] h3')
  await expect(cards.first()).toBeVisible()

  const firstTitle = (await cards.first().textContent())?.trim() || ''
  const searchValue = firstTitle.split(/\s+/).slice(0, 2).join(' ')

  await searchBox.fill(searchValue)
  await expect(cards.first()).toContainText(new RegExp(searchValue, 'i'))

  expect(listeners.pageErrors).toHaveLength(0)
  expect(listeners.consoleErrors).toHaveLength(0)
})
