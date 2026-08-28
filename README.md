# E-Commerce Playwright Automation Suite

[![Playwright](https://img.shields.io/badge/Playwright-45ba4b?style=flat&logo=playwright&logoColor=white)](https://playwright.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/docs/Web/JavaScript)
[![Playwright Tests](https://github.com/Munachimso2/e-commerce-playwright-suite/actions/workflows/playwright.yml/badge.svg)](https://github.com/Munachimso2/e-commerce-playwright-suite/actions/workflows/playwright.yml)

A production-style Playwright and JavaScript portfolio project for a realistic e-commerce application. The suite combines browser automation with direct API calls so test setup is faster, scenarios remain focused, and UI assertions validate the customer experience that matters.

## Quality engineering approach

- **Hybrid API/UI automation:** authenticates and creates test orders through REST endpoints, then verifies the resulting state in the browser.
- **API-assisted setup:** avoids repeating slow UI setup when login itself is not the behavior under test.
- **Token-based session bootstrap:** injects the API-issued token into `localStorage` before navigation.
- **Reusable test design:** centralizes selectors and business actions in a Page Object Model and includes an extended Playwright fixture for shared authentication setup.
- **Risk-based coverage:** combines positive customer journeys with negative cases for authentication, search, cart state, and shipping data.
- **CI/CD readiness:** GitHub Actions installs Chromium, runs the suite with encrypted repository secrets, and retains the HTML report as an artifact.

## Automated coverage

| Area | Implemented scenarios |
|---|---|
| Authentication | Valid login, invalid password, invalid email, required-field validation, logout |
| Product catalogue | Product rendering, search, product name and price checks, no-result behavior |
| Cart | Add one or multiple products, item-count and content assertions, empty-cart behavior |
| Checkout | Cart-to-checkout navigation, valid country selection, invalid shipping-country handling, successful order placement |
| Orders | UI-created order verification, order-history checks, API-created order verified through the UI |

The repository also contains a separate account-creation scenario for Sabbath Mission; the core portfolio case study is the e-commerce suite described above.

## Project structure

```text
├── .github/workflows/playwright.yml  # CI workflow and report artifact
├── cart-features.spec.js             # Cart scenarios
├── checkout.spec.js                  # Checkout and shipping scenarios
├── fixtures.spec.js                  # Reusable API-auth fixture
├── login-automation.spec.js          # Authentication scenarios
├── orderPage.spec.js                 # UI and API-assisted order tests
├── page-objects.js                   # Shared selectors and business actions
├── product-catalogue.spec.js         # Catalogue and search scenarios
└── playwright.config.js              # Playwright configuration
```

## Run locally

### Prerequisites

- Node.js 18 or later
- A dedicated test account for the target demo application

```bash
git clone https://github.com/Munachimso2/e-commerce-playwright-suite.git
cd e-commerce-playwright-suite
npm install
npx playwright install chromium
```

Create a local `.env` file. Never commit real credentials:

```env
USER_EMAIL=your_test_email@example.com
USER_PASSWORD=your_test_password
```

Run the suite and open the HTML report:

```bash
npx playwright test
npx playwright show-report
```

## CI and secret handling

The GitHub Actions workflow runs on pushes and pull requests to `main`. `USER_EMAIL` and `USER_PASSWORD` are read from encrypted GitHub Actions secrets; credentials are not stored in the workflow or documentation. The report upload step runs even when a test fails, supporting faster diagnosis.

## Responsible AI-assisted QA

AI may be used to support test-idea generation, edge-case discovery, refactoring suggestions, and documentation. Every generated suggestion should be reviewed by a human, traced to a test objective, and validated against the application before it is accepted. Secrets and personal data must never be submitted in prompts or committed to the repository.

## Author

**Affia David Okafor** — QA Automation Engineer
[GitHub](https://github.com/Munachimso2) · [LinkedIn](https://linkedin.com/in/affia-david-okafor-155407189)
