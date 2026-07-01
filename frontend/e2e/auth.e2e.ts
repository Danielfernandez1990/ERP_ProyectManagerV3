import { test, expect } from '@playwright/test';

test.describe('Authentication E2E', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto('/login');

    // Fill form
    await page.fill('input[placeholder="admin@erp.com"]', 'admin@erp.local');
    await page.fill('input[placeholder="••••••••"]', 'Admin123!');

    // Submit
    await page.click('button:has-text("Iniciar Sesión")');

    // Verify redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login');

    // Fill with wrong credentials
    await page.fill('input[placeholder="admin@erp.com"]', 'wrong@example.com');
    await page.fill('input[placeholder="••••••••"]', 'WrongPassword123!');

    // Submit
    await page.click('button:has-text("Iniciar Sesión")');

    // Should stay on login page
    await expect(page).toHaveURL('/login');
  });

  test('should navigate to register', async ({ page }) => {
    await page.goto('/login');

    // Click create account link
    await page.click('button:has-text("Crear cuenta")');

    // Should navigate to register
    await expect(page).toHaveURL('/register');
  });
});

test.describe('Dashboard E2E', () => {
  test('should display dashboard after login', async ({ page }) => {
    await page.goto('/login');

    // Login
    await page.fill('input[placeholder="admin@erp.com"]', 'admin@erp.local');
    await page.fill('input[placeholder="••••••••"]', 'Admin123!');
    await page.click('button:has-text("Iniciar Sesión")');

    // Wait for dashboard
    await expect(page.locator('text=Dashboard')).toBeVisible();

    // Verify KPI cards are displayed
    await expect(page.locator('text=Usuarios Activos')).toBeVisible();
    await expect(page.locator('text=Clientes')).toBeVisible();
    await expect(page.locator('text=Productos')).toBeVisible();
    await expect(page.locator('text=Plan')).toBeVisible();
  });

  test('should navigate between pages', async ({ page }) => {
    await page.goto('/login');

    // Login
    await page.fill('input[placeholder="admin@erp.com"]', 'admin@erp.local');
    await page.fill('input[placeholder="••••••••"]', 'Admin123!');
    await page.click('button:has-text("Iniciar Sesión")');

    // Wait for dashboard
    await expect(page.locator('text=Dashboard')).toBeVisible();

    // Navigate to Usuarios
    await page.click('button:has-text("Usuarios")');
    await expect(page.locator('text=Usuarios')).toBeVisible();

    // Navigate to Kanban
    await page.click('button:has-text("Tareas (Kanban)")');
    await expect(page.locator('text=Kanban')).toBeVisible();

    // Navigate to Chat
    await page.click('button:has-text("Chat")');
    await expect(page.locator('text=Chat')).toBeVisible();
  });
});

test.describe('Logout E2E', () => {
  test('should logout successfully', async ({ page }) => {
    await page.goto('/login');

    // Login
    await page.fill('input[placeholder="admin@erp.com"]', 'admin@erp.local');
    await page.fill('input[placeholder="••••••••"]', 'Admin123!');
    await page.click('button:has-text("Iniciar Sesión")');

    // Wait for dashboard
    await expect(page.locator('text=Dashboard')).toBeVisible();

    // Logout
    await page.click('button[aria-label="logout"]'); // LogOut icon button

    // Should redirect to login
    await expect(page).toHaveURL('/login');
  });
});
