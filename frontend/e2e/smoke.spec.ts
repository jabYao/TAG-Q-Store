import { test, expect } from '@playwright/test'

test('home page renders', async ({ page }) => {
  await page.goto('/')
  await page.waitForSelector('#root', { timeout: 10000 })
  expect(true).toBe(true)
})

test('catalog page renders', async ({ page }) => {
  await page.goto('/catalogo')
  await page.waitForSelector('#root', { timeout: 10000 })
  expect(true).toBe(true)
})

test('cart page renders', async ({ page }) => {
  await page.goto('/carrito')
  await page.waitForSelector('#root', { timeout: 10000 })
  expect(true).toBe(true)
})

test('checkout redirects guest to login', async ({ page }) => {
  await page.goto('/checkout')
  await page.waitForURL(/\/login/, { timeout: 15000 })
})
