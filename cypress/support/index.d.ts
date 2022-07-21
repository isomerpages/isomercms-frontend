/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    clickContextMenuItem(alias: string, menuItemText: string): Chainable<void>
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
    moveMedia(mediaTitle: string, newMediaFolder: string): Chainable<void>
    deleteMedia(mediaTitle: string, disableAction?: boolean): Chainable<void>
    saveSettings(): Chainable<void>
    visitLoadSettings(siteName: string, sitePath: string): Chainable<void>
  }
}
