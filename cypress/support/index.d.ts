/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    clickContextMenuItem(alias: string, menuItemText: string): Chainable<void>
    clickAndWait(
      options?: Partial<ClickOptions>
    ): Chainable<JQuery<HTMLElement>>
    verifyBreadcrumb(alias: string, breadcrumbItems: string[]): Chainable<void>
    getFirstSiblingAs(as: string): Chainable<JQuery<HTMLElement>>
    uploadMedia(
      mediaTitle: string,
      mediaPath: string,
      disableAction?: boolean
    ): Chainable<void>
    renameMedia(
      mediaTitle: string,
      mediaPath: string,
      disableAction?: boolean
    ): Chainable<void>
    moveMedia(mediaTitle: string, newMediaFolder: string)
    deleteMedia(mediaTitle: string, disableAction?: boolean)
  }
}
