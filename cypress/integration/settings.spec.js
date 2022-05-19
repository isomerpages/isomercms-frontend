describe("Settings page", () => {
  const COOKIE_NAME = Cypress.env("COOKIE_NAME")
  const COOKIE_VALUE = Cypress.env("COOKIE_VALUE")
  const TEST_REPO_NAME = Cypress.env("TEST_REPO_NAME")
  Cypress.config("baseUrl", Cypress.env("BASEURL"))
  Cypress.config("defaultCommandTimeout", 6000)

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
  const TEST_PRIMARY_COLOR = [255, 0, 0] // ([R, G, B])
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

  // Reusable save command
  Cypress.Commands.add("saveSettings", () => {
    cy.intercept("POST", "/v2/**").as("awaitSave")
    cy.contains("button", "Save").click()
    cy.wait("@awaitSave")
  })

  // Reusable visit command
  Cypress.Commands.add("visitLoadSettings", (sitePath) => {
    cy.intercept("GET", `/v2/sites/${TEST_REPO_NAME}/settings`).as(
      "awaitSettings"
    )
    cy.visit(sitePath)
    cy.wait("@awaitSettings")
  })

  Cypress.Cookies.defaults({
    preserve: COOKIE_NAME,
  })

  before(() => {
    cy.setCookie(COOKIE_NAME, COOKIE_VALUE)
    cy.visit("/sites")
    cy.contains(TEST_REPO_NAME).click()

    window.localStorage.setItem("userId", "test")
    cy.visitLoadSettings(`/sites/${TEST_REPO_NAME}/settings`)

    // Reset page input field states
    cy.get("#title").clear().type(BASE_TITLE)
    cy.contains("Analytics")
      .parent()
      .find("input")
      .each((elem) => cy.wrap(elem).clear())
    cy.contains("p", "Primary").siblings("[id$=-box]").click()
    cy.get("[id=colorModal]")
      .find("input")
      .first()
      .clear()
      .type(BASE_PRIMARY_COLOR)
    cy.get("[id=colorModalSubmit]").click()
    cy.contains("p", "Secondary").siblings("[id$=-box]").click()
    cy.get("[id=colorModal]")
      .find("input")
      .first()
      .clear()
      .type(BASE_SECONDARY_COLOR)
    cy.get("[id=colorModalSubmit]").click()
    cy.get("#facebook").clear().type(BASE_FACEBOOK_LINK)
    cy.get("#linkedin").clear().type(BASE_LINKEDIN_LINK)
    cy.get("#twitter").clear().type(BASE_TWITTER_LINK)
    cy.get("#youtube").clear().type(BASE_YOUTUBE_LINK)
    cy.get("#instagram").clear().type(BASE_INSTAGRAM_LINK)
    cy.get("#telegram").clear().type(BASE_TELEGRAM_LINK)
    cy.get("#tiktok").clear().type(BASE_TIKTOK_LINK)
    cy.get("#contact_us").clear().type(BASE_CONTACT_US)
    cy.get("#feedback").clear().type(BASE_FEEDBACK)
    cy.get("#faq").clear().type(BASE_FAQ)

    cy.saveSettings()
  })

  beforeEach(() => {
    window.localStorage.setItem("userId", "test")
    cy.visitLoadSettings(`/sites/${TEST_REPO_NAME}/settings`)
    // Double check that settings are loaded before running tests cos sometimes the tests run too quickly
    cy.get("#title").should((elem) => {
      expect(elem.val()).to.have.length.greaterThan(0)
    })
  })

  it("Should change Title and have change reflect correctly on save", () => {
    cy.get("#title").clear().type(TEST_TITLE)

    cy.saveSettings()

    cy.get("#title").should("have.value", TEST_TITLE)
  })

  it("Should toggle Masthead and Show Reach buttons and have change reflect correctly on save", () => {
    const shouldBeSelectedArr = []
    // Toggles the Masthead and Show Reach buttons and saves their expected states to reference later
    cy.get("input[type=checkbox]")
      .each((element) => {
        shouldBeSelectedArr.push(`${!(element.val() === "true")}`)
        cy.wrap(element).parent().click({ force: true })
      })
      .then(() => {
        cy.saveSettings()

        cy.contains("Display government masthead:")
          .parent()
          .siblings()
          .find("input[type=checkbox]")
          .should("have.value", shouldBeSelectedArr[0])
        cy.contains("Show Reach:")
          .parent()
          .siblings()
          .find("input[type=checkbox]")
          .should("have.value", shouldBeSelectedArr[1])
      })
  })

  it("Should change Logos and have change reflect correctly on save", () => {
    cy.get("button:contains(Choose Image)").each((el, index) => {
      cy.wrap(el).click()
      cy.contains(TEST_LOGO_IMAGES[index]).click()
      cy.contains("button", "Select").should("not.be.disabled").click()
    })

    cy.saveSettings() // Save

    cy.get("#shareicon").should("have.value", IMAGE_DIR + TEST_LOGO_IMAGES[0])
    cy.get("#logo").should("have.value", IMAGE_DIR + TEST_LOGO_IMAGES[1])
    cy.get("#favicon").should("have.value", IMAGE_DIR + TEST_LOGO_IMAGES[2])
  })

  it("Should change analytics codes and have change reflect correctly on save", () => {
    cy.get("#facebook_pixel").type(TEST_FACEBOOK_PIXEL_ID)
    cy.get("#google_analytics").type(TEST_GOOGLE_ANALYTICS_ID)

    cy.saveSettings()

    cy.get("#facebook_pixel").should("have.value", TEST_FACEBOOK_PIXEL_ID)
    cy.get("#google_analytics").should("have.value", TEST_GOOGLE_ANALYTICS_ID)
  })

  // [r, g, b] -> #RRGGBB
  function rgbToHex(r, g, b) {
    // eslint-disable-next-line no-bitwise
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
  }
  it("Should change Primary and Secondary colors and have colors reflected on page previews", () => {
    // Enter RGB values for primary and secondary colors
    cy.contains("p", "Primary").siblings("button").click()
    cy.contains(/^r/).siblings().clear().type(TEST_PRIMARY_COLOR[0].toString())
    cy.contains(/^g/).siblings().clear().type(TEST_PRIMARY_COLOR[1].toString())
    cy.contains(/^b/).siblings().clear().type(TEST_PRIMARY_COLOR[2].toString())
    cy.contains("button", "Select").click()

    cy.contains("p", "Secondary").siblings("button").click()
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
    cy.contains("button", "Select").click()

    cy.saveSettings()

    // Check if selected colors are reflected upon save
    const rgbPrimary = `rgb(${TEST_PRIMARY_COLOR.join(", ")})`
    const hexPrimary = rgbToHex(...TEST_PRIMARY_COLOR)
    const rgbSecondary = `rgb(${TEST_SECONDARY_COLOR.join(", ")})`
    const hexSecondary = rgbToHex(...TEST_SECONDARY_COLOR)
    cy.contains("p", "Primary")
      .siblings("input")
      .should("have.value", hexPrimary)
    cy.contains("p", "Primary")
      .siblings("button")
      .should("have.attr", "style", `background: ${rgbPrimary};`)
    cy.contains("p", "Secondary")
      .siblings("input")
      .should("have.value", hexSecondary)
    cy.contains("p", "Secondary")
      .siblings("button")
      .should("have.attr", "style", `background: ${rgbSecondary};`)

    // Check if page previews reflect color change
    cy.visitLoadSettings(`/sites/${TEST_REPO_NAME}/${SAMPLE_PAGE}`)
    cy.get("section.bp-section-pagetitle") // Page title banner
      .should("have.css", "background-color", rgbPrimary)

    // Check if home page reflects color change
    cy.visit(`/sites/${TEST_REPO_NAME}/workspace`) // Somehow colors won't load on homepage if visiting directly
    cy.visitLoadSettings(`/sites/${TEST_REPO_NAME}/${HOMEPAGE}`)
    cy.get(".bp-notification")
      .first() // Notification bar
      .should("have.css", "background-color", rgbSecondary)
    cy.get(".bp-section")
      .first() // Hero section
      .should("have.css", "background-color", rgbPrimary)
    cy.get("h1.has-text-secondary").should("have.css", "color", rgbSecondary)
  })

  it("Should change Social Media links and have change reflected on save", () => {
    cy.get("#facebook").clear().type(TEST_FACEBOOK_LINK)
    cy.get("#linkedin").clear().type(TEST_LINKEDIN_LINK)
    cy.get("#twitter").clear().type(TEST_TWITTER_LINK)
    cy.get("#youtube").clear().type(TEST_YOUTUBE_LINK)
    cy.get("#instagram").clear().type(TEST_INSTAGRAM_LINK)
    cy.get("#telegram").clear().type(TEST_TELEGRAM_LINK)
    cy.get("#tiktok").clear().type(TEST_TIKTOK_LINK)

    cy.saveSettings()

    cy.get("#facebook").should("have.value", TEST_FACEBOOK_LINK)
    cy.get("#linkedin").should("have.value", TEST_LINKEDIN_LINK)
    cy.get("#twitter").should("have.value", TEST_TWITTER_LINK)
    cy.get("#youtube").should("have.value", TEST_YOUTUBE_LINK)
    cy.get("#instagram").should("have.value", TEST_INSTAGRAM_LINK)
    cy.get("#telegram").should("have.value", TEST_TELEGRAM_LINK)
    cy.get("#tiktok").should("have.value", TEST_TIKTOK_LINK)
  })

  it("Should change footer info and have info reflected correctly on save", () => {
    cy.get("#contact_us").clear().type(TEST_CONTACT_US)
    cy.get("#feedback").clear().type(TEST_FEEDBACK)
    cy.get("#faq").clear().type(TEST_FAQ)

    cy.saveSettings()

    cy.get("#contact_us").should("have.value", TEST_CONTACT_US)
    cy.get("#feedback").should("have.value", TEST_FEEDBACK)
    cy.get("#faq").should("have.value", TEST_FAQ)
  })
})
