import { test, expect } from "@playwright/test";
import { PageObjects } from "./page-objects";


test.describe("Cart Functionality", () => {
    let token;

    test.beforeEach(async ({ page, request }) => {
        const response = await request.post("https://rahulshettyacademy.com/api/ecom/auth/login", {
            data: {
                userEmail: process.env.USER_EMAIL,
                userPassword: process.env.USER_PASSWORD
            },
            headers: {
                "Content-Type": "application/json"
            }
        });
        expect(response.ok()).toBeTruthy();

        const body = await response.json();
        token = body.token;

        await page.addInitScript(value => {
            window.localStorage.setItem("token", value)
        }, token)
    })

    test("Add single product to cart", async ({ page }) => {
        const pageObjects = new PageObjects(page);
        await pageObjects.goto();
        await pageObjects.addProductToCart("ZARA COAT 3");
        // add assertions to verify cart state
        await pageObjects.gotoCart();
        await expect(pageObjects.cartItems).toHaveText("ZARA COAT 3");
        await expect(pageObjects.cartItems).toHaveCount(1);
        await expect(pageObjects.cartItems).toBeVisible();
    })

    test("Add multiple products to cart", async ({ page }) => {
        const pageObjects = new PageObjects(page);
        await pageObjects.goto();
        await pageObjects.addProductToCart("ZARA COAT 3");
        await pageObjects.addProductToCart("ADIDAS ORIGINAL");
        await pageObjects.addProductToCart("IPHONE 13 PRO");
        // add assertions to verify cart state
        await pageObjects.gotoCart();
        await expect(pageObjects.cartItems).toHaveCount(3);
        for (let i = 0; i < pageObjects.expectedProducts.length; i++) {
            await expect(pageObjects.cartItems.nth(i)).toHaveText(new RegExp(pageObjects.expectedProducts[i], "i"));
            await expect(pageObjects.cartItems.nth(i)).toBeVisible();
        }

    })
})      