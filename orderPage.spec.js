import { test } from "@playwright/test";
import { expect } from "@playwright/test";
import { PageObjects } from "./page-objects";

test.describe("Order Page Functionality", () => {
    test.beforeEach(async ({ page, request }) => {
        const response = await request.post("https://rahulshettyacademy.com/api/ecom/auth/login", {
            data: {
                userEmail: process.env.USER_EMAIL,
                userPassword: process.env.USER_PASSWORD
            }
        });
        expect(response.ok()).toBeTruthy();
        const { token } = await response.json();
        await page.addInitScript(value => {
            window.localStorage.setItem("token", value);
        }, token);
        const pageObjects = new PageObjects(page);
        await pageObjects.goto();
        await pageObjects.clearCart();
    });

    test("Create an order and verify order details", async ({ page }) => {
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
        await pageObjects.placeOrderWithCountry("Nigeria");
        await pageObjects.placeOrder();
        await expect(pageObjects.placeOrderSuccessMsg).toBeVisible();
        expect(pageObjects.page.url()).toContain("https://rahulshettyacademy.com/client/#/dashboard/thanks?");
        await pageObjects.gotoOrders();
        await expect(pageObjects.ordersTable).toBeVisible();
        await expect(pageObjects.ordersTable).toContainText("ZARA COAT 3", { ignoreCase: true });
        await expect(pageObjects.ordersTable).toContainText("ADIDAS ORIGINAL", { ignoreCase: true });
        await expect(pageObjects.ordersTable).toContainText("IPHONE 13 PRO", { ignoreCase: true });
    });

    test('create an order with ID and verify it appears in the orders list', async ({ page }) => {
        const pageObjects = new PageObjects(page);
        await pageObjects.goto();
        await pageObjects.addProductToCart("ZARA COAT 3");
        await pageObjects.gotoCart();
        await pageObjects.checkoutProduct();
        await pageObjects.placeOrderWithCountry("Nigeria");
        await pageObjects.placeOrder();
        await expect(pageObjects.placeOrderSuccessMsg).toBeVisible();
        expect(pageObjects.page.url()).toContain("https://rahulshettyacademy.com/client/#/dashboard/thanks?");
        await pageObjects.gotoOrders();
        await expect(pageObjects.ordersTable).toBeVisible();
        await expect(pageObjects.ordersTable).toContainText('ZARA COAT 3', { ignoreCase: true });
    })

       
    test('create an order using API and verify it appears in the orders list', async ({ page, request }) => {
        const pageObjects = new PageObjects(page);

        const loginResponse = await request.post('https://rahulshettyacademy.com/api/ecom/auth/login', {
            data: {
                userEmail: process.env.USER_EMAIL,
                userPassword: process.env.USER_PASSWORD
            },
            headers: {
                "Content-Type": "application/json"
            }   
        });
        const loginResponseBody = await loginResponse.json();
        const token = loginResponseBody.token;

        await page.addInitScript(value => {
            window.localStorage.setItem("token", value)
        }, token)


        expect(loginResponse.ok()).toBeTruthy();

        const productsResponse = await request.post('https://rahulshettyacademy.com/api/ecom/product/get-all-products', {
            headers: { "Authorization": token }
        });
        expect(productsResponse.ok()).toBeTruthy();
        const productsBody = await productsResponse.json();
        const product = productsBody.data.find(({ productName }) => productName === "ZARA COAT 3");
        expect(product, "ZARA COAT 3 must be available in the catalogue").toBeTruthy();

        const response = await request.post('https://rahulshettyacademy.com/api/ecom/order/create-order', {
            data: {
                orders: [
                    {
                        "country": "Nigeria",
                        "productOrderedId": product._id
                    }
                ]
            },
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });
        expect(response.ok()).toBeTruthy();
        const orderResponse = await response.json();
        expect(orderResponse.orders).toBeInstanceOf(Array);
        expect(orderResponse.orders.length).toBeGreaterThan(0);
        const orderId = orderResponse.orders[0];
        await pageObjects.goto();
        await pageObjects.gotoOrders();
        await expect(pageObjects.ordersTable).toBeVisible();
        await expect(pageObjects.ordersTable).toContainText(orderId, { ignoreCase: true });
    })
})
