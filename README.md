# E-Commerce Playwright Test Suite

![Playwright](https://img.shields.io/badge/Playwright-45ba4b?style=flat&logo=playwright&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![CI](https://img.shields.io/github/actions/workflow/status/YOUR_USERNAME/e-commerce-playwright-suite/playwright.yml?label=CI&style=flat)

End-to-end test automation suite for a production-like e-commerce platform, built with Playwright and JavaScript. Covers the full user journey from login through checkout, including API-level optimisations and negative test scenarios.

## What's tested

| Module | Scenarios covered |
|---|---|
| **Login** | Valid login, invalid password, invalid email, empty fields, logout |
| **Product catalogue** | Products load after login, search by name, correct name/price display, no results for invalid search |
| **Cart** | Add single product, add multiple products, empty cart state |
| **Checkout** | Full checkout flow, valid country, invalid country, URL verification at each step |
| **Orders** | Create order and verify in history, order ID persistence, API-created order appears in UI |

## Technical highlights

- **API-accelerated authentication** — bypasses login UI using token injection into localStorage
- **Custom Playwright fixtures** — shared login fixture reused across all test files
- **API + UI hybrid testing** — creates orders via REST API then verifies in the browser
- **Page Object Model** — all selectors and actions centralised in page-objects.js
- **Negative test coverage** — invalid country, wrong password, empty fields, no search results

## Project structure

\`\`\`
├── cart-features.spec.js
├── checkout.spec.js
├── fixtures.spec.js
├── login-automation.spec.js
├── orderPage.spec.js
├── page-objects.js
├── product-catalogue.spec.js
├── sabbath-mission.spec.js
├── playwright.config.js
└── .github/workflows/playwright.yml
\`\`\`

## Running locally

\`\`\`bash
git clone https://github.com/Munachimso2/e-commerce-playwright-suite.git
cd e-commerce-playwright-suite
npm install
npx playwright install
\`\`\`

Create a \`.env\` file:
\`\`\`
USER_EMAIL=dokafor77@gmail.com
USER_PASSWORD=Secure123
\`\`\`

Run all tests:
\`\`\`bash
npx playwright test
\`\`\`

View the report:
\`\`\`bash
npx playwright show-report
\`\`\`

## Author

**David Okafor** — Junior QA Automation Engineer
[GitHub](https://github.com/Munachimso2) · [LinkedIn](https://linkedin.com/in/affia-david-okafor-155407189)
