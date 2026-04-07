import { test, expect } from "@playwright/test";
import { PageObjects } from "./page-objects";

test.describe("Checkout Functionality", () => {
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

    test("Verify checkout flow", async ({ page }) => {
        const pageObjects = new PageObjects(page);
        await pageObjects.goto();
        await pageObjects.addProductToCart("ZARA COAT 3");
        await pageObjects.addProductToCart("ADIDAS ORIGINAL");
        await pageObjects.addProductToCart("IPHONE 13 PRO");
        await pageObjects.gotoCart();
        await expect(pageObjects.cartItems).toHaveCount(3);
        for (let i = 0; i < pageObjects.expectedProducts.length; i++) {
            await expect(pageObjects.cartItems.nth(i)).toHaveText(new RegExp(pageObjects.expectedProducts[i], "i"));
            await expect(pageObjects.cartItems.nth(i)).toBeVisible();
        }
        await pageObjects.checkoutProduct();
        expect(page.url()).toContain("https://rahulshettyacademy.com/client/#/dashboard/order?");
    })

    test("Verify empty cart behavior", async ({ page }) => {
        const pageObjects = new PageObjects(page);
        await pageObjects.goto();
        await pageObjects.gotoCart();
        await expect(pageObjects.emptyCartMsg).toBeVisible();
        await expect(pageObjects.toastContainer).toContainText("No Product in Your Cart");
        await expect(pageObjects.page.getByText("No Product in Your Cart")).toBeVisible();

    })

    test("User enters valid shipping country", async ({ page }) => {
        const pageObjects = new PageObjects(page);
        await pageObjects.goto();
        await pageObjects.addProductToCart("ZARA COAT 3");
        await pageObjects.gotoCart();
        await pageObjects.checkoutProduct();
        await pageObjects.placeOrderWithCountry("Nigeria");
        await expect(pageObjects.countryInput).toHaveValue("Nigeria");
        await pageObjects.placeOrder();
        await expect(pageObjects.placeOrderSuccessMsg).toBeVisible();
        expect(pageObjects.page.url()).toContain("https://rahulshettyacademy.com/client/#/dashboard/thanks?");
    })

    test("User enters invalid shipping country", async ({ page }) => {
        const pageObjects = new PageObjects(page);
        await pageObjects.goto();
        await pageObjects.addProductToCart("ZARA COAT 3");
        await pageObjects.gotoCart();
        await pageObjects.checkoutProduct();
        await pageObjects.placeOrderWithInvalidCountry("InvalidCountry");
        await expect(pageObjects.countryInput).toHaveValue("InvalidCountry");
        await pageObjects.placeOrder();
        await expect(pageObjects.placeOrderErrorMsg).toBeVisible();
        expect(pageObjects.page.url()).toContain("https://rahulshettyacademy.com/client/#/dashboard/order?");
    })

})