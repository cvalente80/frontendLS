import { test, expect } from '@playwright/test';

/**
 * Test suite for Auto Insurance Simulation
 * Tests the complete flow of calculating an insurance price based on provided information
 */

// Test data for insurance simulation
const testData = {
  personalInfo: {
    name: 'João Pedro Silva',
    email: 'joao.silva@example.com',
    nif: '123456789',
    birthDate: '01-01-1990',
    licenseDate: '01-01-2010',
    postalCode: '3100-000',
  },
  vehicleInfo: {
    brand: 'Ford',
    model: 'Focus',
    version: '1.0 EcoBoost Titanium',
    year: '2018',
    plate: '12-AB-34',
  },
  insuranceDetails: {
    type: 'Danos Próprios',
    // For "Danos Próprios" (Own Damage), these are the available additional coverages:
    additionalCoverages: ['Riscos catastróficos da natureza', 'Atos de vandalismo', 'Veículo de Substituição'],
    // For "Terceiros" (Third Party), you can use: ['Ocupantes', 'Vidros', 'Assistência em viagem']
    otherRequests: 'Gostaria de saber os preços com diferentes franquias',
  },
};

test.describe('Auto Insurance Simulation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the auto simulation page
    await page.goto('/pt/simulacao-auto');
    
    // Wait for the page to be fully loaded
    // Wait for network to be idle to ensure all scripts are loaded
    await page.waitForLoadState('networkidle');
    
    // Wait for the main heading to be visible (more flexible matching)
    await expect(page.locator('h2')).toContainText('Simulação');
  });

  test('should complete full insurance simulation flow', async ({ page }) => {
    // Step 1: Personal Information
    await test.step('Fill Step 1 - Personal Information', async () => {
      // Verify we're on step 1
      await expect(page.locator('h3').filter({ hasText: 'Passo 1' })).toBeVisible();

      // Fill name
      await page.fill('input[name="nome"]', testData.personalInfo.name);

      // Fill email
      await page.fill('input[name="email"]', testData.personalInfo.email);

      // Fill NIF
      await page.fill('input[name="contribuinte"]', testData.personalInfo.nif);

      // Fill birth date using manual input
      const birthDateInput = page.locator('input[placeholder*="Data de nascimento"]');
      await birthDateInput.click();
      await birthDateInput.fill(testData.personalInfo.birthDate);

      // Fill license date using manual input
      const licenseDateInput = page.locator('input[placeholder*="Carta de condução"]');
      await licenseDateInput.click();
      await licenseDateInput.fill(testData.personalInfo.licenseDate);

      // Fill postal code
      await page.fill('input[name="codigoPostal"]', testData.personalInfo.postalCode);

      // Click Next button
      await page.click('button:has-text("Próximo")');

      // Wait for step 2 to be visible
      await expect(page.locator('h3').filter({ hasText: 'Passo 2' })).toBeVisible();
    });

    // Step 2: Vehicle Information
    await test.step('Fill Step 2 - Vehicle Information', async () => {
      // Fill brand
      await page.fill('input[name="marca"]', testData.vehicleInfo.brand);

      // Fill model
      await page.fill('input[name="modelo"]', testData.vehicleInfo.model);

      // Fill version
      await page.fill('input[name="versao"]', testData.vehicleInfo.version);

      // Fill year
      await page.fill('input[name="ano"]', testData.vehicleInfo.year);

      // Fill plate
      await page.fill('input[name="matricula"]', testData.vehicleInfo.plate);

      // Click Next button
      await page.click('button:has-text("Próximo")');

      // Wait for step 3 to be visible
      await expect(page.locator('h3').filter({ hasText: 'Passo 3' })).toBeVisible();
    });

    // Step 3: Insurance Type and Coverage
    await test.step('Fill Step 3 - Insurance Type and Coverages', async () => {
      // Select insurance type
      await page.selectOption('select[name="tipoSeguro"]', testData.insuranceDetails.type);

      // Wait a bit for the form to process the selection
      await page.waitForTimeout(500);

      // Select additional coverages
      for (const coverage of testData.insuranceDetails.additionalCoverages) {
        const checkbox = page.locator(`input[type="checkbox"][value="${coverage}"]`);
        const isChecked = await checkbox.isChecked();
        if (!isChecked) {
          await checkbox.check();
        }
      }

      // Fill other requests
      await page.fill('textarea[name="outrosPedidos"]', testData.insuranceDetails.otherRequests);

      // Take a screenshot of the completed form
      await page.screenshot({ path: 'e2e/screenshots/form-completed.png', fullPage: true });

      // Verify the insurance type is correctly selected
      await expect(page.locator('select[name="tipoSeguro"]')).toHaveValue(testData.insuranceDetails.type);

      // NOTE: We stop here without clicking "Simular" because it requires:
      // 1. User authentication (the form calls requireAuth())
      // 2. EmailJS configuration which may not work in test environment
      // The test validates that the form can be filled correctly with all required information
    });
  });

  test('should validate required fields in step 1', async ({ page }) => {
    // Try to proceed without filling required fields
    await page.click('button:has-text("Próximo")');

    // Browser's native validation should prevent form submission
    // Check that we're still on step 1
    await expect(page.locator('h3').filter({ hasText: 'Passo 1' })).toBeVisible();
  });

  test('should validate age requirement (18+)', async ({ page }) => {
    // Fill with an underage birth date
    await page.fill('input[name="nome"]', 'Test User Minor');
    await page.fill('input[name="email"]', 'minor@test.com');
    await page.fill('input[name="contribuinte"]', '123456789');

    // Calculate a date for someone under 18
    const today = new Date();
    const underageDate = new Date(today.getFullYear() - 17, today.getMonth(), today.getDate());
    const dateStr = `${String(underageDate.getDate()).padStart(2, '0')}-${String(underageDate.getMonth() + 1).padStart(2, '0')}-${underageDate.getFullYear()}`;
    
    const birthDateInput = page.locator('input[placeholder*="Data de nascimento"]');
    await birthDateInput.click();
    await birthDateInput.fill(dateStr);

    await page.fill('input[name="codigoPostal"]', '3100-000');

    // Try to proceed
    await page.click('button:has-text("Próximo")');

    // Should show validation error
    await expect(page.locator('text=/18 anos ou mais/i')).toBeVisible({ timeout: 5000 });
  });

  test('should navigate back and forth between steps', async ({ page }) => {
    // Fill step 1 and proceed
    await page.fill('input[name="nome"]', testData.personalInfo.name);
    await page.fill('input[name="email"]', testData.personalInfo.email);
    await page.fill('input[name="contribuinte"]', testData.personalInfo.nif);
    
    const birthDateInput = page.locator('input[placeholder*="Data de nascimento"]');
    await birthDateInput.click();
    await birthDateInput.fill(testData.personalInfo.birthDate);

    await page.fill('input[name="codigoPostal"]', testData.personalInfo.postalCode);
    await page.click('button:has-text("Próximo")');

    // Verify we're on step 2
    await expect(page.locator('h3').filter({ hasText: 'Passo 2' })).toBeVisible();

    // Go back to step 1
    await page.click('button:has-text("Anterior")');

    // Verify we're back on step 1
    await expect(page.locator('h3').filter({ hasText: 'Passo 1' })).toBeVisible();

    // Verify data is preserved
    await expect(page.locator('input[name="nome"]')).toHaveValue(testData.personalInfo.name);
    await expect(page.locator('input[name="email"]')).toHaveValue(testData.personalInfo.email);
  });

  test('should pre-select coverages based on insurance type', async ({ page }) => {
    // Complete steps 1 and 2
    await page.fill('input[name="nome"]', testData.personalInfo.name);
    await page.fill('input[name="email"]', testData.personalInfo.email);
    await page.fill('input[name="contribuinte"]', testData.personalInfo.nif);
    
    const birthDateInput = page.locator('input[placeholder*="Data de nascimento"]');
    await birthDateInput.click();
    await birthDateInput.fill(testData.personalInfo.birthDate);

    await page.fill('input[name="codigoPostal"]', testData.personalInfo.postalCode);
    await page.click('button:has-text("Próximo")');

    await page.fill('input[name="marca"]', testData.vehicleInfo.brand);
    await page.fill('input[name="modelo"]', testData.vehicleInfo.model);
    await page.fill('input[name="ano"]', testData.vehicleInfo.year);
    await page.fill('input[name="matricula"]', testData.vehicleInfo.plate);
    await page.click('button:has-text("Próximo")');

    // Select "Terceiros" (Third Party)
    await page.selectOption('select[name="tipoSeguro"]', 'Terceiros');
    await page.waitForTimeout(500);

    // Verify some coverages are pre-selected for Third Party
    const ocupantesCheckbox = page.locator('input[type="checkbox"][value="Ocupantes"]');
    await expect(ocupantesCheckbox).toBeChecked();

    // Change to "Danos Próprios" (Own Damage)
    await page.selectOption('select[name="tipoSeguro"]', 'Danos Próprios');
    await page.waitForTimeout(500);

    // Verify additional base coverages are shown
    await expect(page.locator('text=/Choque, colisão|capotamento/i')).toBeVisible();
  });
});

test.describe('Auto Insurance Simulation with Different Scenarios', () => {
  test('should handle multiple vehicle brands', async ({ page }) => {
    await page.goto('/pt/simulacao-auto');

    const brands = ['Toyota', 'Volkswagen', 'Mercedes-Benz', 'BMW'];

    for (const brand of brands) {
      // Fill step 1
      await page.fill('input[name="nome"]', testData.personalInfo.name);
      await page.fill('input[name="email"]', testData.personalInfo.email);
      await page.fill('input[name="contribuinte"]', testData.personalInfo.nif);
      
      const birthDateInput = page.locator('input[placeholder*="Data de nascimento"]');
      await birthDateInput.click();
      await birthDateInput.fill(testData.personalInfo.birthDate);

      await page.fill('input[name="codigoPostal"]', testData.personalInfo.postalCode);
      await page.click('button:has-text("Próximo")');

      // Fill step 2 with different brand
      await page.fill('input[name="marca"]', brand);
      await page.fill('input[name="modelo"]', 'Test Model');
      await page.fill('input[name="ano"]', '2020');
      await page.fill('input[name="matricula"]', '99-ZZ-99');

      // Verify the brand was filled correctly
      await expect(page.locator('input[name="marca"]')).toHaveValue(brand);

      // Reload for next iteration
      if (brands.indexOf(brand) < brands.length - 1) {
        await page.reload();
        await page.waitForLoadState('domcontentloaded');
      }
    }
  });
});
