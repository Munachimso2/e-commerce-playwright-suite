import { test, expect } from "@playwright/test";
import { PageObjects } from "./page-objects";

const validCredentials = {
    userEmail: process.env.USER_EMAIL,
    userPassword: process.env.USER_PASSWORD
}
let token;


test.describe("product listing", () => {

    test.beforeEach(async ({ page, request }) => {
        const response = await request.post("https://rahulshettyacademy.com/api/ecom/auth/login", {
            data: validCredentials,
            headers: {
                "Content-Type": "application/json"
            }
        })
        expect(response.ok()).toBeTruthy()
        const body = await response.json()
        token = body.token


        await page.addInitScript(value => {
            window.localStorage.setItem("token", value)
        }, token)
    })


    test("products load successfully after login", async ({ page }) => {
        const pageObjects = new PageObjects(page)
        await pageObjects.goto()
        await page.waitForLoadState("networkidle")
        const productsCount = await pageObjects.getTotalProducts()
        expect(productsCount).toBeGreaterThan(0)
        for (let i = 0; i < productsCount; i++) {
            const element = pageObjects.allProducts.nth(i)
            await expect(element).toBeVisible()
        }
    })

    test("user can search for a product", async ({ page }) => {
        const pageObjects = new PageObjects(page);
        await pageObjects.goto();
        await pageObjects.search("ZARA COAT 3");
        // input should reflect the query
        await expect(pageObjects.searchBox).toHaveValue("ZARA COAT 3");
        // only the matching product should remain
        await expect(pageObjects.zaraProduct).toBeVisible();
        await expect(pageObjects.allProducts).toHaveCount(1);
        // unrelated items should be hidden
        await expect(pageObjects.adidas).not.toBeVisible();
    })

    test("Product card shows correct name and price.", async ({ page }) => {
        const pageObjects = new PageObjects(page)
        await pageObjects.goto()
        await pageObjects.search("ZARA COAT 3")
        await expect(pageObjects.searchBox).toHaveValue("ZARA COAT 3")
        await expect(pageObjects.zaraProduct).toBeVisible()
        await expect(pageObjects.zaraProduct).toContainText("ZARA COAT 3")
        await expect(pageObjects.zaraProduct).toContainText("$ 11500")
        await expect(pageObjects.adidas).toBeHidden()
        await expect(pageObjects.iphone).toBeHidden()
        await expect(pageObjects.allProducts).toHaveCount(1)
    })

    test("Search with non existing product returns empty results.", async ({ page }) => {
        const pageObjects = new PageObjects(page)
        await pageObjects.goto()
        await pageObjects.search("Ado")
        await expect(pageObjects.searchBox).toHaveValue("Ado")
        await expect(pageObjects.allProducts).not.toBeVisible()
        await expect(pageObjects.allProducts).toHaveCount(0)
    })

})