import {
  TEST_PRIMARY_COLOR,
  TEST_REPO_NAME,
  BASE_SEO_LINK,
} from "../fixtures/constants"

describe("Settings page", () => {
  const BASE_TITLE = "TEST"
  const BASE_PRIMARY_COLOR = "#6031b6"
  const BASE_SECONDARY_COLOR = "#4372d6"
  const BASE_FACEBOOK_LINK = "https://www.facebook.com/YourFBPageTestEdit"
  const BASE_LINKEDIN_LINK = "https://www.linkedin.com/company/YourAgency"
  const BASE_TWITTER_LINK = "https://www.twitter.com/YourTwitter"
  const BASE_YOUTUBE_LINK = "https://www.youtube.com/YourYoutube"
  const BASE_INSTAGRAM_LINK = "https://www.instagram.com/yourinsta/"
  const BASE_TELEGRAM_LINK = "https://t.me/youragency"
  const BASE_TIKTOK_LINK = "https://tiktok.com/@YourTiktok"
  const BASE_CONTACT_US = "contact/"
  const BASE_FEEDBACK = "www.feedback.com"
  const BASE_FAQ = "/faq/"

  const TEST_TITLE = "Test title"
  const TEST_LOGO_IMAGES = [
    "hero-banner.png",
    "isomer-logo.svg",
    "favicon-isomer.ico",
  ] // [Agency, Favicon, Shareicon]
  const IMAGE_DIR = "/images/"
  const TEST_FACEBOOK_PIXEL_ID = "12345"
  const TEST_GOOGLE_ANALYTICS_ID = "UA-39345131-3"
  const TEST_LINKEDIN_INSIGHTS_ID = "1234567"
  const TEST_SECONDARY_COLOR = [0, 255, 0] // ([R, G, B])
  const TEST_FACEBOOK_LINK = "https://www.facebook.com/testfb"
  const TEST_LINKEDIN_LINK = "https://www.linkedin.com/company/testagency"
  const TEST_TWITTER_LINK = "https://www.twitter.com/testtwitter"
  const TEST_YOUTUBE_LINK = "https://www.youtube.com/testyoutube"
  const TEST_INSTAGRAM_LINK = "https://www.instagram.com/testinsta/"
  const TEST_TELEGRAM_LINK = "https://telegram.me/testagency"
  const TEST_TIKTOK_LINK = "https://tiktok.com/@testTiktok"
  const TEST_CONTACT_US = "testcontact/"
  const TEST_FEEDBACK = "www.feedbacktest.com"
  const TEST_FAQ = "/faqpagetest/"

  // Pages to test color
  const SAMPLE_PAGE = "editPage/faq.md"
  const HOMEPAGE = "homepage"

  const visitLoadSettings = (sitePath: string) =>
    cy.visitLoadSettings(TEST_REPO_NAME, sitePath)

  before(() => {
    cy.setSessionDefaults()
    cy.visit("/sites")
    cy.contains(TEST_REPO_NAME).click()

    visitLoadSettings(`/sites/${TEST_REPO_NAME}/settings`)

    // Reset page input field states
    cy.get("#title").clear().type(BASE_TITLE)
    cy.contains("div", "Analytics")
      .parent()
      .parent()
      .find("input")
      .each((elem) => cy.wrap(elem).clear())
    cy.contains("label", "SEO")
      .parent()
      .parent()
      .find("input")
      .type(BASE_SEO_LINK)
    cy.contains("label", "Primary")
      .parent()
      .find('button[aria-label="Select colour"]')
      .click()
    cy.get(".sketch-picker")
      .find("input")
      .first()
      .clear()
      .type(BASE_PRIMARY_COLOR)
    cy.contains("button", "Select Colour").click()
    cy.contains("label", "Secondary")
      .parent()
      .find('button[aria-label="Select colour"]')
      .click()
    cy.get(".sketch-picker")
      .find("input")
      .first()
      .clear()
      .type(BASE_SECONDARY_COLOR)
    cy.contains("button", "Select Colour").click()
    cy.get("input[name='socialMediaContent.facebook']")
      .clear()
      .type(BASE_FACEBOOK_LINK)
    cy.get("input[name='socialMediaContent.linkedin']")
      .clear()
      .type(BASE_LINKEDIN_LINK)
    cy.get("input[name='socialMediaContent.twitter']")
      .clear()
      .type(BASE_TWITTER_LINK)
    cy.get("input[name='socialMediaContent.youtube']")
      .clear()
      .type(BASE_YOUTUBE_LINK)
    cy.get("input[name='socialMediaContent.instagram']")
      .clear()
      .type(BASE_INSTAGRAM_LINK)
    cy.get("input[name='socialMediaContent.telegram']")
      .clear()
      .type(BASE_TELEGRAM_LINK)
    cy.get("input[name='socialMediaContent.tiktok']")
      .clear()
      .type(BASE_TIKTOK_LINK)
    cy.get("input[name=contact]").clear().type(BASE_CONTACT_US)
    cy.get("input[name=feedback]").clear().type(BASE_FEEDBACK)
    cy.get("input[name=faq]").clear().type(BASE_FAQ)

    cy.saveSettings()
  })

  beforeEach(() => {
    cy.setSessionDefaults()
    visitLoadSettings(`/sites/${TEST_REPO_NAME}/settings`)
    // Double check that settings are loaded before running tests cos sometimes the tests run too quickly
    cy.get("#title").should((elem) => {
      expect(elem.val()).to.have.length.greaterThan(0)
    })
    cy.contains("Verify").should("not.exist")
  })

  it("Should change Title and have change reflect correctly on save", () => {
    cy.get("#title").clear().type(TEST_TITLE)

    cy.saveSettings()

    cy.get("#title").should("have.value", TEST_TITLE)
  })

  it("should be able to update the SEO to a valid value", () => {
    // Arrange
    const expected = "www.space.open.gov.sg"
    cy.contains("label", "SEO").parent().parent().find("input").as("seoInput")

    // Act
    cy.get("@seoInput").clear().type(expected)

    // Assert
    cy.saveSettings()
    cy.get("@seoInput").should("have.value", expected)
  })

  it("should not be able to input the protocol at the beginning of the url", () => {
    // Arrange
    const INVALID_SEO_INPUTS = [
      `https://${BASE_SEO_LINK}`,
      `http://${BASE_SEO_LINK}`,
    ]
    cy.contains("label", "SEO").parent().parent().find("input").as("seoInput")

    INVALID_SEO_INPUTS.forEach((invalidInput) => {
      // Act
      // NOTE: We need to blur for the error message to show
      // as the validation mode is after the first unfocus
      cy.get("@seoInput").clear().type(invalidInput).blur()

      // Assert
      cy.contains("The web domain you have entered is not valid").should(
        "exist"
      )
    })
  })

  it("Should toggle Masthead and Show Reach buttons and have change reflect correctly on save", () => {
    // Arrange
    // NOTE: Initial state is display govt masthead off and show reach on
    cy.contains("label", "Display government masthead")
      .next()
      .find("input")
      .as("displayMasthead")
      .should("not.be.checked")
    cy.contains("label", "Show REACH")
      .next()
      .find("input")
      .as("showReach")
      .should("be.checked")

    // Act
    // Trigger click event
    // NOTE: We have to force as chakra uses an invisible input as a checkbox
    cy.get("@displayMasthead").check({ force: true })
    cy.get("@showReach").uncheck({ force: true })

    // Assert
    cy.get("@displayMasthead").should("be.checked")
    cy.get("@showReach").should("not.be.checked")
  })

  it("Should change Logos and have change reflect correctly on save", () => {
    cy.get("button:contains(Upload Image)").each((el, index) => {
      cy.wrap(el).click()
      cy.contains(TEST_LOGO_IMAGES[index]).click()
      cy.contains("button", "Select").should("not.be.disabled").click()
    })

    cy.saveSettings()

    cy.contains("div", "Shareicon")
      .next()
      .find("input")
      .should("have.value", IMAGE_DIR + TEST_LOGO_IMAGES[0])
    cy.contains("div", "Agency logo")
      .next()
      .find("input")
      .should("have.value", IMAGE_DIR + TEST_LOGO_IMAGES[1])
    cy.contains("div", "Favicon")
      .next()
      .find("input")
      .should("have.value", IMAGE_DIR + TEST_LOGO_IMAGES[2])
  })

  it("Should change analytics codes and have change reflect correctly on save", () => {
    // Arrange
    cy.contains("label", "Facebook Pixel")
      .next()
      .as("pixel")
      .type(TEST_FACEBOOK_PIXEL_ID)
    cy.contains("label", "Google Analytics")
      .next()
      .as("ga")
      .type(TEST_GOOGLE_ANALYTICS_ID)
    cy.contains("label", "LinkedIn Insights")
      .next()
      .as("insights")
      .type(TEST_LINKEDIN_INSIGHTS_ID)

    // Act
    cy.saveSettings()

    // Assert
    cy.get("@pixel").should("have.value", TEST_FACEBOOK_PIXEL_ID)
    cy.get("@ga").should("have.value", TEST_GOOGLE_ANALYTICS_ID)
    cy.get("@insights").should("have.value", TEST_LINKEDIN_INSIGHTS_ID)
  })

  // [r, g, b] -> #RRGGBB
  const rgbToHex = ([r, g, b, ...rest]: number[]) => {
    // eslint-disable-next-line no-bitwise
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
  }
  it("Should change Primary and Secondary colors and have colors reflected on page previews", () => {
    // Enter RGB values for primary and secondary colors
    cy.contains("label", "Primary")
      .parent()
      .find('button[aria-label="Select colour"]')
      .click()
    cy.contains(/^r/).siblings().clear().type(TEST_PRIMARY_COLOR[0].toString())
    cy.contains(/^g/).siblings().clear().type(TEST_PRIMARY_COLOR[1].toString())
    cy.contains(/^b/).siblings().clear().type(TEST_PRIMARY_COLOR[2].toString())
    cy.contains("button", "Select Colour").click()

    cy.contains("label", "Secondary")
      .parent()
      .find('button[aria-label="Select colour"]')
      .click()
    cy.contains(/^r/)
      .siblings()
      .clear()
      .type(TEST_SECONDARY_COLOR[0].toString())
    cy.contains(/^g/)
      .siblings()
      .clear()
      .type(TEST_SECONDARY_COLOR[1].toString())
    cy.contains(/^b/)
      .siblings()
      .clear()
      .type(TEST_SECONDARY_COLOR[2].toString())
    cy.contains("button", "Select Colour").click()

    cy.saveSettings()

    // Check if selected colors are reflected upon save
    const rgbPrimary = `rgb(${TEST_PRIMARY_COLOR.join(", ")})`
    const hexPrimary = rgbToHex(TEST_PRIMARY_COLOR)
    const rgbSecondary = `rgb(${TEST_SECONDARY_COLOR.join(", ")})`
    const hexSecondary = rgbToHex(TEST_SECONDARY_COLOR)
    cy.contains("label", "Primary")
      .parent()
      .find("input")
      .should("have.value", hexPrimary)
    cy.contains("label", "Primary")
      .parent()
      .find("button")
      .should("have.css", "background-color")
      .and("eq", rgbPrimary)
    cy.contains("label", "Secondary")
      .parent()
      .find("input")
      .should("have.value", hexSecondary)
    cy.contains("label", "Secondary")
      .parent()
      .find("button")
      .should("have.css", "background-color")
      .and("eq", rgbSecondary)

    // Check if page previews reflect color change
    visitLoadSettings(`/sites/${TEST_REPO_NAME}/${SAMPLE_PAGE}`)
    cy.get("section.bp-section-pagetitle") // Page title banner
      .should("have.css", "background-color", rgbPrimary)

    // Check if home page reflects color change
    cy.visit(`/sites/${TEST_REPO_NAME}/workspace`) // Somehow colors won't load on homepage if visiting directly
    visitLoadSettings(`/sites/${TEST_REPO_NAME}/${HOMEPAGE}`)
    cy.get("#notification-bar")
      .first() // Notification bar
      .should("have.css", "background-color", rgbSecondary)
    cy.get("#key-highlights")
      .first() // Hero section
      .should("have.css", "background-color", rgbPrimary)
    cy.get("h1.has-text-secondary").should("have.css", "color", rgbSecondary)
  })

  it("Should change Social Media links and have change reflected on save", () => {
    // Arrange
    cy.get("input[name='socialMediaContent.facebook']")
      .clear()
      .type(TEST_FACEBOOK_LINK)
    cy.get("input[name='socialMediaContent.linkedin']")
      .clear()
      .type(TEST_LINKEDIN_LINK)
    cy.get("input[name='socialMediaContent.twitter']")
      .clear()
      .type(TEST_TWITTER_LINK)
    cy.get("input[name='socialMediaContent.youtube']")
      .clear()
      .type(TEST_YOUTUBE_LINK)
    cy.get("input[name='socialMediaContent.instagram']")
      .clear()
      .type(TEST_INSTAGRAM_LINK)
    cy.get("input[name='socialMediaContent.telegram']")
      .clear()
      .type(TEST_TELEGRAM_LINK)
    cy.get("input[name='socialMediaContent.tiktok']")
      .clear()
      .type(TEST_TIKTOK_LINK)

    // Act
    cy.saveSettings()

    // Assert
    cy.get("input[name='socialMediaContent.facebook']").should(
      "have.value",
      TEST_FACEBOOK_LINK
    )
    cy.get("input[name='socialMediaContent.linkedin']").should(
      "have.value",
      TEST_LINKEDIN_LINK
    )
    cy.get("input[name='socialMediaContent.twitter']").should(
      "have.value",
      TEST_TWITTER_LINK
    )
    cy.get("input[name='socialMediaContent.youtube']").should(
      "have.value",
      TEST_YOUTUBE_LINK
    )
    cy.get("input[name='socialMediaContent.instagram']").should(
      "have.value",
      TEST_INSTAGRAM_LINK
    )
    cy.get("input[name='socialMediaContent.telegram']").should(
      "have.value",
      TEST_TELEGRAM_LINK
    )
    cy.get("input[name='socialMediaContent.tiktok']").should(
      "have.value",
      TEST_TIKTOK_LINK
    )
  })

  it("Should change footer info and have info reflected correctly on save", () => {
    // Arrange
    cy.get("input[name=contact]").clear().type(TEST_CONTACT_US)
    cy.get("input[name=feedback]").clear().type(TEST_FEEDBACK)
    cy.get("input[name=faq]").clear().type(TEST_FAQ)

    // Act
    cy.saveSettings()

    // Assert
    cy.get("input[name=contact]").should("have.value", TEST_CONTACT_US)
    cy.get("input[name=feedback]").should("have.value", TEST_FEEDBACK)
    cy.get("input[name=faq]").should("have.value", TEST_FAQ)
  })
})
