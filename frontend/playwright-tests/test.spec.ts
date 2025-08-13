import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

const username= 'testuser_frontend';
const password = 'password123';

// Create the user once before all tests
test.beforeAll(async ({ browser }) => {
  const page = await browser.newPage();

  await page.goto(`${BASE_URL}/create-user`);
  await page.getByTestId('create_user_form_name').fill('Test User');
  await page.getByTestId('create_user_form_email').fill(`${username}@example.com`);
  await page.getByTestId('create_user_form_username').fill(username);
  await page.getByTestId('create_user_form_password').fill(password);
  await page.getByTestId('create_user_form_create_user').click();



  await page.close();
});

async function login(page) {
  await page.goto(`${BASE_URL}/login`);
  await page.getByTestId('login_form_username').fill(username);
  await page.getByTestId('login_form_password').fill(password);
  await page.getByTestId('login_form_login').click();
  await expect(page).toHaveURL(BASE_URL);
}

test('Create a new user and log in', async ({ page }) => {
  test.setTimeout(15000);
  await page.waitForTimeout(10000); 
  await login(page);
});

test('Logout clears token and returns to guest view', async ({ page }) => {
  await login(page);
  await page.getByTestId('logout').click();
  await expect(page.getByTestId('go_to_login_button')).toBeVisible();
  await expect(page.getByTestId('go_to_create_user_button')).toBeVisible();
});

test('Add a new note', async ({ page }) => {
  await login(page);
  await page.getByTestId('add_new_note').click();
  await page.getByTestId('text_input_new_note').fill('Playwright note');
  await page.getByTestId('text_input_save_new_note').click();

  const newest = page.locator('div.note').first();
  await expect(newest).toContainText('Playwright note');
});

test('Edit first note', async ({ page }) => {
  await login(page);

  const first = page.locator('div.note').first();
  const id = await first.getAttribute('data-testid');

  await page.getByTestId(`edit-${id}`).click();
  await page.getByTestId(`text_input-${id}`).fill('Edited by Playwright');
  await page.getByTestId(`text_input_save-${id}`).click();

  await expect(first).toContainText('Edited by Playwright');
});

test('Delete first note', async ({ page }) => {
  await login(page);

  const first = page.locator('div.note').first();
  const id = await first.getAttribute('data-testid');

  await page.getByTestId(`delete-${id}`).click();
  await expect(page.locator(`div[data-testid="${id}"]`)).toHaveCount(0);
});
