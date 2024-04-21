const { test, expect, beforeEach, describe } = require('@playwright/test')
const exp = require('constants')
require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = await page.getByText('Log in to application')
    const lableUsername = await page.getByText('username')
    const lablePassword = await page.getByText('password')
    await expect(locator).toBeVisible()
    await expect(lableUsername).toBeVisible()
    await expect(lablePassword).toBeVisible()

    const usernameInput = await page.getByTestId('username')
    const passwordInput = await page.getByTestId('password')
    const submit = await page.getByRole('button', { name: 'login' })
    await expect(usernameInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
    await expect(submit).toBeVisible()
  })
})