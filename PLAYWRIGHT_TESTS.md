# Playwright E2E Tests - Quick Start Guide

This project now includes automated end-to-end (E2E) tests using Playwright to test the insurance simulation functionality.

## What Was Added

✅ **Playwright Testing Framework** - Automated browser testing
✅ **Insurance Simulation Test** - Complete flow testing from start to finish
✅ **Test Configuration** - Ready-to-use setup with screenshots and traces
✅ **Test Environment** - Mock Firebase configuration for testing

## Running the Tests

### Quick Start

```bash
# Install dependencies (if not already done)
npm install

# Run all E2E tests
npm run test:e2e

# Run tests in UI mode (interactive)
npm run test:e2e:ui

# Run tests with visible browser
npm run test:e2e:headed
```

### What the Tests Do

The main test (`should complete full insurance simulation flow`) automates a complete insurance quote request:

1. **Step 1 - Personal Information**
   - Fills in full name, email, NIF (tax ID)
   - Sets birth date and driver's license date
   - Enters postal code

2. **Step 2 - Vehicle Information**
   - Enters car brand, model, version
   - Sets year and license plate

3. **Step 3 - Insurance Selection**
   - Selects insurance type (Third Party / Own Damage)
   - Chooses additional coverage options
   - Adds custom requests

### Test Results

After running tests, you'll find:
- **HTML Report**: `npx playwright show-report`
- **Screenshots**: `e2e/screenshots/` (generated during tests)
- **Test Results**: `test-results/` (detailed logs and traces)

## Test Coverage

Current tests include:
- ✅ Complete simulation flow (3 steps)
- ✅ Field validation
- ✅ Age requirement validation (18+)
- ✅ Navigation between steps
- ✅ Coverage pre-selection based on insurance type
- ✅ Multi-brand vehicle support

## Documentation

For detailed documentation, see:
- **E2E Tests README**: [e2e/README.md](e2e/README.md)
- **Playwright Config**: [playwright.config.ts](playwright.config.ts)
- **Test File**: [e2e/insurance-auto-simulation.spec.ts](e2e/insurance-auto-simulation.spec.ts)

## Environment Setup

Tests use a `.env.local` file with Firebase configuration. For local testing, a `.env.test` file with dummy values is provided.

## CI/CD Integration

Tests are configured to run in CI environments with:
- Automatic retry on failure
- Screenshot capture on errors
- Trace recording for debugging

---

**Need Help?** Check the [e2e/README.md](e2e/README.md) for more details or run `npx playwright --help`
