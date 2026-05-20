import { test, expect } from '@playwright/test'

test('home page loads and shows hero', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('text=TAG-Q')).toBeVisible()
  await expect(page.locator('text=SHOP NOW')).toBeVisible()
})

test('catalog page shows products', async ({ page }) => {
  await page.goto('/catalogo')
  await expect(page.locator('text=Catálogo')).toBeVisible()
})

test('navigation works', async ({ page }) => {
  await page.goto('/')
  await page.click('text=Catálogo')
  await expect(page).toHaveURL(/\/catalogo/)
})
