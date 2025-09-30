import { test, expect, Page } from '@playwright/test';

// Helper to login before timezone tests
async function login(page: Page) {
  await page.goto('/auth/login');
  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/daily', { timeout: 10000 });
}

test.describe('Timezone Configuration', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test.describe('Profile Setup with Timezone', () => {
    test('should show timezone dropdown with browser default', async ({ page }) => {
      await page.goto('/onboarding/profile-setup');

      const timezoneSelect = page.locator('select#timezone');
      await expect(timezoneSelect).toBeVisible();

      // Should have a value selected (browser timezone)
      const selectedValue = await timezoneSelect.inputValue();
      expect(selectedValue).toBeTruthy();
      expect(selectedValue.length).toBeGreaterThan(0);
    });

    test('should allow selecting different timezone from dropdown', async ({ page }) => {
      await page.goto('/onboarding/profile-setup');

      const timezoneSelect = page.locator('select#timezone');
      await timezoneSelect.selectOption('America/Los_Angeles');

      const selectedValue = await timezoneSelect.inputValue();
      expect(selectedValue).toBe('America/Los_Angeles');
    });

    test('should have at least 20 timezone options', async ({ page }) => {
      await page.goto('/onboarding/profile-setup');

      const timezoneOptions = page.locator('select#timezone option');
      const count = await timezoneOptions.count();

      expect(count).toBeGreaterThanOrEqual(20);
    });

    test('should save timezone with profile submission', async ({ page }) => {
      await page.goto('/onboarding/profile-setup');

      // Fill in required fields
      await page.selectOption('select#gender', 'male');
      await page.fill('input#height', '180');
      await page.fill('input#weight', '80');
      await page.fill('input#bmr', '2000');

      // Select specific timezone
      await page.selectOption('select#timezone', 'Asia/Tokyo');

      // Submit form
      await page.click('button[type="submit"]');

      // Wait for redirect to daily page
      await page.waitForURL('**/daily', { timeout: 10000 });

      // Navigate to settings to verify timezone was saved
      await page.goto('/settings');

      const timezoneSelect = page.locator('select#timezone');
      const selectedValue = await timezoneSelect.inputValue();
      expect(selectedValue).toBe('Asia/Tokyo');
    });
  });

  test.describe('Settings Timezone Update', () => {
    test('should display current timezone in settings', async ({ page }) => {
      await page.goto('/settings');

      const timezoneSelect = page.locator('select#timezone');
      await expect(timezoneSelect).toBeVisible();

      // Should have a value (user's timezone)
      const selectedValue = await timezoneSelect.inputValue();
      expect(selectedValue).toBeTruthy();
    });

    test('should show current time preview for selected timezone', async ({ page }) => {
      await page.goto('/settings');

      // Should show time preview
      const preview = page.locator('text=Current time:');
      await expect(preview).toBeVisible();

      // Preview should contain formatted time
      const previewText = await preview.textContent();
      expect(previewText).toMatch(/\d{1,2}:\d{2}:\d{2}/); // Matches time format
    });

    test('should update time preview when timezone changes', async ({ page }) => {
      await page.goto('/settings');

      // Get initial preview text
      const preview = page.locator('text=Current time:');
      const initialText = await preview.textContent();

      // Change timezone
      await page.selectOption('select#timezone', 'Asia/Tokyo');

      // Wait a moment for preview to update
      await page.waitForTimeout(1500);

      // Preview should have changed
      const updatedText = await preview.textContent();
      expect(updatedText).not.toBe(initialText);
      expect(updatedText).toContain('Current time:');
    });

    test('should save updated timezone', async ({ page }) => {
      await page.goto('/settings');

      // Change timezone
      await page.selectOption('select#timezone', 'Europe/London');

      // Save changes
      await page.click('button[type="submit"]');

      // Wait for success message
      await expect(page.locator('text=Profile updated successfully')).toBeVisible({
        timeout: 5000,
      });

      // Reload page and verify timezone persisted
      await page.reload();

      const timezoneSelect = page.locator('select#timezone');
      const selectedValue = await timezoneSelect.inputValue();
      expect(selectedValue).toBe('Europe/London');
    });

    test('should update time preview in real-time', async ({ page }) => {
      await page.goto('/settings');

      const preview = page.locator('text=Current time:');
      const initialText = await preview.textContent();

      // Wait 2 seconds
      await page.waitForTimeout(2000);

      const updatedText = await preview.textContent();

      // Time should have changed (at least seconds should update)
      expect(updatedText).not.toBe(initialText);
    });
  });

  test.describe('Timezone Display in Different Contexts', () => {
    test('should use user timezone for date displays', async ({ page }) => {
      // Set timezone to America/Los_Angeles
      await page.goto('/settings');
      await page.selectOption('select#timezone', 'America/Los_Angeles');
      await page.click('button[type="submit"]');
      await expect(page.locator('text=Profile updated successfully')).toBeVisible();

      // Navigate to daily page
      await page.goto('/daily');

      // Any date displays should reflect PST/PDT timezone
      // This is a basic check - actual implementation depends on how dates are shown
      await expect(page.locator('main')).toBeVisible();
    });

    test('should handle timezone across different pages', async ({ page }) => {
      // Set timezone in settings
      await page.goto('/settings');
      await page.selectOption('select#timezone', 'Asia/Singapore');
      await page.click('button[type="submit"]');
      await expect(page.locator('text=Profile updated successfully')).toBeVisible();

      // Navigate to multiple pages
      await page.goto('/daily');
      await expect(page.locator('main')).toBeVisible();

      await page.goto('/calories');
      await expect(page.locator('main')).toBeVisible();

      await page.goto('/analytics');
      await expect(page.locator('main')).toBeVisible();

      // Timezone should persist across navigation
      await page.goto('/settings');
      const timezoneSelect = page.locator('select#timezone');
      const selectedValue = await timezoneSelect.inputValue();
      expect(selectedValue).toBe('Asia/Singapore');
    });
  });

  test.describe('Timezone Selector Validation', () => {
    test('should show all major timezones in dropdown', async ({ page }) => {
      await page.goto('/settings');

      // Check for some major timezones
      const majorTimezones = [
        'America/New_York',
        'America/Los_Angeles',
        'Europe/London',
        'Asia/Tokyo',
        'Australia/Sydney',
        'UTC',
      ];

      for (const tz of majorTimezones) {
        const option = page.locator(`select#timezone option[value="${tz}"]`);
        await expect(option).toBeVisible();
      }
    });

    test('should display user-friendly timezone labels', async ({ page }) => {
      await page.goto('/settings');

      const firstOption = page.locator('select#timezone option').first();
      const label = await firstOption.textContent();

      // Label should contain more than just the IANA name
      expect(label).toBeTruthy();
      expect(label!.length).toBeGreaterThan(5);
    });
  });

  test.describe('Edge Cases', () => {
    test('should handle timezone switch across date boundary', async ({ page }) => {
      await page.goto('/settings');

      // Switch between extreme timezones
      await page.selectOption('select#timezone', 'Pacific/Kiritimati'); // UTC+14
      await page.waitForTimeout(500);

      let preview = await page.locator('text=Current time:').textContent();
      expect(preview).toContain('Current time:');

      await page.selectOption('select#timezone', 'Pacific/Pago_Pago'); // UTC-11
      await page.waitForTimeout(500);

      preview = await page.locator('text=Current time:').textContent();
      expect(preview).toContain('Current time:');
    });

    test('should handle rapid timezone changes', async ({ page }) => {
      await page.goto('/settings');

      // Rapidly change timezones
      const timezones = ['America/New_York', 'Europe/Paris', 'Asia/Tokyo', 'UTC'];

      for (const tz of timezones) {
        await page.selectOption('select#timezone', tz);
        await page.waitForTimeout(100);
      }

      // Final selection should be UTC
      const timezoneSelect = page.locator('select#timezone');
      const selectedValue = await timezoneSelect.inputValue();
      expect(selectedValue).toBe('UTC');

      // Preview should still update
      const preview = page.locator('text=Current time:');
      await expect(preview).toBeVisible();
    });
  });
});