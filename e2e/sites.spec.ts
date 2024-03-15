import { test, expect, Page } from "@playwright/test"

import { E2E_EMAIL_TEST_SITE } from "./fixtures/constants"
import { setEmailSessionDefaults } from "./utils/session"

test.describe("Sites flow", () => {
  test.beforeEach(async ({ page, context }) => {
    setEmailSessionDefaults(context, "Email admin")
    await page.goto(`/sites`)
  })

  test("Sites page should have sites header", async ({ page }) => {
    const closeButton = page.getByRole("button", { name: "Close" })
    await closeButton.click()

    const header = page.getByText("Get help")

    await expect(header).toBeVisible()
  })

  test("Sites page should allow user to click into a test site repo", async ({
    page,
  }) => {
    // Arrange
    await page.waitForLoadState("domcontentloaded")
    const closeButton = page.getByRole("button", { name: "Close" })
    await closeButton.click()
    const site = page.getByRole("link", { name: E2E_EMAIL_TEST_SITE.repo })

    // Act
    await site.click()

    // Assert
    await expect(page.url()).toContain(
      `/sites/${E2E_EMAIL_TEST_SITE.repo}/dashboard`
    )
  })
})
