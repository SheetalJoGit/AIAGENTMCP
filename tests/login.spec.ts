import { test, expect } from '@playwright/test';

test.describe('Login Tests', () => {
    test('should successfully login to Rahul Shetty Academy', async ({ page }) => {
        // Navigate to the login page
        await page.goto('https://rahulshettyacademy.com/loginpagePractise/');

        // Verify we're on the login page
        await expect(page).toHaveTitle(/LoginPage Practise/);

        // Fill in login credentials
        await page.locator('#username').fill('rahulshettyacademy');
        await page.locator('#password').fill('learning');

        // Click sign in button
        await page.locator('#signInBtn').click();

        // Verify successful login by checking if we're redirected to the shop page
        await expect(page).toHaveURL(/.*shop/);
        await expect(page.locator('.nav-item.active')).toContainText('Shop');
    });
});
