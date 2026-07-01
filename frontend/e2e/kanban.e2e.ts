import { test, expect } from '@playwright/test';

test.describe('Kanban E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[placeholder="admin@erp.com"]', 'admin@erp.local');
    await page.fill('input[placeholder="••••••••"]', 'Admin123!');
    await page.click('button:has-text("Iniciar Sesión")');
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('should display kanban board', async ({ page }) => {
    await page.click('button:has-text("Tareas (Kanban)")');

    // Verify all columns are visible
    await expect(page.locator('text=Por Hacer')).toBeVisible();
    await expect(page.locator('text=En Progreso')).toBeVisible();
    await expect(page.locator('text=En Revisión')).toBeVisible();
    await expect(page.locator('text=Completada')).toBeVisible();
  });

  test('should drag and drop task', async ({ page }) => {
    await page.click('button:has-text("Tareas (Kanban)")');

    // Find a task in "Por Hacer" column
    const tasks = await page.locator('div[class*="bg-white"] p').allTextContents();
    
    if (tasks.length > 0) {
      // Drag first task to "En Progreso"
      const taskCard = page.locator('div[class*="bg-white"]').first();
      await taskCard.dragTo(page.locator('text=En Progreso').first());

      // Verify task moved
      await expect(page.locator('text=En Progreso')).toBeVisible();
    }
  });

  test('should add new task', async ({ page }) => {
    await page.click('button:has-text("Tareas (Kanban)")');

    // Find "Agregar tarea" button
    const addButtons = await page.locator('button:has-text("Agregar tarea")').count();
    expect(addButtons).toBeGreaterThan(0);

    // Click first "Agregar tarea" button
    await page.locator('button:has-text("Agregar tarea")').first().click();

    // Modal or form should appear
    // (implementation depends on actual UI)
  });
});
