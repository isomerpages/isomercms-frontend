import "cypress-pipe"
import { Interceptors } from "../fixtures/constants"

Cypress.Commands.add("uploadMedia", (mediaTitle, mediaPath, disableAction) => {
  cy.contains(`Upload new`).click().get("#file-upload").attachFile(mediaPath)

  cy.get("#name").clear().type(mediaTitle).blur()
  if (!disableAction)
    cy.get("button")
      .contains(/^Upload$/)
      .click() // necessary as multiple buttons containing Upload on page
      .wait(Interceptors.POST)
})

Cypress.Commands.add(
  "renameUngroupedMedia",
  (mediaTitle, newMediaTitle, disableAction) => {
    // NOTE: The following lengthy explanation will be required
    // to explain the following fix to make this command (hopefully) robust,
    // so sit tight and put your seatbelts on.
    // When we click on the `mediaTitle` card, this triggers a modal on the FE.
    // This also has an accompanied loading state + network request (to fetch the image to display)
    // AND the background also has a network request to list out all required media items.
    // This means that Interceptors.GET has multiple matches for its alias - the network request for the image
    // and the network request for all the media items.
    // When this happens, cypress (and this is a result of cypress being dumb) waits on the FIRST resolved alias.
    // This is problematic because our image loads later than the list all request (as the list all only returns an array of strings),
    // which results in the dom then reconciling later once the network request (to fetch the image) is resolved.
    // Hence, we need to use a custom regex (this regex matches a url containing /media/images/, ie a nested route) to resolve this.
    // Omitting the wait below would then lead to funny bugs like having mangled names of mediaTitle interspersed with newMediaTitle
    // or even just the old mediaTitle.
    // This is because
    // 1. we clear the input
    // 2. we type the new title
    // 3. network request resolves with image data
    // 4. react re-renders with new data
    // 5. save button clicked
    // tl;dr: this regex is needed to prevent copious debugging and massive confusion.
    cy.intercept(/\/media\/(images|files)\//).as("getMedia")
    cy.intercept("**/media/files").as("getBackgroundItems")
    cy.contains(mediaTitle).click()
    cy.wait("@getMedia").wait("@getBackgroundItems").wait(Interceptors.GET)
    cy.get("#name")
      .should("have.value", mediaTitle)
      .clear()
      .type(newMediaTitle)
      .should("have.value", newMediaTitle)
      .blur()
    if (!disableAction) {
      cy.get("button").contains("Save").click().wait(Interceptors.POST)
    }
  }
)

Cypress.Commands.add("renameDirectoryMedia", (mediaTitle, newMediaTitle) => {
  // NOTE: The following lengthy explanation will be required
  // to explain the following fix to make this command (hopefully) robust,
  // so sit tight and put your seatbelts on.
  // When we click on the `mediaTitle` card, this triggers a modal on the FE.
  // This also has an accompanied loading state + network request (to fetch the image to display)
  // AND the background also has a network request to list out all required media items.
  // This means that Interceptors.GET has multiple matches for its alias - the network request for the image
  // and the network request for all the media items.
  // When this happens, cypress (and this is a result of cypress being dumb) waits on the FIRST resolved alias.
  // This is problematic because our image loads later than the list all request (as the list all only returns an array of strings),
  // which results in the dom then reconciling later once the network request (to fetch the image) is resolved.
  // Hence, we need to use a custom regex (this regex matches a url containing /media/images/, ie a nested route) to resolve this.
  // Omitting the wait below would then lead to funny bugs like having mangled names of mediaTitle interspersed with newMediaTitle
  // or even just the old mediaTitle.
  // This is because
  // 1. we clear the input
  // 2. we type the new title
  // 3. network request resolves with image data
  // 4. react re-renders with new data
  // 5. save button clicked
  // tl;dr: this regex is needed to prevent copious debugging and massive confusion.
  cy.intercept(/\/media\/(images|files)/).as("getMedia")
  cy.intercept("**/media/files*").as("getBackgroundItems")
  cy.contains(mediaTitle).click()
  cy.wait("@getMedia").wait("@getBackgroundItems").wait(Interceptors.GET)
  cy.get("#name")
    .should("have.value", mediaTitle)
    .clear()
    .type(newMediaTitle)
    .should("have.value", newMediaTitle)
    .blur()
  cy.get("button").contains("Save").click().wait(Interceptors.POST)
})

Cypress.Commands.add("moveMedia", (mediaTitle, newMediaFolder) => {
  cy.get(`[id^="${mediaTitle}-settings-"]`).click()
  cy.contains("Move to").click()
  cy.get("[data-cy=menu-dropdown]").children().should("have.length.gt", 3) // assert that "Move to" options have loaded
  if (newMediaFolder) {
    cy.get(`[data-cy=${newMediaFolder}]`)
      .should("exist")
      .should("have.length.gte", 1)
      .should("be.visible")
      .first()
      .click()
  } else {
    cy.get(`[id^="breadcrumbItem-0"]`)
      .should("be.visible")
      // breadcrumb elements in FileMoveMenuDropdown are flaky, so we need to
      // use cypress-pipe
      .pipe(($el) => $el.trigger("click"))
      .should(($el) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect($el).to.not.exist
      })
  }
  cy.contains("button", "Move Here").click({ scrollBehavior: false }) // necessary because it will otherwise scroll to top of page
  cy.contains("button", "Continue").click()
})

Cypress.Commands.add("deleteMedia", (mediaTitle, disableAction) => {
  cy.get(`[id^="${mediaTitle}-settings-"]`).should("exist").click()
  cy.contains("Delete").click()
  if (!disableAction) cy.get("#modal-delete").click()
})
