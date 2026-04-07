import { test, expect } from "@playwright/test";

const validUser = {
    firstName: "Affia",
    middleName: "David",
    lastName: "Okafor",
    handle: "@affia",
    email: "affiaokafor@gmail.com",
    password: process.env.USER_PASSWORD
}

test("create user", async ({ page }) => {
    await page.goto("https://sabbathmission.org/")
    const joinBtn = page.getByRole("button", { name: "Join", exact: true }).filter({ visible: true })
    const firstName = page.locator("#firstName")
    const middleName = page.locator("#middleName")
    const lastName = page.locator("#lastName")
    const handle = page.locator("#handle")
    const email = page.locator("#email")
    const password = page.locator("#password")
    const confirmpassword = page.locator("#confirmPassword")
    const showPassword = page.locator("#show-password")
    const agreeTerms = page.locator("#agree-terms")
    const createAccountBtn = page.getByRole("button", { name: "Create Account" })

    await joinBtn.click()
    await firstName.fill(validUser.firstName)
    await middleName.fill(validUser.middleName)
    await lastName.fill(validUser.lastName)
    await handle.fill(validUser.handle)
    await email.fill(validUser.email)
    await password.fill(validUser.password)
    await confirmpassword.fill(validUser.password)
    await showPassword.check()
    await expect(showPassword).toBeChecked()
    await agreeTerms.check()
    await expect(agreeTerms).toBeChecked()
    await createAccountBtn.click()
    await expect(page).toHaveURL("https://sabbathmission.org/dashboard")
    await expect(page.getByRole('heading', { name: "Welcome to the Sabbath Mission Dashboard!" })).toBeVisible()
})