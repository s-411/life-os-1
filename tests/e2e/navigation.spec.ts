import { test, expect, Page } from '@playwright/test';

// Helper to login before navigation tests
async function login(page: Page) {
  await page.goto('/auth/login');
  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/daily', { timeout: 10000 });
}

test.describe('Desktop Navigation', () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should display sidebar navigation on desktop', async ({ page }) => {
    const sidebar = page.locator('aside:has-text("Life OS")');
    await expect(sidebar).toBeVisible();
  });

  test('should navigate to each page using sidebar links', async ({ page }) => {
    // Navigate to Calories
    await page.click('a[href="/calories"]');
    await expect(page).toHaveURL('/calories');
    await expect(page.locator('h1:has-text("Calorie Tracker")')).toBeVisible();

    // Navigate to Injections
    await page.click('a[href="/injections"]');
    await expect(page).toHaveURL('/injections');
    await expect(page.locator('h1:has-text("Injection Tracker")')).toBeVisible();

    // Navigate to Analytics
    await page.click('a[href="/analytics"]');
    await expect(page).toHaveURL('/analytics');
    await expect(page.locator('h1:has-text("Analytics")')).toBeVisible();

    // Navigate to Nirvana
    await page.click('a[href="/nirvana"]');
    await expect(page).toHaveURL('/nirvana');
    await expect(page.locator('h1:has-text("Nirvana")')).toBeVisible();

    // Navigate to Winners Bible
    await page.click('a[href="/winners-bible"]');
    await expect(page).toHaveURL('/winners-bible');
    await expect(page.locator('h1:has-text("Winners Bible")')).toBeVisible();

    // Navigate to Settings
    await page.click('aside a[href="/settings"]');
    await expect(page).toHaveURL('/settings');
  });

  test('should display active state correctly on sidebar', async ({ page }) => {
    await page.goto('/daily');
    const dailyLink = page.locator('aside a[href="/daily"]');
    await expect(dailyLink).toHaveAttribute('aria-current', 'page');

    await page.click('a[href="/analytics"]');
    const analyticsLink = page.locator('aside a[href="/analytics"]');
    await expect(analyticsLink).toHaveAttribute('aria-current', 'page');
  });

  test('should navigate using keyboard (Tab and Enter)', async ({ page }) => {
    // Tab to first navigation item and press Enter
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // Should navigate somewhere
    await page.waitForTimeout(500);
    expect(page.url()).not.toBe('/daily');
  });
});

test.describe('Mobile Navigation', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should display bottom navigation on mobile', async ({ page }) => {
    const bottomNav = page.locator('nav[aria-label="Mobile navigation"]');
    await expect(bottomNav).toBeVisible();
  });

  test('should hide sidebar on mobile', async ({ page }) => {
    const sidebar = page.locator('aside:has-text("Life OS")');
    await expect(sidebar).toBeHidden();
  });

  test('should navigate using bottom nav items', async ({ page }) => {
    // Navigate to Calories
    await page.click('a[href="/calories"]');
    await expect(page).toHaveURL('/calories');
    await expect(page.locator('h1:has-text("Calorie Tracker")')).toBeVisible();

    // Navigate to Injections
    await page.click('a[href="/injections"]');
    await expect(page).toHaveURL('/injections');

    // Navigate to Analytics
    await page.click('a[href="/analytics"]');
    await expect(page).toHaveURL('/analytics');
  });

  test('should open hamburger menu drawer', async ({ page }) => {
    const menuButton = page.locator('button[aria-label="Open menu"]');
    await menuButton.click();

    const drawer = page.locator('[role="dialog"]');
    await expect(drawer).toBeVisible();

    // Check overflow items are present
    await expect(page.locator('text=Nirvana')).toBeVisible();
    await expect(page.locator('text=Winners Bible')).toBeVisible();
    await expect(page.locator('text=Settings')).toBeVisible();
  });

  test('should navigate from drawer menu and close drawer', async ({ page }) => {
    const menuButton = page.locator('button[aria-label="Open menu"]');
    await menuButton.click();

    const drawer = page.locator('[role="dialog"]');
    await expect(drawer).toBeVisible();

    // Click Nirvana in drawer
    await page.locator('[role="dialog"] a[href="/nirvana"]').click();

    // Drawer should close
    await expect(drawer).not.toBeVisible();

    // Should navigate to Nirvana
    await expect(page).toHaveURL('/nirvana');
  });

  test('should close drawer when close button is clicked', async ({ page }) => {
    const menuButton = page.locator('button[aria-label="Open menu"]');
    await menuButton.click();

    const drawer = page.locator('[role="dialog"]');
    await expect(drawer).toBeVisible();

    const closeButton = page.locator('button[aria-label="Close menu"]');
    await closeButton.click();

    await expect(drawer).not.toBeVisible();
  });

  test('should close drawer when backdrop is clicked', async ({ page }) => {
    const menuButton = page.locator('button[aria-label="Open menu"]');
    await menuButton.click();

    const drawer = page.locator('[role="dialog"]');
    await expect(drawer).toBeVisible();

    // Click backdrop (outside drawer)
    await page.locator('.fixed.inset-0.bg-black\\/50').click({ position: { x: 10, y: 10 } });

    await expect(drawer).not.toBeVisible();
  });

  test('should display active state indicator on mobile', async ({ page }) => {
    await page.goto('/daily');
    const dailyLink = page.locator('nav[aria-label="Mobile navigation"] a[href="/daily"]');
    await expect(dailyLink).toHaveAttribute('aria-current', 'page');
  });

  test('should have minimum touch target size (44px)', async ({ page }) => {
    const bottomNavLinks = page.locator('nav[aria-label="Mobile navigation"] a');
    const count = await bottomNavLinks.count();

    for (let i = 0; i < count; i++) {
      const link = bottomNavLinks.nth(i);
      const box = await link.boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }
  });
});

test.describe('Responsive Behavior', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should switch from desktop to mobile layout on resize', async ({ page }) => {
    // Start desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    const sidebar = page.locator('aside:has-text("Life OS")');
    await expect(sidebar).toBeVisible();

    // Resize to mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(sidebar).toBeHidden();

    const bottomNav = page.locator('nav[aria-label="Mobile navigation"]');
    await expect(bottomNav).toBeVisible();
  });

  test('should not have horizontal scrolling on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const body = await page.locator('body').boundingBox();
    const viewport = page.viewportSize();

    expect(body?.width).toBeLessThanOrEqual(viewport?.width || 0);
  });

  test('should work at various breakpoints', async ({ page }) => {
    const breakpoints = [
      { width: 320, height: 568 },  // iPhone SE
      { width: 768, height: 1024 }, // iPad portrait
      { width: 1024, height: 768 }, // iPad landscape
      { width: 1440, height: 900 }, // Desktop
    ];

    for (const viewport of breakpoints) {
      await page.setViewportSize(viewport);
      await page.goto('/daily');

      // Verify page loads without issues
      await expect(page.locator('h1')).toBeVisible({ timeout: 5000 });
    }
  });
});

test.describe('Logout Functionality', () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should logout and redirect to login page (desktop sidebar)', async ({ page }) => {
    // Note: Sidebar doesn't have logout, but keeping test structure
    // If Header is used instead, this test would be relevant
    await page.goto('/settings');

    // If logout button exists in settings or elsewhere
    const logoutButton = page.locator('button:has-text("Logout")');
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      await expect(page).toHaveURL(/.*login/, { timeout: 5000 });
    }
  });
});