import { test, expect } from '@playwright/test'

const accounts = [
  { email: 'joaopaulo@gmail.com', name: 'joao' },
  { email: 'mariabento@msn.com', name: 'maria' },
]

test.describe('real auth smoke', () => {
  for (const account of accounts) {
    test(`${account.name} can login`, async ({ page }) => {
      const password = process.env.E2E_TEST_PASSWORD
      if (!password) {
        throw new Error('E2E_TEST_PASSWORD is not available in the environment.')
      }

      await page.goto('/login')
      await expect(page).toHaveURL(/\/login$/)
      await page.fill('input[type="email"]', account.email)
      await page.fill('input[type="password"]', password)
      await page.click('button[type="submit"]')

      await expect(page).not.toHaveURL(/\/login$/)
      await expect(page).toHaveURL(/\/(perfil|minha-conta|trips)/)

      await page.goto('/trips')
      await expect(page.locator('body')).toBeVisible()
    })
  }
})
