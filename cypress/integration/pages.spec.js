import { after } from 'lodash'
import { deslugifyPage, generatePageFileName } from '../../src/utils'

describe('Pages flow', () => {
  const CMS_BASEURL = Cypress.env('BASEURL')
  const COOKIE_NAME = Cypress.env('COOKIE_NAME')
  const COOKIE_VALUE = Cypress.env('COOKIE_VALUE')
  const TEST_REPO_NAME = Cypress.env('TEST_REPO_NAME')
  const TEST_PAGE_TITLE = 'test title'
  const EDITED_TEST_PAGE_TITLE = 'edited test title'
  const TEST_PAGE_PERMALNK = '/test-permalink'
  const TEST_PAGE_FILENAME = generatePageFileName(TEST_PAGE_TITLE)
  const EDITED_TEST_PAGE_FILENAME = generatePageFileName(EDITED_TEST_PAGE_TITLE)
  const PRETTIFIED_PAGE_TITLE = deslugifyPage(TEST_PAGE_FILENAME)
  const EDITED_PRETTIFIED_PAGE_TITLE = deslugifyPage(EDITED_TEST_PAGE_FILENAME)

  describe('Workspace', () => {
    beforeEach(() => {
      cy.setCookie(COOKIE_NAME, COOKIE_VALUE)
      window.localStorage.setItem('userId', 'test')
      cy.visit(`${CMS_BASEURL}/sites/${TEST_REPO_NAME}/workspace`)
    })

    it('Test site workspace page should have unlinked pages section', () => {
      cy.contains('Add a new page')
    })
  
    it('Should be able to create a new page with valid title and permalink', () => {
      cy.get('#settings-NEW').click()
      cy.get('#title').clear().type(TEST_PAGE_TITLE)
      cy.get('#permalink').clear().type(TEST_PAGE_PERMALNK)
      cy.contains('Save').click()

      // Asserts
      // 1. User should be redirected to correct EditPage
      cy.url().should('include', `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/pages/${TEST_PAGE_FILENAME}`)
      cy.contains(PRETTIFIED_PAGE_TITLE)

      // 2. If user goes back to the workspace, they should be able to see that the page exists
      cy.contains('My Workspace').click()
      cy.contains(PRETTIFIED_PAGE_TITLE)
    })

    it('Should not be able to create page with invalid title or permalink', () => {
      const SHORT_TITLE = 'abc'
      const SHORT_PERMALINK = '/12'
      const INVALID_PERMALINK = 'test-'

      cy.get('#settings-NEW').click()

      // Page title has to be more than 4 characters long
      cy.get('#title').clear().type(SHORT_TITLE)
      cy.get('#permalink').clear().type(TEST_PAGE_PERMALNK)
      cy.contains('The title should be longer than 4 characters.')
      cy.contains('button', 'Save').should('be.disabled')
  
      // Page title must not already exist
      cy.get('#title').clear().type(TEST_PAGE_TITLE)
      cy.contains('This title is already in use. Please choose a different title.')
      cy.contains('button', 'Save').should('be.disabled')

      // Permalink needs to be longer than 4 characters
      cy.get('#title').clear().type(EDITED_TEST_PAGE_TITLE)
      cy.get('#permalink').clear().type(SHORT_PERMALINK)
      cy.contains('The permalink should be longer than 4 characters.')
      cy.contains('button', 'Save').should('be.disabled')
  
      // Permalink should start with a slash, and contain alphanumeric characters separated by hyphens and slashes only
      cy.get('#title').clear().type(EDITED_TEST_PAGE_TITLE)
      cy.get('#permalink').clear().type(INVALID_PERMALINK)
      cy.contains('The url should start with a slash, and contain alphanumeric characters separated by hyphens and slashes only.')
      cy.contains('button', 'Save').should('be.disabled')
    })

    it('Should be able to edit existing page details with valid title and permalink', () => {
      const testPageCard = cy.contains(PRETTIFIED_PAGE_TITLE)

      // User should be able edit page details
      testPageCard.children().within(() => cy.get('[id^=settings-]').click())
      cy.get('div[id^=settings-]').first().click() // .first() is necessary because the get returns multiple elements (refer to MenuDropdown.jsx)
      cy.get('#title').clear().type(EDITED_TEST_PAGE_TITLE)
      cy.contains('button', 'Save').click()

      // New page title should be reflected in the Workspace
      const editedTestPageCard = cy.contains(EDITED_PRETTIFIED_PAGE_TITLE)

      // Reset the page title to previous title
      editedTestPageCard.children().within(() => cy.get('[id^=settings-]').click())
      cy.get('div[id^=settings-]').first().click() // .first() is necessary because the get returns multiple elements (refer to MenuDropdown.jsx)
      cy.get('#title').clear().type(TEST_PAGE_TITLE)
      cy.contains('button', 'Save').click()

      // Page title should be reset in the Workspace
      cy.contains(PRETTIFIED_PAGE_TITLE)
    })

    it('Should be able to delete existing page on workspace', () => {
      cy.wait(2000) // Wait needed because it takes a while to refresh page list

      // Assert
      // User should be able to remove the created test page card
      const testPageCard = cy.contains(PRETTIFIED_PAGE_TITLE)
      testPageCard.children().within(() => cy.get('[id^=settings-]').click())
      cy.get('div[id^=delete-]').first().click() // .first() is necessary because the get returns multiple elements (refer to MenuDropdown.jsx)
      cy.contains('button', 'Delete').click()
    })
  })



})