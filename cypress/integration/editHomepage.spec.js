describe("Edit Homepage page", () => {
  const COOKIE_NAME = Cypress.env("COOKIE_NAME")
  const CUSTOM_TIMEOUT = Cypress.env("CUSTOM_TIMEOUT")
  const TEST_REPO_NAME = Cypress.env("TEST_REPO_NAME")
  Cypress.config("baseUrl", Cypress.env("BASEURL"))

  Cypress.Cookies.defaults({
    preserve: COOKIE_NAME,
  })

  before(() => {})

  beforeEach(() => {
    window.localStorage.setItem("userId", "test")
    cy.visit(`/sites/${TEST_REPO_NAME}/homepage`)
  })

  Cypress.Commands.add("saveSettings", () => {
    cy.intercept("POST", "/v2/**").as("awaitSave")
    cy.contains("button", "Save").click()
    cy.wait("@awaitSave")
  })

  describe("Edit Hero Section", () => {
    const HERO_SECTION_ID = "sections.0.hero"
    const HERO_TITLE = "OGP Resources"
    const HERO_SUBTITLE = "It's a good website"

    const HERO_BUTTON = "Click here to go to Google"
    const HERO_URL = "https://google.com"

    const HERO_HIGHLIGHTS_ID = `${HERO_SECTION_ID}.key_highlights.1`
    const HERO_HIGHLIGHTS_TITLE = "OpenGov"
    const HERO_HIGHLIGHTS_URL = "https://github.com/opengovsg"
    const HERO_HIGHLIGHTS_DESCRIPTION = "Link to OpenGov Github"

    it("Should be able to change Hero section details", () => {
      cy.get(`button[id='${HERO_SECTION_ID}']`).click()
      cy.get(`input[id='${HERO_SECTION_ID}.title']`).clear().type(HERO_TITLE)
      cy.get(`input[id='${HERO_SECTION_ID}.subtitle']`)
        .clear()
        .type(HERO_SUBTITLE)

      cy.saveSettings()

      // asserts
      cy.reload()
      cy.get(`button[id='${HERO_SECTION_ID}']`).click()
      cy.get(`input[id='${HERO_SECTION_ID}.title']`).should(
        "have.value",
        HERO_TITLE
      )
      cy.get(`input[id='${HERO_SECTION_ID}.subtitle']`).should(
        "have.value",
        HERO_SUBTITLE
      )
    })

    it("Should be able to create Highlights section", () => {
      cy.get(`button[id='${HERO_SECTION_ID}']`).click()
      cy.get(`input[id='radio-highlights']`).click()
      cy.get(`input[id='${HERO_SECTION_ID}.button']`).clear().type(HERO_BUTTON)
      cy.get(`input[id='${HERO_SECTION_ID}.url']`).clear().type(HERO_URL)

      cy.get(`button[id='highlight-create']`).click()
      cy.get(`button[id='${HERO_HIGHLIGHTS_ID}']`).click()
      cy.get(`input[id='${HERO_HIGHLIGHTS_ID}.title']`)
        .clear()
        .type(HERO_HIGHLIGHTS_TITLE)
      cy.get(`input[id='${HERO_HIGHLIGHTS_ID}.url']`)
        .clear()
        .type(HERO_HIGHLIGHTS_URL)
      cy.get(`input[id='${HERO_HIGHLIGHTS_ID}.description']`)
        .clear()
        .type(HERO_HIGHLIGHTS_DESCRIPTION)
      cy.saveSettings()

      // asserts
      cy.reload()
      cy.get(`button[id='${HERO_SECTION_ID}']`).click()
      cy.get(`button[id='${HERO_HIGHLIGHTS_ID}']`).click()
      cy.get(`input[id='${HERO_HIGHLIGHTS_ID}.title']`).should(
        "have.value",
        HERO_HIGHLIGHTS_TITLE
      )
      cy.get(`input[id='${HERO_HIGHLIGHTS_ID}.url']`).should(
        "have.value",
        HERO_HIGHLIGHTS_URL
      )
      cy.get(`input[id='${HERO_HIGHLIGHTS_ID}.description']`).should(
        "have.value",
        HERO_HIGHLIGHTS_DESCRIPTION
      )
    })
  })

  describe("Edit Infobar Section", () => {
    // assumes this section EXISTS in e2e-test-repo
    const INFOBAR_SECTION_ID = "sections.1.infobar" // currently hardcoded as drag-drop cannot be tested, assumes this section exists in e2e-test-repo
    const INFOBAR_TITLE = "Infobar 1"
    const INFOBAR_SUBTITLE = "It's a good website"
    const INFOBAR_DESCRIPTION = "It's a good website"
    const INFOBAR_BUTTON = "Click here to go to Google"
    const INFOBAR_URL = "https://google.com"

    it("Should be able to change Infobar details", () => {
      cy.get(`button[id='${INFOBAR_SECTION_ID}']`).click()
      cy.get(`input[id='${INFOBAR_SECTION_ID}.title']`)
        .clear()
        .type(INFOBAR_TITLE)
      cy.get(`input[id='${INFOBAR_SECTION_ID}.subtitle']`)
        .clear()
        .type(INFOBAR_SUBTITLE)
      cy.get(`input[id='${INFOBAR_SECTION_ID}.description']`)
        .clear()
        .type(INFOBAR_DESCRIPTION)
      cy.get(`input[id='${INFOBAR_SECTION_ID}.button']`)
        .clear()
        .type(INFOBAR_BUTTON)
      cy.get(`input[id='${INFOBAR_SECTION_ID}.url']`).clear().type(INFOBAR_URL)

      cy.saveSettings()

      // asserts
      cy.reload()
      cy.get(`button[id='${INFOBAR_SECTION_ID}']`).click()
      cy.get(`input[id='${INFOBAR_SECTION_ID}.title']`).should(
        "have.value",
        INFOBAR_TITLE
      )
      cy.get(`input[id='${INFOBAR_SECTION_ID}.subtitle']`).should(
        "have.value",
        INFOBAR_SUBTITLE
      )
      cy.get(`input[id='${INFOBAR_SECTION_ID}.description']`).should(
        "have.value",
        INFOBAR_DESCRIPTION
      )
      cy.get(`input[id='${INFOBAR_SECTION_ID}.button']`).should(
        "have.value",
        INFOBAR_BUTTON
      )
      cy.get(`input[id='${INFOBAR_SECTION_ID}.url']`).should(
        "have.value",
        INFOBAR_URL
      )
    })
  })

  describe("Edit Infopic Section", () => {
    // assumes this section DOES NOT exists in e2e-test-repo
    const INFOPIC_SECTION_ID = "sections.2.infopic" // currently hardcoded as drag-drop cannot be tested
    const INFOPIC_TITLE = "OGP Resources"
    const INFOPIC_SUBTITLE = "It's a good website"
    const INFOPIC_DESCRIPTION = "It's a good website"
    const INFOPIC_BUTTON = "Click here to go to Google"
    const INFOPIC_URL = "https://google.com"

    const INFOPIC_IMAGE_NAME = "hero-banner.png"
    const INFOPIC_IMAGE_URL = `/images/${INFOPIC_IMAGE_NAME}`
    const INFOPIC_ALT_TEXT = `Hero Banner of Isomer.gov.sg`

    it("Should be able to create Infopic section", () => {
      cy.get(`select[id='section-new']`).select("infopic")
      cy.get("button").contains("Select").click()
      cy.saveSettings()

      // asserts
      cy.reload()
      cy.get(`button[id='${INFOPIC_SECTION_ID}']`).should("be.visible")
    })

    it("Should be able to change Infopic details", () => {
      cy.get(`button[id='${INFOPIC_SECTION_ID}']`).click()
      cy.get(`input[id='${INFOPIC_SECTION_ID}.title']`)
        .clear()
        .type(INFOPIC_TITLE)
      cy.get(`input[id='${INFOPIC_SECTION_ID}.subtitle']`)
        .clear()
        .type(INFOPIC_SUBTITLE)
      cy.get(`input[id='${INFOPIC_SECTION_ID}.description']`)
        .clear()
        .type(INFOPIC_DESCRIPTION)
      cy.get(`input[id='${INFOPIC_SECTION_ID}.button']`)
        .clear()
        .type(INFOPIC_BUTTON)
      cy.get(`input[id='${INFOPIC_SECTION_ID}.url']`).clear().type(INFOPIC_URL)

      cy.get(`button`).contains("Choose Image").click()
      cy.get(`div`)
        .contains(INFOPIC_IMAGE_NAME, { timeout: CUSTOM_TIMEOUT })
        .should("be.visible")
        .click()
      cy.get(`button`).contains("Select").click()
      cy.get(`input[id='${INFOPIC_SECTION_ID}.alt']`)
        .clear()
        .type(INFOPIC_ALT_TEXT)

      cy.saveSettings()

      // asserts
      cy.reload()
      cy.get(`button[id='${INFOPIC_SECTION_ID}']`).click()
      cy.get(`input[id='${INFOPIC_SECTION_ID}.title']`).should(
        "have.value",
        INFOPIC_TITLE
      )
      cy.get(`input[id='${INFOPIC_SECTION_ID}.subtitle']`).should(
        "have.value",
        INFOPIC_SUBTITLE
      )
      cy.get(`input[id='${INFOPIC_SECTION_ID}.description']`).should(
        "have.value",
        INFOPIC_DESCRIPTION
      )
      cy.get(`input[id='${INFOPIC_SECTION_ID}.button']`).should(
        "have.value",
        INFOPIC_BUTTON
      )
      cy.get(`input[id='${INFOPIC_SECTION_ID}.url']`).should(
        "have.value",
        INFOPIC_URL
      )
      cy.get(`input[id='${INFOPIC_SECTION_ID}.image']`).should(
        "have.value",
        INFOPIC_IMAGE_URL
      )
    })
  })

  describe("Edit Resources Section", () => {
    // assumes this section DOES NOT exists in e2e-test-repo
    const RESOURCES_SECTION_ID = "sections.3.resources" // currently hardcoded as drag-drop cannot be tested
    const RESOURCES_TITLE = "OGP Resources"
    const RESOURCES_SUBTITLE = "It's a good website"
    const RESOURCES_BUTTON = "Click here to go to Google"
    const RESOURCES_DELETE_WARNING =
      "Are you sure you want to delete Resources Section?"

    it("Should be able to create Resources section", () => {
      cy.get(`select[id='section-new']`).find("option").should("have.length", 4)
      cy.get(`select[id='section-new']`).select("resources")
      cy.get("button").contains("Select").click()
      cy.saveSettings()

      // asserts
      cy.reload()
      cy.get(`button[id='${RESOURCES_SECTION_ID}']`).should("be.visible")
    })

    it("Should not be able to create a second Resources section", () => {
      cy.get(`select[id='section-new']`).find("option").should("have.length", 3)
    })

    it("Should be able to change Resources details", () => {
      cy.get(`button[id='${RESOURCES_SECTION_ID}']`).click()
      cy.get(`input[id='${RESOURCES_SECTION_ID}.title']`)
        .clear()
        .type(RESOURCES_TITLE)
      cy.get(`input[id='${RESOURCES_SECTION_ID}.subtitle']`)
        .clear()
        .type(RESOURCES_SUBTITLE)
      cy.get(`input[id='${RESOURCES_SECTION_ID}.button']`)
        .clear()
        .type(RESOURCES_BUTTON)

      cy.saveSettings()

      // asserts
      cy.reload()
      cy.get(`button[id='${RESOURCES_SECTION_ID}']`).click()
      cy.get(`input[id='${RESOURCES_SECTION_ID}.title']`).should(
        "have.value",
        RESOURCES_TITLE
      )
      cy.get(`input[id='${RESOURCES_SECTION_ID}.subtitle']`).should(
        "have.value",
        RESOURCES_SUBTITLE
      )
      cy.get(`input[id='${RESOURCES_SECTION_ID}.button']`).should(
        "have.value",
        RESOURCES_BUTTON
      )
    })

    it("Should be able to delete Resources section", () => {
      cy.get(`button[id='${RESOURCES_SECTION_ID}']`).click()
      cy.get(`button`).contains("Delete section").click()

      cy.contains(RESOURCES_DELETE_WARNING).should("be.visible")
      cy.get(`button`).contains("Delete").click()
      cy.saveSettings()

      // asserts
      cy.reload()
      cy.get(`button[id='${RESOURCES_SECTION_ID}']`).should("not.exist")
    })
  })
})
