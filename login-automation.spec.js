import { test, expect } from "@playwright/test"

test.describe("Login Automation", () => {
    const validCredentials = {
        userEmail: process.env.USER_EMAIL,
        userPassword: process.env.USER_PASSWORD
    }

    const invalidPassword = {
        userEmail: process.env.USER_EMAIL,
        userPassword: "1234567890"
    }

    const invalidEmail = {
        userEmail: "invalid-user@example.com",
        userPassword: process.env.USER_PASSWORD
    }

    test("valid login", async ({ page }) => {
        await page.goto("https://rahulshettyacademy.com/client/#/auth/login")
        const inputEmail = page.locator("#userEmail")
        const inputPassword = page.locator("#userPassword")
        const loginBtn = page.getByRole("button", { name: "Login" })
        await inputEmail.fill(validCredentials.userEmail)
        await inputPassword.fill(validCredentials.userPassword)
        await expect(inputEmail).toHaveValue(process.env.USER_EMAIL)
        await expect(inputPassword).toHaveValue(validCredentials.userPassword)
        await loginBtn.click()
        await expect(page).toHaveURL("https://rahulshettyacademy.com/client/#/dashboard/dash")
    })


    test("invalid password", async ({ page }) => {
        await page.goto("https://rahulshettyacademy.com/client/#/auth/login")
        const inputEmail = page.locator("#userEmail")
        const inputPassword = page.locator("#userPassword")
        const loginBtn = page.getByRole("button", { name: "Login" })
        const errorMsg = page.locator("#toast-container").getByText("Incorrect email or password.")
        await inputEmail.fill(invalidPassword.userEmail)
        await inputPassword.fill(invalidPassword.userPassword)
        await loginBtn.click()
        await errorMsg.waitFor({ state: "visible" })
        await expect(errorMsg).toBeVisible()
    })

    test("invalid userEmail", async ({ page }) => {
        await page.goto("https://rahulshettyacademy.com/client/#/auth/login")
        const inputEmail = page.locator("#userEmail")
        const inputPassword = page.locator("#userPassword")
        const loginBtn = page.getByRole("button", { name: "Login" })
        const errorMsg = page.locator("#toast-container").getByText("Incorrect email or password.")
        await inputEmail.fill(invalidEmail.userEmail)
        await inputPassword.fill(invalidEmail.userPassword)
        await loginBtn.click()
        await errorMsg.waitFor({ state: "visible" })
        await expect(errorMsg).toBeVisible()
    })

    test("empty field", async ({ page }) => {
        await page.goto("https://rahulshettyacademy.com/client/#/auth/login")
        const loginBtn = page.getByRole("button", { name: "Login" })
        const invalidFeedbackE = page.locator(".invalid-feedback").getByText("Email is required")
        const invalidFeedbackP = page.locator(".invalid-feedback").getByText("Password is required")
        await loginBtn.click()
        await invalidFeedbackE.waitFor()
        await invalidFeedbackP.waitFor()
        await expect(invalidFeedbackE).toBeVisible()
        await expect(invalidFeedbackP).toBeVisible()
    })


    test("user logs out successfully", async ({ page, request }) => {
       const response = await request.post("https://rahulshettyacademy.com/api/ecom/auth/login", {
           data: validCredentials
       })
       expect(response.ok()).toBeTruthy()
       const { token } = await response.json()
       await page.addInitScript(value => {
           window.localStorage.setItem("token", value)
       }, token)
       await page.goto("https://rahulshettyacademy.com/client/#/dashboard/dash")

       await page.getByRole("button", {name: "Sign Out"}).click()
       await expect(page).toHaveURL("https://rahulshettyacademy.com/client/#/auth/login")
    })
})
