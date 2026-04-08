# End-to-End Tests with Playwright

This directory contains end-to-end (E2E) tests for the insurance simulation application using Playwright.

## Overview

The E2E tests automate the complete user flow for insurance price calculation, simulating real user interactions with the application. The tests fill out the multi-step insurance simulation form and validate that all fields can be properly populated.

![Insurance Simulation Test](https://github.com/user-attachments/assets/23c526a1-0d07-46e9-a570-23404a1394ad)
*Screenshot showing the completed insurance simulation form at step 3*

## Test Files

### `insurance-auto-simulation.spec.ts`

Tests the complete auto insurance simulation flow including:

1. **Personal Information (Step 1)**
   - Full name
   - Email address
   - NIF (tax identification number)
   - Birth date
   - Driver's license date
   - Postal code

2. **Vehicle Information (Step 2)**
   - Car brand
   - Car model
   - Version
   - Year
   - License plate

3. **Insurance Type and Coverage (Step 3)**
   - Insurance type selection (Third Party / Own Damage)
   - Additional coverage options
   - Other requests/observations
   - RGPD policy acceptance

## Test Scenarios

The test suite includes:

- **Full simulation flow**: Complete insurance quote from start to finish
- **Field validation**: Tests for required fields and data validation
- **Age requirement**: Validates 18+ age restriction
- **Navigation**: Tests back and forth navigation between steps
- **Coverage pre-selection**: Validates automatic coverage selection based on insurance type
- **Multiple brands**: Tests with different vehicle brands

## Running the Tests

### Prerequisites

Make sure you have installed all dependencies:

```bash
npm install
```

### Environment Configuration

The tests require Firebase environment variables to be set. For testing purposes, a `.env.local` file with test credentials is used. If you need to run tests in a CI environment or locally, ensure you have a `.env.local` file in the project root with the following variables:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

**Note**: A `.env.test` file with dummy values is included for local testing that doesn't require actual Firebase connectivity.

### Run tests in headless mode (default)

```bash
npm run test:e2e
```

### Run tests with UI mode (interactive)

```bash
npm run test:e2e:ui
```

### Run tests in headed mode (see the browser)

```bash
npm run test:e2e:headed
```

### Run specific test file

```bash
npx playwright test e2e/insurance-auto-simulation.spec.ts
```

### Run tests with specific browser

```bash
npx playwright test --project=chromium
```

## Test Configuration

The Playwright configuration is defined in `playwright.config.ts`:

- **Base URL**: http://localhost:5175
- **Dev Server**: Automatically starts the Vite dev server before running tests
- **Browser**: Chromium (Chrome)
- **Screenshots**: Captured on failure
- **Traces**: Recorded on first retry

## Test Data

The tests use predefined test data located in the test file:

```typescript
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
    additionalCoverages: ['Ocupantes', 'Vidros', 'Assistência em viagem'],
    otherRequests: 'Gostaria de saber os preços com diferentes franquias',
  },
};
```

You can modify this data to test different scenarios.

## Screenshots

Screenshots are automatically captured:
- Before form submission
- After successful submission
- On test failures

Screenshots are saved to `e2e/screenshots/` directory (ignored by git).

## Test Reports

After running tests, you can view detailed HTML reports:

```bash
npx playwright show-report
```

## Debugging Tests

### Debug specific test

```bash
npx playwright test --debug e2e/insurance-auto-simulation.spec.ts
```

### Debug with specific test name

```bash
npx playwright test --debug -g "should complete full insurance simulation flow"
```

### Use Playwright Inspector

The `--debug` flag automatically opens the Playwright Inspector where you can:
- Step through tests
- View DOM snapshots
- Inspect locators
- Record new tests

## CI/CD Integration

The tests are configured to run in CI environments with:
- 2 retries on failure
- Single worker (no parallel execution)
- Automatic browser installation

## Best Practices

1. **Stable Selectors**: Tests use stable selectors (name attributes, text content) to avoid brittleness
2. **Wait Strategies**: Tests use Playwright's auto-waiting capabilities
3. **Isolated Tests**: Each test is independent and can run in any order
4. **Test Data**: Uses realistic test data that matches validation rules
5. **Error Handling**: Tests include proper validation and error scenarios

## Troubleshooting

### Port already in use

If port 5175 is already in use, the webServer config will reuse the existing server.

### Tests timing out

Increase the timeout in `playwright.config.ts`:

```typescript
use: {
  timeout: 30000, // 30 seconds per test action
}
```

### Browser not installed

Run:

```bash
npx playwright install chromium
```

## Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright Test API](https://playwright.dev/docs/api/class-test)
