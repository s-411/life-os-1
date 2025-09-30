import { test, expect } from '@playwright/test'

const TEST_USER = {
  email: process.env.TEST_USER_EMAIL || 'test@example.com',
  password: process.env.TEST_USER_PASSWORD || 'testpassword123',
}

test.describe('Authentication Flows', () => {
  test.beforeEach(async ({ page }) => {
    // Start from the home page
    await page.goto('/')
  })

  test('should complete signup flow', async ({ page }) => {
    // Navigate to signup
    await page.goto('/auth/sign-up')

    // Fill out signup form
    await page.fill('input[type="email"]', `test-${Date.now()}@example.com`)
    await page.fill('input[id="password"]', 'TestPassword123!')
    await page.fill('input[id="repeat-password"]', 'TestPassword123!')

    // Submit form
    await page.click('button[type="submit"]')

    // Verify success page or email verification message
    await expect(page).toHaveURL(/sign-up-success/)
  })

  test('should complete login flow', async ({ page }) => {
    // Navigate to login
    await page.goto('/auth/login')

    // Fill out login form
    await page.fill('input[type="email"]', TEST_USER.email)
    await page.fill('input[type="password"]', TEST_USER.password)

    // Submit form
    await page.click('button[type="submit"]:has-text("Login")')

    // Verify redirect to daily page
    await expect(page).toHaveURL(/\/daily/)
  })

  test('should show error on invalid login', async ({ page }) => {
    await page.goto('/auth/login')

    // Fill out with invalid credentials
    await page.fill('input[type="email"]', 'invalid@example.com')
    await page.fill('input[type="password"]', 'wrongpassword')

    // Submit form
    await page.click('button[type="submit"]:has-text("Login")')

    // Verify error message appears
    await expect(page.locator('text=/invalid/i')).toBeVisible()
  })

  test('should complete logout flow', async ({ page }) => {
    // First login
    await page.goto('/auth/login')
    await page.fill('input[type="email"]', TEST_USER.email)
    await page.fill('input[type="password"]', TEST_USER.password)
    await page.click('button[type="submit"]:has-text("Login")')
    await expect(page).toHaveURL(/\/daily/)

    // Click logout button
    await page.click('button:has-text("Logout")')

    // Verify redirect to login
    await expect(page).toHaveURL(/\/auth\/login/)
  })

  test('should protect /daily route when not authenticated', async ({ page }) => {
    // Try to access /daily directly without authentication
    await page.goto('/daily')

    // Should redirect to login
    await expect(page).toHaveURL(/\/auth\/login/)
  })

  test('should persist session across page reloads', async ({ page }) => {
    // Login
    await page.goto('/auth/login')
    await page.fill('input[type="email"]', TEST_USER.email)
    await page.fill('input[type="password"]', TEST_USER.password)
    await page.click('button[type="submit"]:has-text("Login")')
    await expect(page).toHaveURL(/\/daily/)

    // Reload page
    await page.reload()

    // Should still be on daily page (not redirected to login)
    await expect(page).toHaveURL(/\/daily/)
  })

  test('should request password reset', async ({ page }) => {
    await page.goto('/auth/forgot-password')

    // Fill out email
    await page.fill('input[type="email"]', TEST_USER.email)

    // Submit form
    await page.click('button[type="submit"]')

    // Verify success message
    await expect(page.locator('text=/check your email/i')).toBeVisible()
  })

  test('should show forgot password link on login page', async ({ page }) => {
    await page.goto('/auth/login')

    // Verify forgot password link exists
    const forgotPasswordLink = page.locator('a:has-text("Forgot your password?")')
    await expect(forgotPasswordLink).toBeVisible()

    // Click link and verify navigation
    await forgotPasswordLink.click()
    await expect(page).toHaveURL(/\/auth\/forgot-password/)
  })

  test('should show signup link on login page', async ({ page }) => {
    await page.goto('/auth/login')

    // Verify signup link exists
    const signupLink = page.locator('a:has-text("Sign up")')
    await expect(signupLink).toBeVisible()

    // Click link and verify navigation
    await signupLink.click()
    await expect(page).toHaveURL(/\/auth\/sign-up/)
  })

  test('should show OAuth buttons', async ({ page }) => {
    await page.goto('/auth/login')

    // Verify OAuth buttons exist
    await expect(page.locator('button:has-text("Google")')).toBeVisible()
    await expect(page.locator('button:has-text("GitHub")')).toBeVisible()
  })
})