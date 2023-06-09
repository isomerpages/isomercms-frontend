/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /** Uses the immediate sibling of the context menu to retrieve the requested dropdown menu item
     * and fire a click event on it
     * @param {string} alias **NOTE** alias MUST be the full fledged (@...) alias of the IMMEDIATE PRIOR sibling
     * @param {string} menuItemText The text within the menu item to select
     */
    clickContextMenuItem(alias: string, menuItemText: string): Chainable<void>
    /** Uses the first element in the breadcrumb to verify the structure of the breadcrumb against the provided array. \
     * The > connector is implicitly assumed and should not be passed in breadcrumb items.
     * @param {string} alias **NOTE** alias MUST be the full fledged (@...) alias of the first sibling
     * @param {[]string} breadcrumbItems The items within the breadcrumb - this must be a non-empty array
     */
    verifyBreadcrumb(alias: string, breadcrumbItems: string[]): Chainable<void>
    /**
     * Retrives the first sibling of the given element.
     * This command is to be chained off a previous command that yields an element (eg: cy.get().getFirstSiblingAs(...))
     * @param {string} as The alias that should be given to the first sibling
     */
    getFirstSiblingAs(as: string): Chainable<JQuery<HTMLElement>>
    /**
     * Sets default primary colour as well as the SEO field.
     * The SEO field has to be set as there is no default given.
     * This is to avoid adversely impacting the SEO of the site.
     */
    setDefaultSettings(): Chainable<void>
    setGithubSessionDefaults(): Chainable<void>

    setEmailSessionDefaults(
      userType: "Email admin" | "Email collaborator"
    ): Chainable<void>
    /**
     * Setup the default interceptors for post/get/delete requests.
     * These interceptors are aliased to the `Interceptors` enum.
     */
    setupDefaultInterceptors(): void
    createResourceCategory(name: string): Chainable<void>
    uploadMedia(
      mediaTitle: string,
      mediaPath: string,
      disableAction?: boolean
    ): Chainable<void>
    renameUngroupedMedia(
      mediaTitle: string,
      mediaPath: string,
      disableAction?: boolean
    ): Chainable<void>
    /**
     * Renames media files that are part of a directory
     */
    renameDirectoryMedia(mediaTitle: string, mediaPath: string): Chainable<void>
    moveMedia(mediaTitle: string, newMediaFolder: string): Chainable<void>
    deleteMedia(mediaTitle: string, disableAction?: boolean): Chainable<void>
    saveSettings(): Chainable<void>
    visitLoadSettings(siteName: string, sitePath: string): Chainable<void>
    createEmailUser(
      email: string,
      // NOTE: have to (re)declare the type here
      // otherwise the import leads to a type error
      userType: "Email admin" | "Email collaborator",
      InitialUserType: "Email admin" | "Email collaborator",
      site?: string
    ): Chainable<void>
  }
}
