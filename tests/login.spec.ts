import { test as base, expect, Page } from '@playwright/test';
import path from 'path';

let page: Page;

// Login and select Stream project only once before all tests
const loginAndSelectProject = async (page: Page) => {
  await page.goto('https://vclabsqa.nirmaanxd.com', { timeout: 120000 });
  await page.waitForLoadState('networkidle');
  await page.pause();
  //await page.waitForSelector('input[type="email"]', { timeout: 30000 });
  await page.fill('input[type="email"], input[name="email"], input[placeholder*="Email"]', 'sheetalj@vconstruct.in');
  await page.fill('input[type="password"]', process.env.PASSWORD || 'Sheetal@1234');
  await page.click('button[type="submit"], button:has-text("Login")');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(/dashboard|home|project/i);
  // Search and select the project 'Stream'
  await page.fill('input[placeholder*="Search" i], input[type="search"]', 'Stream');
  await page.keyboard.press('Enter');
  await page.pause();

  //await page.getByRole('heading', { name: 'Nirmaan_Stream DC' }).click();
  //await expect(page.locator('div.MuiTypography-root.MuiTypography-body1.css-2mf0qd[title="Nirmaan_Stream DC"]')).toBeVisible({ timeout: 15000 });
  //await page.click('div.MuiTypography-root.MuiTypography-body1.css-2mf0qd[title="Nirmaan_Stream DC"]');

  await page.locator('div').filter({ hasText: /^Nirmaan_Stream DC$/ }).first().click();
  await expect(page).toHaveURL(/viewerdashboard/i);
};

// Reusable function to select and verify the Stream project
async function selectAndVerifyStreamProject(page: Page) {
  await page.fill('input[placeholder*="Search" i], input[type="search"]', 'Stream');
  await page.keyboard.press('Enter');
  await page.locator('div').filter({ hasText: /^Nirmaan_Stream DC$/ }).first().click();
  await expect(page).toHaveURL(/viewerdashboard/i);
}

// Role-based fixtures
const adminCredentials = {
  email: 'sheetalj@vconstruct.in',
  password: 'Sheetal@1234',
};

const editorCredentials = {
  email: 'tanmays@vconstruct.in',
  password: 'Tanmay@1234',
};

export const test = base.extend<{
  adminPage: Page;
  editorPage: Page;
}>({
  adminPage: async ({ browser }, use) => {
    const page = await browser.newPage();
    await page.goto('https://vclabsqa.nirmaanxd.com', { timeout: 120000 });
    await page.waitForLoadState('networkidle');
    await page.fill('input[type="email"], input[name="email"], input[placeholder*="Email"]', adminCredentials.email);
    await page.fill('input[type="password"]', adminCredentials.password);
    await page.click('button[type="submit"], button:has-text("Login")');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/dashboard|home|project/i);
    await use(page);
    await page.close();
  },
  editorPage: async ({ browser }, use) => {
    const page = await browser.newPage();
    await page.goto('https://vclabsqa.nirmaanxd.com', { timeout: 120000 });
    await page.waitForLoadState('networkidle');
    await page.fill('input[type="email"], input[name="email"], input[placeholder*="Email"]', editorCredentials.email);
    await page.fill('input[type="password"]', editorCredentials.password);
    await page.click('button[type="submit"], button:has-text("Login")');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/dashboard|home|project/i);
    await use(page);
    await page.close();
  },
});

test.describe.serial('Stream Project Tests', () => {
  test.beforeAll(async ({ browser }) => {
    // LOGIN only
    page = await browser.newPage();
    await page.goto('https://vclabsqa.nirmaanxd.com', { timeout: 120000 });
    await page.waitForLoadState('networkidle');
    await page.fill('input[type="email"], input[name="email"], input[placeholder*="Email"]', 'sheetalj@vconstruct.in');
    await page.fill('input[type="password"]', process.env.PASSWORD || 'Sheetal@1234');
    await page.click('button[type="submit"], button:has-text("Login")');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/dashboard|home|project/i);
  });

  test('Verify Stream project is open', async () => {
    // 2. VERIFY STREAM
    await expect(page.getByText('Nirmaan_Stream DC', { exact: true })).toBeVisible({ timeout: 20000 });
  });

  // test('Add new building in Scope of Work - Concrete', async () => {
  //   // Search and select the project 'Stream'
  //   await page.fill('input[placeholder*="Search" i], input[type="search"]', 'Stream');
  //   await page.keyboard.press('Enter');
  //   await page.locator('div').filter({ hasText: /^Nirmaan_Stream DC$/ }).first().click();
  //   await expect(page).toHaveURL(/viewerdashboard/i);
  //   // 3. ADD NEW BUILDING
  //   // Select Scope of Work: Concrete
  //   await page.pause();
  //   await page.waitForSelector('.MuiBackdrop-root', { state: 'detached', timeout: 20000 });
  //   await page.click("div[id=':r2:']");
  //   await page.getByRole('option', { name: 'Concrete', exact: true }).click();
    
  //   //Wait for the SVG icon to appear and take a screenshot for debugging
  //   //await page.waitForTimeout(2000); // Give the UI a moment to update
  //   //await page.screenshot({ path: 'before-svg-click.png' });


  //   //await page.waitForSelector('svg.MuiSvgIcon-root', { timeout: 15000 });

  //   await page.getByRole('button', { name: 'WBS', exact: true }).click();
  //   await page.getByTestId('accrdnBlg').click();
  //   try {
  //     //await page.waitForSelector('button:has-text("Add Building")', { timeout: 15000 });
  //     await page.getByRole('button', { name: 'Add Building' }).click();
  //   } catch (error) {
  //     await page.locator('button:has-text("Add Building")').click();
  //   }
  //   // await page.waitForSelector('div[role="menuitem"]:has-text("Concrete")', { timeout: 15000 });
  //   // await page.click('(//*[name()="path"])[17]');

  //   // await page.pause();
  //   // await page.screenshot({ path: 'before-add-building.png' });
  //   // await page.getByRole('button', { name: /Add Building/i }).click();

  //   await page.fill("(//input[@id='wbs-code'])[1]", '01');
  //   await page.fill("(//input[@id='wbs-name'])[1]", 'B1');
  //   // Click on Select All
  //   await page.click("(//input[@value='SelectAllinModel'])[1]");
  //   // Click Save
  //   await page.click('//button[normalize-space()="Save"]');
  //   // Wait for the save to complete and the next UI state to be ready
  //   await page.waitForTimeout(2000); // Adjust this timeout or use a more robust wait if possible
  //   // Do not close the page here; keep it open for further actions or inspection

  //   // Click on Next
  //   //await page.click('button.MuiButton-containedPrimary:has-text("Next")');

  //   // Click on Work Phase
  //   //await page.click('button.MuiButton-containedPrimary:has-text("Work Phase")');

  //   //Click on Auto Create
  //   await page.click("(//button[normalize-space()='Auto Create'])[1]");

  //   // Click on Confirm
  //   await page.waitForSelector('button[name="btnconfirm"]', { state: 'visible' });
  //   await page.click('button[name="btnconfirm"]', { force: true });

  //   //await page.click('xpath=id("panel2a-content")/div/div/div[2]/div/div[2]/button');
  //   //await page.click('xpath=/html/body/div[6]/div[3]/div/div[2]/button', { force: true });

  //   // Check SB Sub Structure and SB Super Structure checkboxes (adjust selectors as needed)
  //   const isChecked = await page.isVisible('div.my-checkbox-container svg[data-testid="CheckIcon"]');

  //   // // Click Next
  //   await page.click("(//button[@name='btnPhaseNxt'])[1]");

  //   // // Assert level (adjust selector as needed)
  //   await expect(page.getByTestId('accrdLvl')).toBeVisible();

  //   // // Click Auto Create
  //   await page.click('(//button[@name="btnLvlAutoCreate"])[1]');

  //   // // Click Confirm
  //   await page.click('(//button[normalize-space()="Confirm"])[1]', { force: true });

  //   // // Click Next
  //   //await page.click("(//button[@class='MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeSmall MuiButton-containedSizeSmall MuiButton-colorPrimary MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeSmall MuiButton-containedSizeSmall MuiButton-colorPrimary css-d9rai9'])[1]");

  //   await page.getByRole('button', { name: 'Next' }).click();

  //   await page.getByRole('button', { name: 'Add Area' }).click();
  //   await page.locator('#wbs-code').click();
  //   await page.locator('#wbs-code').fill('A01');
  //   await page.locator('#wbs-name').click();
  //   await page.locator('#wbs-name').fill('Area01');
  //   await page.getByRole('radio', { name: 'Manual Select' }).check();
  //   await page.getByRole('button', { name: 'WBS Review' }).click();
  //   await page.locator('.ag-icon.ag-icon-tree-closed').click();
  //   await page.getByRole('gridcell', { name: ' Press Space to toggle row selection (unchecked)  Revit Walls (231)' }).getByLabel('Press Space to toggle row').check();
  //   await page.getByRole('button', { name: 'Save' }).click();
  //   await page.getByRole('button', { name: 'Next' }).click();
  //   await page.getByRole('button', { name: 'Proceed to WBS' }).click();
  //   await page.getByRole('tab', { name: 'WBS Summary' }).click();

  //   await page.pause();

  //   // Assert all expected grid cells are visible in the WBS Summary grid
  //   await expect(page.getByRole('gridcell', { name: 'B1' })).toBeVisible();
  //   await expect(page.getByRole('gridcell', { name: 'Sub Structure' })).toBeVisible();
  //   await expect(page.getByRole('gridcell', { name: 'LEVEL' }).first()).toBeVisible();
  //   await expect(page.getByRole('gridcell', { name: 'Super Structure' })).toBeVisible();
  //   await expect(page.getByRole('gridcell', { name: 'LEVEL' }).nth(1)).toBeVisible();
  //   await expect(page.getByRole('gridcell', { name: 'Area01' })).toBeVisible();
  //   await expect(page.getByRole('gridcell', { name: 'Wall Formwork' })).toBeVisible();
  //   await expect(page.getByRole('gridcell', { name: 'Wall Rebar' })).toBeVisible();
  //   await expect(page.getByRole('gridcell', { name: 'Wall Pour' })).toBeVisible();
  //   await expect(page.getByRole('gridcell', { name: 'Wall Strip' })).toBeVisible();
  //   await expect(page.getByRole('gridcell', { name: 'L 1.5 - EXT STAIR TOS' })).toBeVisible();
  //   await expect(page.getByRole('gridcell', { name: 'LEVEL 2' })).toBeVisible();
  //   await expect(page.getByRole('gridcell', { name: 'ROOF', exact: true })).toBeVisible();
  //   await expect(page.getByRole('gridcell', { name: 'LOW EXT STAIR ROOF PLAN' })).toBeVisible();
  //   await expect(page.getByRole('gridcell', { name: 'CANOPY ROOF' })).toBeVisible();
  //   await expect(page.getByRole('gridcell', { name: 'CHILLER GRILLAGE' })).toBeVisible();
  //   await expect(page.getByRole('gridcell', { name: 'EXT STAIR ROOF', exact: true })).toBeVisible();

  //   //await page.pause();
  //   // // Assert Area (adjust selector as needed)
  //   // await expect(page.locator('text=Area')).toBeVisible();

  //   // // Add Area: give Code A01, Name Area01
  //   // await page.click("(//button[normalize-space()='Add Area'])[1]");
  //   // await page.fill("(//input[@id='wbs-code'])[1]", 'A01');
  //   // await page.waitForSelector("(//input[@id='wbs-name'])[1]", { timeout: 20000 });
  //   // await page.fill("(//input[@id='wbs-name'])[1]", 'Area01');

  //   // // // Click Manual Select
  //   // await page.click("(//input[@value='SelectinTable'])[1]");

  //   // // // Click on Data
  //   //   //await page.click("(//input[@id='ag-38-input'])[1]");

  //   // // // Click on Data Table
   
  //   // // Before clicking WBS Review, wait for any backdrop to disappear
  //   // await page.waitForSelector('.MuiBackdrop-root', { state: 'detached', timeout: 10000 });
  //   // const wbsButton = page.locator('button[aria-label="WBS Review"]');
  //   // await wbsButton.click();
  //   // await page.click('(//*[name()="path"])[19]');
    
  //   // // // Click the tree closed icon
  //   // await page.click("(//span[@class='ag-icon ag-icon-tree-closed'])[1]");

  //   // // Check the 6th visible checkbox with class 'ag-checkbox-input'
  //   // await page.check('div[row-index="5"] input[type="checkbox"]');

  //   // // // Click Save
  //   // await page.click("(//button[normalize-space()='Save'])[1]");
  // });

  // test('Open WBS Summary tab and click Reimport', async () => {


  //   // Assumes the Stream project is already selected and on the correct page after adding a building
  //   // Ensure WBS Summary tab is open
  //   await page.getByRole('tab', { name: 'WBS Summary' }).click();
  //   await expect(page.getByRole('tab', { name: 'WBS Summary' })).toHaveAttribute('aria-selected', 'true');

  //   // Click the Reimport button (update selector if needed)
  //   await page.getByRole('button', { name: 'Reimport' }).click();
  //   // Optionally, add an assertion for a success message or dialog
  //   // await expect(page.getByText('Reimport successful')).toBeVisible();

  //   // Assert each specified cell/text in the WBS Summary grid is visible (no clicks)
  //   await expect(page.getByRole('gridcell', { name: ' B1' }).locator('div').first()).toBeVisible();
  //   await expect(page.locator('#b-gantt-1-locked-1642').getByText('Sub Structure')).toBeVisible();
  //   await expect(page.locator('#b-gantt-1-locked-1643').getByText('LEVEL')).toBeVisible();
  //   await expect(page.locator('#b-gantt-1-locked-1644').getByText('Super Structure')).toBeVisible();
  //   await expect(page.locator('#b-gantt-1-locked-1645').getByText('LEVEL')).toBeVisible();
  //   await expect(page.locator('#b-gantt-1-locked-1646').getByText('Area01')).toBeVisible();
  //   await expect(page.locator('#b-gantt-1-locked-1647').getByText('Wall Rebar')).toBeVisible();
  //   await expect(page.locator('#b-gantt-1-locked-1649').getByText('Wall Pour')).toBeVisible();
  //   await expect(page.locator('#b-gantt-1-locked-1650').getByText('Wall Strip')).toBeVisible();
  //   await expect(page.locator('#b-gantt-1-locked-1651').getByText('L 1.5 - EXT STAIR TOS')).toBeVisible();
  //   await expect(page.locator('#b-gantt-1-locked-1652').getByText('LEVEL')).toBeVisible();
  //   await expect(page.locator('#b-gantt-1-locked-1653').getByText('ROOF')).toBeVisible();
  //   await expect(page.locator('#b-gantt-1-locked-1654').getByText('CANOPY ROOF')).toBeVisible();
  //   await expect(page.locator('#b-gantt-1-locked-1655').getByText('CHILLER GRILLAGE')).toBeVisible();
  //   await expect(page.locator('#b-gantt-1-locked-1656').getByText('EXT STAIR ROOF')).toBeVisible();
  // });

  // test('Add a new user via dashboard settings', async () => {
  //   // Go to dashboard (assumes already logged in)
  //   await expect(page).toHaveURL(/dashboard|home|project/i);
  //   await page.pause();

  //   // Open the main menu (update selector as needed)
  //   //await page.getByRole('button', { name: /profile/i }).click();
  //   await page.locator('svg').nth(2).click();
  //   await page.pause(); // Pause here to inspect the UI and get correct selectors

  //   // Click on the menu item 'Settings' (update selector as needed)
  //   await page.getByText('Settings', { exact: true }).click();

  //   // Click on 'User & License Management' (update selector as needed)
  //   await page.getByText('User & License Management', { exact: true }).click();

  //   // Click on 'Add user'
  //   // await page.getByRole('button', { name: 'Add user' }).click();

  //   // // Wait for the Add User dialog/window to appear
  //   // const dialog = page.getByRole('dialog');
  //   // await expect(dialog).toBeVisible();

  //   await page.getByRole('button', { name: 'Add User' }).click();
  //   await page.getByRole('textbox').click();
  //   await page.getByRole('textbox').fill('tanmays@vconstruct.in');
  //   await page.getByRole('textbox').press('Tab');
  //   await page.getByRole('combobox').first().click();
  //   await page.getByRole('option', { name: 'Editor', exact: true }).click();
  //   await page.getByRole('button', { name: 'Add' }).click();
  //   // Now interact with the email input inside the dialog
  //   // const emailInput = dialog.getByPlaceholder('Enter email address');
  //   // await emailInput.click();
  //   // await emailInput.fill('tanmays@vconstruct.in');
  //   // await page.keyboard.press('Tab');

  //   // // Click on the combobox and select 'editor'
  //   // const comboBox = page.getByRole('combobox');
  //   // await comboBox.click();
  //   // await page.getByRole('option', { name: 'Editor', exact: true }).click();

  //   // // Click on 'Add' to submit
  //   // await page.getByRole('button', { name: 'Add' }).click();

  //   // Optionally, assert that the user was added (e.g., by checking for a success message or the user's email in the list)
  //   // await expect(page.getByText('tanmays@vconstruct.in')).toBeVisible();
  // });

  test.afterAll(async () => {
    // await page.close(); // Keep the page open after all tests for inspection
  });
});

test.describe.serial('Full Flow: Add User, Add Building, WBS Summary Reimport', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('https://vclabsqa.nirmaanxd.com', { timeout: 120000 });
    await page.waitForLoadState('networkidle');
    await page.fill('input[type="email"], input[name="email"], input[placeholder*="Email"]', 'sheetalj@vconstruct.in');
    await page.fill('input[type="password"]', 'Sheetal@1234');
    await page.click('button[type="submit"], button:has-text("Login")');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/dashboard|home|project/i);
  });

  test('Add a new user via dashboard settings', async () => {
    await page.locator('svg').nth(2).click();
    await page.pause();
    await page.getByText('Settings', { exact: true }).click();
    await page.getByText('User & License Management', { exact: true }).click();
    await page.getByRole('button', { name: 'Add User' }).click();
    await page.getByRole('textbox').click();
    await page.getByRole('textbox').fill('tanmays@vconstruct.in');
    await page.getByRole('textbox').press('Tab');
    await page.getByRole('combobox').first().click();
    await page.getByRole('option', { name: 'Editor', exact: true }).click();
    await page.getByRole('button', { name: 'Add' }).click();
    //await expect(page.getByText('User added Successfully!')).toBeVisible({ timeout: 10000 });
  });

  test('Add new building in Scope of Work - Concrete', async () => {
    await page.goto('https://vclabsqa.nirmaanxd.com/dashboard');
    await selectAndVerifyStreamProject(page);
    await page.pause();
    await page.waitForSelector('.MuiBackdrop-root', { state: 'detached', timeout: 20000 });
    await page.click("div[id=':r2:']");
    await page.getByRole('option', { name: 'Concrete', exact: true }).click();
    await page.getByRole('button', { name: 'WBS', exact: true }).click();
    await page.getByTestId('accrdnBlg').click();
    try {
      await page.getByRole('button', { name: 'Add Building' }).click();
    } catch (error) {
      await page.locator('button:has-text("Add Building")').click();
    }
    await page.fill("(//input[@id='wbs-code'])[1]", 'B01');
    await page.fill("(//input[@id='wbs-name'])[1]", 'Build01');
    await page.getByRole('radio', { name: 'Select All' }).check();
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForTimeout(2000);
    await page.click("(//button[normalize-space()='Auto Create'])[1]");
    await page.waitForSelector('button[name="btnconfirm"]', { state: 'visible' });
    await page.click('button[name="btnconfirm"]', { force: true });
    await page.click("(//button[@name='btnPhaseNxt'])[1]");
    await expect(page.getByTestId('accrdLvl')).toBeVisible();
    await page.click('(//button[@name="btnLvlAutoCreate"])[1]');
    await page.click('(//button[normalize-space()="Confirm"])[1]', { force: true });
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Add Area' }).click();
    await page.locator('#wbs-code').click();
    await page.locator('#wbs-code').fill('A01');
    await page.locator('#wbs-name').click();
    await page.locator('#wbs-name').fill('Area01');
    await page.getByRole('radio', { name: 'Manual Select' }).check();
    await page.getByRole('button', { name: 'WBS Review' }).click();
    await page.locator('.ag-icon.ag-icon-tree-closed').click();
    await page.getByRole('gridcell', { name: ' Press Space to toggle row selection (unchecked)  Revit Walls (231)' }).getByLabel('Press Space to toggle row').check();
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Proceed to WBS' }).click();
    await page.getByRole('tab', { name: 'WBS Summary' }).click();
    await page.pause();
    const row = page.locator('[role="row"][aria-rowindex="2"]');
    await expect(row.locator('[col-id="WBSStructure"]')).toHaveText('Build01');
    await expect(row.locator('[col-id="WBSID"]')).toHaveText('B01');
  });

  test('Open WBS Summary tab and click Merge', async () => {
    await page.getByRole('tab', { name: 'WBS Summary' }).click();
    await expect(page.getByRole('tab', { name: 'WBS Summary' })).toHaveAttribute('aria-selected', 'true');
    try{
      await page.getByRole('button', { name: 'Merge' }).click();
    } catch (error) {
      await page.getByRole('button', { name: 'Reimport' }).click();
    }
    await page.pause();
  });
});

test.describe.serial('Editor role Workflow', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('https://vclabsqa.nirmaanxd.com', { timeout: 120000 });
    await page.waitForLoadState('networkidle');
    await page.fill('input[type="email"], input[name="email"], input[placeholder*="Email"]', 'tanmays@vconstruct.in');
    await page.fill('input[type="password"]', 'Tanmay@1234');
    await page.click('button[type="submit"], button:has-text("Login")');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/dashboard|home|project/i);
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('Login as Editor and validate dashboard', async () => {
    await expect(page).toHaveURL(/dashboard|home|project/i);
    // Optionally, check for a dashboard element
    // await expect(page.getByText('Dashboard')).toBeVisible({ timeout: 20000 });
  });

  test('Test Case 1: Request access for Mass Avenue NW Repositioning project', async () => {
    // Click on Request access button
    await page.getByRole('button', { name: 'Request Access' }).click();

    // Select Project Mass Avenue NW Repositioning from dropdown
    await page.getByRole('combobox', { name: 'Search project' }).click();
  await page.getByRole('combobox', { name: 'Search project' }).fill('stream');
  await page.getByRole('option', { name: 'Nirmaan_Stream DC' }).click();

    // Add text in Request note text box
    await page.locator('#request_note').click();
  await page.locator('#request_note').fill('Access Required');
  await page.getByRole('button', { name: 'Send Request' }).click();

    // Click on Send Request button
    await page.getByRole('button', { name: 'Create Project' }).click();

    // Optionally, assert success message or dialog
    // await expect(page.getByText('The Project access request was sent successfully')).toBeVisible({ timeout: 10000 });
  });

  test('Test Case 2: Create Blank Project from Dashboard', async () => {
    // Go to the main dashboard as the first step
    await page.goto('https://vclabsqa.nirmaanxd.com/dashboard');
// Search and select the project 'Stream'
await page.fill('input[placeholder*="Search" i], input[type="search"]', 'Test');
await page.keyboard.press('Enter');

    // Click on Create Project or similar button if needed
    // (Uncomment the next line if there is a main Create Project button)
    // await page.getByRole('button', { name: 'Create Project' }).click();
//-------------------------------------------------------------------------------------------------

    // Click on Create Blank Project
    await page.waitForSelector('[data-testid="KeyboardArrowDownIcon"]', { timeout: 10000 });
    await page.click('[data-testid="KeyboardArrowDownIcon"]');
    await page.getByRole('menuitem', { name: 'Create Blank Project' }).click();
    await page.getByRole('textbox').first().click();
    await page.getByRole('textbox').first().fill('TestLclUpld');
    await page.getByRole('combobox').first().click();
    await page.getByRole('combobox').first().fill('shee');
    await page.getByRole('option', { name: 'Sheetal Joshi' }).getByRole('checkbox').check();
    await page.getByText('Select Hub *Select Project *Project Name *Upload Preview ImageChoose').click();
    await page.getByRole('button', { name: 'Create Project' }).click();
    await page.getByText('Project Files').click();
    await page.getByRole('treeitem', { name: 'Project Files' }).getByRole('button').click();
    await page.getByRole('menuitem', { name: 'Add Subfolder' }).click();
    await page.getByRole('textbox', { name: 'Subfolder Name' }).click();
    await page.getByRole('textbox', { name: 'Subfolder Name' }).fill('TestSubFolder');
    await page.getByRole('button', { name: 'Add Subfolder' }).click();
    await page.getByText('TestSubFolder').click();
    await page.getByRole('treeitem', { name: 'TestSubFolder' }).getByRole('button').first().click();
    await page.getByRole('menuitem', { name: 'Upload File' }).click();
    await page.getByText('Upload Files').click();
    await page.pause();
    //await page.getByRole('button', { name: 'Upload Files' }).setInputFiles('C:/Users/sheetalj/Downloads/Nirmaan Testing Project (1).rvt');
    await page.getByRole('button', { name: 'Upload Files' }).setInputFiles('C:/Sheetal/VcLabs/Nirman/Test1.rvt');
    await page.getByRole('button', { name: 'Upload Model' }).click();
    await page.pause();
    await page.getByRole('treeitem', { name: 'Test1.' }).getByRole('button').first().click();
    //await page.pause();
    //await page.getByText('Model is Uploading , Current').click({ button: 'right' });
    //await page.pause();

    // Keep right-clicking until the upload is complete
const maxAttempts = 30;
let uploadComplete = false;
for (let i = 0; i < maxAttempts; i++) {
  //await page.getByTitle('Nirmaan Testing Project (1).').click({ button: 'right' });
  await page.getByRole('treeitem', { name: 'Test1.' }).getByRole('button').first().click();
  // Check for the completion message
  if (await page.locator('text=Model is Uploading , Current progress is : complete').isVisible({ timeout: 2000 }).catch(() => false)) {
    uploadComplete = true;
    break;
  }
  // Wait a bit before the next attempt
  await page.waitForTimeout(2000);
}
if (!uploadComplete) {
  throw new Error('Model upload did not complete within expected attempts.');
}

    //await page.pause();
    //await page.getByRole('treeitem', { name: '//Nirmaan Testing Project (1).' }).getByRole('button').nth(1).click();
    //await page.getByRole('treeitem', { name: 'Nirmaan Testing Project (1).' }).getByRole('button').nth(2).click();
    //await page.waitForSelector('[title="Nirmaan Testing Project (1)."]', { state: 'visible', timeout: 60000 });
    //await page.getByTitle('Nirmaan Testing Project (1).').click({ button: 'right' });
    //await page.getByTitle('Nirmaan Testing Project (1).').click();

    await page.getByRole('treeitem', { name: 'Test1.' }).getByRole('button').first().click();
    //await page.getByRole('treeitem', { name: 'Test1.' }).getByRole('button').click({button: 'right'});
    // await page.getByRole('button', { name: 'Select Scope of Work' }).click();
    // await page.getByRole('combobox', { name: 'Search Scope of Work' }).click();
    // await page.getByRole('option', { name: 'Concrete', exact: true }).getByRole('checkbox').check();
    // await page.getByRole('heading', { name: 'Scope of Work : Nirmaan' }).click();
    // await page.getByRole('button', { name: 'Update' }).click();
    // await page.getByRole('button', { name: 'Continue' }).click();
    // await page.getByRole('button', { name: 'Import' }).click();
    // await page.getByRole('tab', { name: 'Template' }).click();
    // await page.getByText('Select Template').click();y

    // await page.getByRole('option', { name: 'Suraj Concrete' }).click();
    // await page.getByRole('button', { name: 'Import' }).click();
    // await page.getByRole('button', { name: 'Load Project' }).click();

    // Locate the icon using its data-testid
  //const checkIcon = page.locator('[data-testid="CheckIcon"]');

  // Assert that the icon is visible
  // await expect(checkIcon).toBeVisible();
  //-------------------------------------------------------------------------------------------------
  await page.getByRole('button', { name: 'Select Scope of Work' }).click();
  await page.getByRole('combobox', { name: 'Search Scope of Work' }).fill('con');
  await page.getByRole('option', { name: 'Concrete', exact: true }).getByRole('checkbox').check();
  //await page.pause();
  await page.getByRole('button', { name: 'Update' }).click();

  const continueBtn = page.getByRole('button', { name: 'Continue' });
  await expect(continueBtn).toBeEnabled();
// Step 3: Click the "Continue" button
  await continueBtn.click();
  //await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Import' }).click();
  await page.getByRole('tab', { name: 'Template' }).click();
  await page.getByText('Select Template').click();
  await page.getByRole('option', { name: 'Suraj Concrete' }).click();
  await page.getByRole('button', { name: 'Import' }).click();
  //await page.getByRole('button', { name: 'Load Project' }).click();
  const loadProjectBtn = page.locator('button:has-text("Load Project")');
  await expect(loadProjectBtn).toBeVisible();
  await expect(loadProjectBtn).toBeEnabled();
  await loadProjectBtn.click();
  });
});

