import { test, expect, Page } from "@playwright/test"

import {
  E2E_EMAIL_REPO_MASTER_LINK,
  E2E_EMAIL_REPO_STAGING_LINK,
  E2E_EMAIL_TEST_SITE,
  ISOMER_GUIDE_LINK,
} from "./fixtures/constants"
import { setEmailSessionDefaults } from "./utils/session"

const REVIEW_MODAL_SUBTITLE =
  "An Admin needs to review and approve your changes before they can be published"

const REVIEW_REQUEST_ALERT_MESSAGE =
  "There’s a Review request pending approval. Any changes you make now will be added to the existing Review request, and published with the changes in it."

const getReviewRequestButton = async (page: Page) => {
  const button = page.locator("button", { hasText: /Request a Review/ }).first()

  expect(button).toBeVisible()

  return button
}

test.describe("dashboard flow", () => {
  test.beforeEach(async ({ page, context }) => {
    setEmailSessionDefaults(context, "Email admin")
    await page.goto(`/sites/${E2E_EMAIL_TEST_SITE.repo}/dashboard`)
    expect(page.getByText(E2E_EMAIL_TEST_SITE.repo)).toBeVisible()
    // TODO: Close review requests
    // closeReviewRequests()
  })

  test('should open the staging site on click of the "Open staging" button', async ({
    page,
  }) => {
    // Act
    const link = page.getByRole("link", {
      name: /Open staging/,
    })

    // Assert
    await expect(link).toHaveAttribute("href", E2E_EMAIL_REPO_STAGING_LINK)
    await expect(link).toHaveAttribute("target", "_blank")
  })

  test('should open the "Request a Review" modal on click of the "Request a Review" button', async ({
    page,
  }) => {
    // Act
    const button = await getReviewRequestButton(page)
    await button.click()

    // Assert
    await expect(page.getByText(REVIEW_MODAL_SUBTITLE).first()).toBeVisible()
  })

  test("should be able to navigate to the staging site using the dropdown button", async ({
    page,
  }) => {
    // Act
    const dropdown = page.getByLabel("Select options")
    await dropdown.click()
    const stagingLink = page.getByRole("menuitem", {
      name: "Open staging site",
    })

    // Assert
    await expect(stagingLink).toBeVisible()
    await expect(stagingLink).toHaveAttribute(
      "href",
      E2E_EMAIL_REPO_STAGING_LINK
    )
    await expect(stagingLink).toHaveAttribute("target", "_blank")
  })

  test("should be able to navigate to the production site using the dropdown button", async ({
    page,
  }) => {
    // Act
    const dropdown = page.getByLabel("Select options")
    await dropdown.click()
    const prodLink = page.getByRole("menuitem", {
      name: "Visit live site",
    })

    // Assert
    await expect(prodLink).toBeVisible()
    await expect(prodLink).toHaveAttribute("href", E2E_EMAIL_REPO_MASTER_LINK)
    await expect(prodLink).toHaveAttribute("target", "_blank")
  })

  test('should navigate to the isomer guide on click of the "Get help" button', async ({
    page,
  }) => {
    // Act
    const helpLink = page.getByRole("link", { name: "Get help" })

    await expect(helpLink).toBeVisible()
    await expect(helpLink).toHaveAttribute("href", ISOMER_GUIDE_LINK)
    await expect(helpLink).toHaveAttribute("target", "_blank")
  })

  test("should navigate to the settings page when manage site settings is clicked", async ({
    page,
  }) => {
    // Act
    // NOTE: Even though there are 2 visually identical links with the text "Manage",
    // the first one is actually a button so this will work.
    const settingsLink = await page.getByRole("link", { name: "Manage" })

    await expect(settingsLink).toHaveAttribute(
      "href",
      `/sites/${E2E_EMAIL_TEST_SITE.repo}/settings`
    )
    await settingsLink.click()

    // Assert
    await expect(
      page.getByRole("heading", { name: "Site settings" })
    ).toBeVisible()
  })

  test("should navigate to the workspace when edit site is clicked", async ({
    page,
  }) => {
    // Act
    const editSiteButton = page.getByRole("link", {
      name: "Edit site",
    })
    await expect(editSiteButton).toBeVisible()
    await editSiteButton.click()

    // Assert
    await expect(
      page.getByRole("heading", { name: "My Workspace" })
    ).toBeVisible()
    // NOTE: check that the locator matches nothing
    await expect(
      await page.getByText(REVIEW_REQUEST_ALERT_MESSAGE).count()
    ).toEqual(0)
  })
})
