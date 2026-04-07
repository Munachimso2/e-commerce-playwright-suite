import { test as base } from "@playwright/test";

export const test = base.extend({
    login: async ({ page, request }, use) => {
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
        const token = body.token;

        await page.addInitScript(value => {
            window.localStorage.setItem("token", value)
        }, token)

        await use(token);
    }
})