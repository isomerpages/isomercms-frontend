import { test, expect } from "@playwright/test"

import { titleToPageFileName } from "utils/fileNameUtils"

import { getApi } from "./api/context.api"
import { BASE_SEO_LINK, E2E_EMAIL_TEST_SITE } from "./fixtures/constants"
import { SUCCESSFUL_EDIT_PAGE_TOAST } from "./fixtures/messages"
import { setEmailSessionDefaults } from "./utils/session"

// Constants
const PRIMARY_COLOUR = "rgb(255, 0, 0)"
const SECONDARY_COLOUR = "rgb(0, 255, 0)"

test.describe("editPage.spec", () => {
  test.beforeEach(({ context }) => {
    setEmailSessionDefaults(context, "Email admin")
  })

  test.describe("Edit unlinked page", () => {
    const TEST_PAGE_CONTENT = "lorem ipsum"
    const TEST_INSTAGRAM_EMBED_SCRIPT =
      '<script async src="//www.instagram.com/embed.js"></script>'
    const TEST_SANITIZED_INSTAGRAM_EMBED_SCRIPT =
      '<script async="" src="//www.instagram.com/embed.js"></script>'
    const TEST_UNTRUSTED_SCRIPT =
      '<script src="https://www.example.com/evil.js"></script>'
    const TEST_INLINE_SCRIPT = '<script>alert("hello")</script>'

    const TEST_UNLINKED_PAGE_TITLE = "Test Unlinked Page"
    const TEST_UNLINKED_PAGE_FILENAME = titleToPageFileName(
      TEST_UNLINKED_PAGE_TITLE
    )
    const TEST_PAGE_TITLE_ENCODED = encodeURIComponent(
      TEST_UNLINKED_PAGE_FILENAME
    )

    const DEFAULT_IMAGE_TITLE = "isomer-logo.svg"
    const ADDED_IMAGE_TITLE = "balloon"
    const ADDED_IMAGE_PATH = "images/balloon.png"

    const ADDED_FILE_TITLE = "singapore-pages"
    const ADDED_FILE_PATH = "files/singapore.pdf"

    const LINK_TITLE = "link"
    const LINK_URL = "https://www.google.com"

    const UNLINKED_PAGE = {
      frontMatter: {
        title: TEST_UNLINKED_PAGE_TITLE,
        permalink: "/permalink",
        variant: "tiptap",
        description: "",
      },
    }

    const BASE_SETTINGS = {
      title: "Title",
      description: "An Isomer site of the Singapore Government",
      favicon: "/images/favicon-isomer.ico",
      shareicon: "/images/isomer-logo.svg",
      google_analytics_ga4: "",
      is_government: false,
      contact_us: "/contact-us/",
      feedback: "",
      faq: "/faq/",
      show_reach: true,
      logo: "/images/isomer-logo.svg",
      url: BASE_SEO_LINK,
      social_media: {
        facebook: "https://www.facebook.com/YourFBPage",
        linkedin: "https://www.linkedin.com/company/YourAgency",
        twitter: "https://www.twitter.com/YourTwitter",
        youtube: "https://www.youtube.com/YourYoutube",
        instagram: "https://www.instagram.com/your.insta/",
        telegram: "",
        tiktok: "",
      },
      colors: {
        "primary-color": "#ff0000",
        "secondary-color": "#ff0000",
        "media-colors": [
          { title: "media-color-one", color: "#ff0000" },
          { title: "media-color-two", color: "#ff0000" },
          { title: "media-color-three", color: "#ff0000" },
          { title: "media-color-four", color: "#ff0000" },
          { title: "media-color-five", color: "#ff0000" },
        ],
      },
      "facebook-pixel": "",
      "linkedin-insights": "",
    }

    test.beforeEach(async ({ page, context }) => {
      setEmailSessionDefaults(context, "Email admin")
      const api = await getApi(await context.storageState())
      await api.post("v2/sites/e2e-email-test-repo/pages/pages", {
        data: {
          content: UNLINKED_PAGE,
          newFileName: TEST_UNLINKED_PAGE_FILENAME,
        },
      })
      await page.goto(
        `/sites/${E2E_EMAIL_TEST_SITE.repo}/editPage/${TEST_PAGE_TITLE_ENCODED}`
      )
    })

    test("Edit page (unlinked) should have correct colour", async ({
      page,
      context,
    }) => {
      // Arrange
      const api = await getApi(await context.storageState())
      const header = page.locator("#display-header")

      // Act
      await api.post("v2/sites/e2e-email-test-repo/settings", {
        data: BASE_SETTINGS,
      })

      // Assert
      await expect(header).toHaveCSS("background-color", PRIMARY_COLOUR)
    })

    test("Edit page (unlinked) should have name of title", async ({ page }) => {
      // Act
      const title = page.getByRole("heading", {
        name: TEST_UNLINKED_PAGE_TITLE,
      })

      // Assert
      // NOTE: At least 1 heading
      await expect(await title.count()).toBeGreaterThan(0)
    })

    test("Edit page (unlinked) should provide a warning to users when navigating away", async ({
      page,
    }) => {
      // Arrange
      await page.getByRole("textbox").fill(TEST_PAGE_CONTENT)
      const backButton = page.getByRole("button", { name: "Back to sites" })
      await backButton.click()

      // Act
      const warningModal = page.getByText("Warning")
      await expect(warningModal).toBeVisible()
      await page.getByRole("button", { name: "No" }).click()

      // Sanity check: still in unlinked pages and content still present
      await expect(page.url()).toContain(
        `${E2E_EMAIL_TEST_SITE.repo}/editPage/${TEST_PAGE_TITLE_ENCODED}`
      )
      await expect(page.getByText(TEST_PAGE_CONTENT)).toBeVisible()

      await backButton.click()
      await expect(warningModal).toBeVisible()
      await page.getByRole("button", { name: "Yes" }).click()

      // Assert
      await expect(page.url()).toContain(
        `${E2E_EMAIL_TEST_SITE.repo}/workspace`
      )
    })

    test("Edit page (unlinked) should allow user to modify and save content", async ({
      page,
    }) => {
      // Arrange
      await page.getByRole("textbox").fill(TEST_PAGE_CONTENT)
      const saveButton = page.getByRole("button", { name: "Save" })

      // Act
      await saveButton.click()

      // Assert
      // 1. Toast
      await expect(page.getByText(SUCCESSFUL_EDIT_PAGE_TOAST)).toBeVisible()

      // 2. Content is there even after refreshing
      await page.reload()
      await expect(page.getByText(TEST_PAGE_CONTENT)).toBeVisible()
    })

    test("Edit page (unlinked) should allow user to add existing image", async ({
      page,
    }) => {
      // Arrange
      const addImageButton = page.getByRole("button", {
        name: "Insert Image",
      })
      await addImageButton.click()
      const defaultImageButton = page.getByRole("button").filter({
        hasText: DEFAULT_IMAGE_TITLE,
      })
      await defaultImageButton.click()

      // Act
      await page.getByRole("button", { name: "Add image to page" }).click()
      await page.getByPlaceholder("Alt text").fill("Hello World")
      await page.locator("form").getByRole("button", { name: "Save" }).click()

      await expect(
        page.getByText(`/images/${DEFAULT_IMAGE_TITLE}`)
      ).toBeVisible()
    })

    test("Edit page (unlinked) should allow user to upload and add new image", async ({
      page,
    }) => {
      // Act
      const addImageButton = page.getByRole("button", {
        name: "Insert Image",
      })
      await addImageButton.click()
      const uploadNewImageButton = page.getByRole("button", {
        name: "Upload new image",
      })
      await uploadNewImageButton.click()
      const fileChooserPromise = page.waitForEvent("filechooser")
      await page
        .getByRole("button", { name: "Choose files or drag and drop" })
        .click()
      const fileChooser = await fileChooserPromise
      await fileChooser.setFiles(ADDED_IMAGE_PATH)
      const fileUploadPromise = page.waitForResponse((res) =>
        // NOTE: Not using a string/path here cos it gets merged
        // as we have provided a `baseURL` (our frontend URL) for playwright.
        res.url().includes("media/images/pages")
      )
      await page.getByRole("button", { name: "Upload" }).click()
      await fileUploadPromise

      // Assert
      await expect(
        page.getByText("Successfully uploaded 1 image")
      ).toBeVisible()
      await expect(page.getByText(`/images/${ADDED_IMAGE_TITLE}`)).toBeVisible()
    })

    test("Edit page (unlinked) should allow user to upload and add new file", async ({
      page,
    }) => {
      // Act
      const addFileButton = page.getByRole("button", {
        name: "Insert File",
      })
      await addFileButton.click()
      const uploadNewFileButton = page.getByRole("button", {
        name: "Upload new file",
      })
      await uploadNewFileButton.click()
      const fileChooserPromise = page.waitForEvent("filechooser")
      await page
        .getByRole("button", { name: "Choose files or drag and drop" })
        .click()
      const fileChooser = await fileChooserPromise
      await fileChooser.setFiles(ADDED_FILE_PATH)
      const fileUploadPromise = page.waitForResponse((res) =>
        // NOTE: Not using a string/path here cos it gets merged
        // as we have provided a `baseURL` (our frontend URL) for playwright.
        res.url().includes("media/files/pages")
      )
      await page.getByRole("button", { name: "Upload" }).click()
      await fileUploadPromise

      // Assert
      await expect(page.getByText("Successfully uploaded 1 file")).toBeVisible()
      await expect(page.getByText(`/images/${ADDED_FILE_TITLE}`)).toBeVisible()
    })

    test("Edit page (unlinked) should allow user to add existing file", async ({
      page,
    }) => {
      // NOTE: This test has an implicit dependency on the previous test
      // We might wish to squash the two tests together in the future.
      // Arrange
      const addFileButton = page.getByRole("button", {
        name: "Insert File",
      })
      await addFileButton.click()
      const defaultFileButton = page.getByRole("button").filter({
        hasText: ADDED_FILE_TITLE,
      })
      await defaultFileButton.click()

      // Act
      await page.getByRole("button", { name: "Add file to page" }).click()
      await page.getByPlaceholder("Alt text").fill("Hello World")
      await page.locator("form").getByRole("button", { name: "Save" }).click()

      await expect(page.getByText(`/files/${ADDED_FILE_TITLE}`)).toBeVisible()
    })

    test("Edit page (unlinked) should allow user to add link", async ({
      page,
    }) => {
      // Act
      await page.getByRole("button", { name: "Insert Link" }).click()

      await page.getByPlaceholder("Text").fill(LINK_TITLE)
      await page.getByPlaceholder("Link").fill(LINK_URL)

      await page.getByRole("button", { name: "Save" }).click()

      // Assert
      page.getByText(`[${LINK_TITLE}](${LINK_URL})`)
    })

    test("Edit page (unlinked) should allow users to add Instagram embed script", async ({
      page,
    }) => {
      // Arrange
      await page.getByRole("textbox").fill(TEST_INSTAGRAM_EMBED_SCRIPT)

      // Act
      await page.getByRole("button", { name: "Save" }).click()

      // Assert
      // 1. Toast
      await expect(page.getByText(SUCCESSFUL_EDIT_PAGE_TOAST)).toBeVisible()

      // 2. Content is there even after refreshing
      await page.reload()
      await expect(
        page.getByText(TEST_SANITIZED_INSTAGRAM_EMBED_SCRIPT)
      ).toBeVisible()
    })

    test.skip("Edit page (unlinked) should not allow users to add untrusted external scripts", async ({
      page,
    }) => {
      // NOTE: This test will fail at present
      // Arrange
      const PAGE_VIOLATION_WARNING =
        "Intended <script> content violates Content Security Policy and therefore could not be displayed. Isomer does not support display of any forbidden resources."

      // Act
      await page.getByRole("textbox").fill(TEST_UNTRUSTED_SCRIPT)

      // Assert
      // 1. Save button is disabled
      expect(page.getByRole("button", { name: "Save" })).toBeDisabled()
      // 2. CSP warning appears
      expect(page.getByText(PAGE_VIOLATION_WARNING)).toBeVisible()
      // 3. Content is not saved
      await page.reload()
      await expect(await page.getByText(TEST_UNTRUSTED_SCRIPT).count()).toEqual(
        0
      )
    })

    test.skip("Edit page (unlinked) should not allow users to add inline scripts", async ({
      page,
    }) => {
      // NOTE: THis test fails - we can still add inline scripts.
      // Arrange
      await page.getByRole("textbox").fill(TEST_INLINE_SCRIPT)

      // Act
      await page.getByRole("button", { name: "Save" }).click()

      // Asserts
      // 1. XSS warning modal is shown
      await expect(
        page.getByText(
          "There is unauthorised JS detected in the following snippet"
        )
      ).toBeVisible()
      // 2. Content is not saved
      await page.getByRole("button", { name: "Acknowledge" }).click()
      await page.reload()
      await expect(await page.getByText(TEST_INLINE_SCRIPT).count()).toEqual(0)
    })
  })
})
