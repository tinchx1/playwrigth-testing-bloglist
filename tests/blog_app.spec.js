const { test, expect, beforeEach, describe } = require('@playwright/test')
const exp = require('constants')
require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        username: 'pepe',
        password: '123'
      }
    })
    await page.goto('http://localhost:5173/')
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
  describe('Login', () => {
    test('Login fail with wrong password', async ({ page }) => {
      const usernameInput = await page.getByTestId('username').fill('pepe')
      const passwordInput = await page.getByTestId('password').fill('wrong')
      const submit = await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('wrong credentials')).toBeVisible()
    })
    test('Login working', async ({ page }) => {
      const usernameInput = await page.getByTestId('username').fill('pepe')
      const passwordInput = await page.getByTestId('password').fill('123')
      const submit = await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('blogs')).toBeVisible()
    })
  })
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      const usernameInput = await page.getByTestId('username').fill('pepe')
      const passwordInput = await page.getByTestId('password').fill('123')
      const submit = await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      const newBlog = {
        "title": "pepeblog",
        "author": "pepito",
        "url": "http://pepe.com"
      }
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByTestId('title').fill(newBlog.title)
      await page.getByTestId('author').fill(newBlog.author)
      await page.getByTestId('url').fill(newBlog.url)
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.getByText(`${newBlog.title} ${newBlog.author}`)).toBeVisible()
      await page.getByText('view').click()
      await expect(page.getByText('0 likes')).toBeVisible()
      const buttonlike = await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('1 likes')).toBeVisible()
      await page.on('dialog', async dialog => {
        await dialog.accept();
      })
      await page.getByRole('button', { name: 'remove' }).click()
      await expect(page.getByText(`${newBlog.title} ${newBlog.author}`)).not.toBeVisible()
    })
  })
})