import { test, expect } from '@playwright/test';

test.describe('E-commerce Flow Tests', () => {
    test('should add iPhone X to cart and checkout successfully', async ({ page }) => {
        // Navigate to the login page
        await page.goto('https://rahulshettyacademy.com/loginpagePractise/');

        // Login
        await page.locator('#username').fill('rahulshettyacademy');
        await page.locator('#password').fill('learning');
        await page.locator('#signInBtn').click();

        // Wait for navigation to shop page
        await expect(page).toHaveURL(/.*shop/);

        // Find and click Add to Cart button for iPhone X
        const cards = await page.locator('.card');
        const count = await cards.count();

        for (let i = 0; i < count; i++) {
            const title = await cards.nth(i).locator('.card-title').textContent();
            if (title && title.includes('iphone X')) {
                await cards.nth(i).locator('button').click();
                break;
            }
        }

        // Click on Cart link
        await page.locator('a.nav-link.btn.btn-primary').click();

        // Verify iPhone X is in the cart
        const cartItems = await page.locator('h4.media-heading');
        await expect(cartItems).toContainText('iphone X');

        // Verify cart total
        const cartTotal = await page.locator('td.text-right h3');
        await expect(cartTotal).toBeTruthy();

        // Proceed to checkout
        await page.locator('.btn-success').click();

        // Verify we're on the checkout page
        await expect(page).toHaveURL(/.*country/);

        // Success message should be visible
        const alert = page.locator('.alert-success');
        await expect(alert).toBeVisible();
        await expect(alert).toContainText('Success!');
    });
});
