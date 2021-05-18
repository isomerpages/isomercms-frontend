import { deslugifyPage, deslugifyDirectory, generatePageFileName, slugifyCategory } from '../../src/utils'

describe('Pages flow', () => {
  const CMS_BASEURL = Cypress.env('BASEURL')
  const COOKIE_NAME = Cypress.env('COOKIE_NAME')
  const COOKIE_VALUE = Cypress.env('COOKIE_VALUE')
  const TEST_REPO_NAME = Cypress.env('TEST_REPO_NAME')
  const TEST_PAGE_TITLE = 'test title'
  const EDITED_TEST_PAGE_TITLE = 'edited test title'
  const TEST_PAGE_PERMALNK = '/test-permalink'
  const TEST_PAGE_FILENAME = generatePageFileName(TEST_PAGE_TITLE)
  const TEST_PAGE_CONTENT = 'my test page content'
  const EDITED_TEST_PAGE_FILENAME = generatePageFileName(EDITED_TEST_PAGE_TITLE)
  const PRETTIFIED_PAGE_TITLE = deslugifyPage(TEST_PAGE_FILENAME)
  const EDITED_PRETTIFIED_PAGE_TITLE = deslugifyPage(EDITED_TEST_PAGE_FILENAME)

  const TEST_FOLDER_NO_PAGES_TITLE = 'test folder title no pages'
  const PARSED_TEST_FOLDER_NO_PAGES_TITLE = slugifyCategory(TEST_FOLDER_NO_PAGES_TITLE)
  const PRETTIFIED_FOLDER_NO_PAGES_TITLE = deslugifyDirectory(PARSED_TEST_FOLDER_NO_PAGES_TITLE)

  const TEST_FOLDER_WITH_PAGES_TITLE = 'test folder title with pages'
  const PARSED_TEST_FOLDER_WITH_PAGES_TITLE = slugifyCategory(TEST_FOLDER_WITH_PAGES_TITLE)
  const PRETTIFIED_FOLDER_WITH_PAGES_TITLE = deslugifyDirectory(PARSED_TEST_FOLDER_WITH_PAGES_TITLE)

  const TEST_SUBFOLDER_NO_PAGES_TITLE = 'test subfolder title no pages'
  const PARSED_TEST_SUBFOLDER_NO_PAGES_TITLE = slugifyCategory(TEST_SUBFOLDER_NO_PAGES_TITLE)
  const PRETTIFIED_SUBFOLDER_NO_PAGES_TITLE = deslugifyDirectory(PARSED_TEST_SUBFOLDER_NO_PAGES_TITLE)

  const TEST_SUBFOLDER_WITH_PAGES_TITLE = 'test subfolder title no pages'
  const PARSED_TEST_SUBFOLDER_WITH_PAGES_TITLE = slugifyCategory(TEST_SUBFOLDER_WITH_PAGES_TITLE)
  const PRETTIFIED_SUBFOLDER_WITH_PAGES_TITLE = deslugifyDirectory(PARSED_TEST_SUBFOLDER_WITH_PAGES_TITLE)

  const EDITED_TEST_FOLDER_WITH_PAGES_TITLE = 'edited folder with pages'
  const PARSED_EDITED_TEST_FOLDER_WITH_PAGES_TITLE = slugifyCategory(EDITED_TEST_FOLDER_WITH_PAGES_TITLE)
  const PRETTIFIED_EDITED_FOLDER_WITH_PAGES_TITLE = deslugifyDirectory(PARSED_EDITED_TEST_FOLDER_WITH_PAGES_TITLE)

  const EDITED_TEST_SUBFOLDER_WITH_PAGES_TITLE = 'edited subfolder with pages'
  const PARSED_EDITED_TEST_SUBFOLDER_WITH_PAGES_TITLE = slugifyCategory(EDITED_TEST_SUBFOLDER_WITH_PAGES_TITLE)
  const PRETTIFIED_EDITED_SUBFOLDER_WITH_PAGES_TITLE = deslugifyDirectory(PARSED_EDITED_TEST_SUBFOLDER_WITH_PAGES_TITLE)

  describe('Create page, delete page, edit page settings in Workspace', () => {
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
      cy.wait(2000)

      // Page title should be reset in the Workspace
      cy.contains(PRETTIFIED_PAGE_TITLE)
      cy.wait(2000) // Wait needed because the next test fails otherwise - the rename call takes some time to propagate
    })

    it('Should be able to delete existing page on workspace', () => {
      // Assert
      // User should be able to remove the created test page card
      const testPageCard = cy.contains(PRETTIFIED_PAGE_TITLE)
      testPageCard.children().within(() => cy.get('[id^=settings-]').click())
      cy.get('div[id^=delete-]').first().click() // .first() is necessary because the get returns multiple elements (refer to MenuDropdown.jsx)
      cy.contains('button', 'Delete').click()
      cy.wait(2000)

      cy.contains(PRETTIFIED_PAGE_TITLE).should('not.exist')
    })
  })

  describe('Create folder/subfolder, rename folder/subfolder, delete folder/subfolder', () => {
    beforeEach(() => {
      cy.setCookie(COOKIE_NAME, COOKIE_VALUE)
      window.localStorage.setItem('userId', 'test')
      cy.visit(`${CMS_BASEURL}/sites/${TEST_REPO_NAME}/workspace`)
    })

    it('Test site workspace page should have folders section', () => {
      cy.contains('Create new folder')
    })

    // Create
    it('Should be able to create a new folder with valid folder name with no pages', () => {
      cy.contains('Create new folder').click()
      cy.get('input#folder').clear().type(TEST_FOLDER_NO_PAGES_TITLE)
      cy.contains('Select pages').click()
      cy.contains('Done').click()

      // Assert
      cy.wait(4000)
      cy.contains(PRETTIFIED_FOLDER_NO_PAGES_TITLE)
      cy.url().should('include', `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/folder/${PARSED_TEST_FOLDER_NO_PAGES_TITLE}`)
      cy.contains('There are no pages in this folder.')
    })

    it('Should be able to create a new folder with valid folder name with page', () => {
      // Create test page
      cy.get('#settings-NEW').click()
      cy.get('#title').clear().type(TEST_PAGE_TITLE)
      cy.get('#permalink').clear().type(TEST_PAGE_PERMALNK)
      cy.contains('Save').click()

      // Create test page content
      cy.get('.CodeMirror-scroll').type(TEST_PAGE_CONTENT)
      cy.contains('Save').click()
      cy.wait(2000)
      cy.contains('My Workspace').click()
      
      cy.contains('Create new folder').click()
      cy.get('input#folder').clear().type(TEST_FOLDER_WITH_PAGES_TITLE)
      cy.contains('Select pages').click()
      cy.contains(PRETTIFIED_PAGE_TITLE).click() // Select newly-created file
      cy.contains('Done').click()

      // Assert
      cy.wait(4000)
      cy.contains(PRETTIFIED_FOLDER_WITH_PAGES_TITLE)
      cy.url().should('include', `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/folder/${PARSED_TEST_FOLDER_WITH_PAGES_TITLE}`)
      cy.contains(PRETTIFIED_PAGE_TITLE).click()
      cy.get('.CodeMirror-scroll').should('contain', TEST_PAGE_CONTENT)
    })

    it('Should not be able to create a new folder with invalid folder name', () => {
      // Title is too short
      const INVALID_FOLDER_TITLE = 't'
      cy.contains('Create new folder').click()
      cy.get('input#folder').clear().type(INVALID_FOLDER_TITLE)
      cy.contains('The page category should be longer than 2 characters.')
      cy.contains('button', 'Select pages').should('be.disabled')

      // Folder exists
      cy.get('input#folder').clear().type(TEST_FOLDER_NO_PAGES_TITLE)
      cy.contains('Another folder with the same name exists. Please choose a different name.')
      cy.contains('button', 'Select pages').should('be.disabled')
    })

    it('Should be able to create a new sub-folder within a valid folder name with no pages', () => {
      cy.contains(PRETTIFIED_FOLDER_NO_PAGES_TITLE).click()
      cy.contains('Create new subfolder').click()
      cy.get('input#subfolder').clear().type(TEST_SUBFOLDER_NO_PAGES_TITLE)
      cy.contains('Select pages').click()
      cy.contains('Done').click()

      // Assert
      cy.wait(4000)
      cy.contains(PRETTIFIED_SUBFOLDER_NO_PAGES_TITLE)
      cy.url().should('include', `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/folder/${PARSED_TEST_FOLDER_NO_PAGES_TITLE}/subfolder/${PARSED_TEST_SUBFOLDER_NO_PAGES_TITLE}`)
      cy.contains('There are no pages in this subfolder.')
    })

    it('Should be able to create a new sub-folder within a valid folder name with one page', () => {
      cy.contains(PRETTIFIED_FOLDER_WITH_PAGES_TITLE).click()
      cy.contains('Create new subfolder').click()
      cy.get('input#subfolder').clear().type(TEST_SUBFOLDER_WITH_PAGES_TITLE)
      cy.contains('Select pages').click()
      cy.contains(PRETTIFIED_PAGE_TITLE).click() // Select newly-created file
      cy.contains('Done').click()

      // Assert
      cy.wait(4000)
      cy.contains(PRETTIFIED_SUBFOLDER_WITH_PAGES_TITLE)
      cy.url().should('include', `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/folder/${PARSED_TEST_FOLDER_WITH_PAGES_TITLE}/subfolder/${PARSED_TEST_SUBFOLDER_WITH_PAGES_TITLE}`)
      cy.contains(PRETTIFIED_PAGE_TITLE).click()
      cy.get('.CodeMirror-scroll').should('contain', TEST_PAGE_CONTENT)
    })

    it('Should not be able to create a new sub-folder with invalid sub-folder name', () => {
      cy.contains(PRETTIFIED_FOLDER_NO_PAGES_TITLE).click()

      // Title is too short
      const INVALID_SUBFOLDER_TITLE = 't'
      cy.contains('Create new subfolder').click()
      cy.get('input#subfolder').clear().type(INVALID_SUBFOLDER_TITLE)
      cy.contains('The page category should be longer than 2 characters.')
      cy.contains('button', 'Select pages').should('be.disabled')

      // Subfolder exists
      cy.get('input#subfolder').clear().type(TEST_SUBFOLDER_NO_PAGES_TITLE)
      cy.contains('Another folder with the same name exists. Please choose a different name.')
      cy.contains('button', 'Select pages').should('be.disabled')
    })

    it('Should not be able to create a nested sub-folder within a sub-folder', () => {
      cy.visit(`${CMS_BASEURL}/sites/${TEST_REPO_NAME}/folder/${PARSED_TEST_FOLDER_NO_PAGES_TITLE}/subfolder/${PARSED_TEST_SUBFOLDER_NO_PAGES_TITLE}`)
      cy.contains('button', 'Create new subfolder').should('be.disabled')
    })

    // Rename
    it('Should be able to rename a sub-folder', () => {
      cy.contains(PRETTIFIED_FOLDER_WITH_PAGES_TITLE).click()
      cy.get('.bx-dots-vertical-rounded').parent().click()
      cy.contains('Edit details').click()
      cy.contains('Rename subfolder')
      cy.get('input#newDirectoryName').clear().type(EDITED_TEST_SUBFOLDER_WITH_PAGES_TITLE)
      cy.contains('button', 'Save').click()
      cy.wait(4000)

      // Assert
      cy.contains('1 item')
      cy.contains(PRETTIFIED_EDITED_SUBFOLDER_WITH_PAGES_TITLE).click()
      cy.contains(PRETTIFIED_EDITED_SUBFOLDER_WITH_PAGES_TITLE)
      cy.url().should('include', `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/folder/${PARSED_TEST_FOLDER_WITH_PAGES_TITLE}/subfolder/${PARSED_EDITED_TEST_SUBFOLDER_WITH_PAGES_TITLE}`)
      cy.contains(PRETTIFIED_PAGE_TITLE).click()
      cy.get('.CodeMirror-scroll').should('contain', TEST_PAGE_CONTENT)
    })

    it('Should be able to rename a folder', () => {
      cy.contains(PRETTIFIED_FOLDER_WITH_PAGES_TITLE).within(() => cy.get('[id^=settingsIcon]').click())
      cy.get('div[id^=settings-]').first().click()
      cy.contains('Rename Folder')
      cy.get('input#newDirectoryName').clear().type(EDITED_TEST_FOLDER_WITH_PAGES_TITLE)
      cy.contains('button', 'Save').click()
      cy.wait(4000)

      // Assert
      cy.contains(PRETTIFIED_EDITED_FOLDER_WITH_PAGES_TITLE).click()
      cy.contains(PRETTIFIED_EDITED_FOLDER_WITH_PAGES_TITLE)
      cy.url().should('include', `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/folder/${PARSED_EDITED_TEST_FOLDER_WITH_PAGES_TITLE}`)

      cy.contains('1 item')
      cy.contains(PRETTIFIED_EDITED_SUBFOLDER_WITH_PAGES_TITLE).click()
      cy.contains(PRETTIFIED_EDITED_SUBFOLDER_WITH_PAGES_TITLE)
      cy.url().should('include', `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/folder/${PARSED_EDITED_TEST_FOLDER_WITH_PAGES_TITLE}/subfolder/${PARSED_EDITED_TEST_SUBFOLDER_WITH_PAGES_TITLE}`)
      cy.contains(PRETTIFIED_PAGE_TITLE).click()
      cy.get('.CodeMirror-scroll').should('contain', TEST_PAGE_CONTENT)
    })

    // Delete
    it('Should be able to delete a sub-folder', () => {
      cy.contains(PRETTIFIED_FOLDER_NO_PAGES_TITLE).click()
      cy.get('.bx-dots-vertical-rounded').parent().click()
      cy.contains('Delete').click()
      cy.contains('button', 'Delete').click()

      // Assert
      cy.wait(4000)
      cy.contains('There are no pages in this folder.')
    })

    it('Should be able to delete a folder', () => {
      cy.contains(PRETTIFIED_FOLDER_NO_PAGES_TITLE).within(() => cy.get('[id^=settingsIcon]').click())
      cy.get('div[id^=delete-]').first().click()
      cy.contains('button', 'Delete').click()

      cy.wait(4000)
      cy.contains(PRETTIFIED_FOLDER_NO_PAGES_TITLE).should('not.exist')

      cy.contains(PRETTIFIED_EDITED_FOLDER_WITH_PAGES_TITLE).within(() => cy.get('[id^=settingsIcon]').click())
      cy.get('div[id^=delete-]').first().click()
      cy.contains('button', 'Delete').click()

      cy.wait(4000)
      cy.contains(PRETTIFIED_EDITED_FOLDER_WITH_PAGES_TITLE).should('not.exist')
    })
  })

  describe('Create page, delete page, edit page settings in folder', () => {
    before(() => {
      cy.setCookie(COOKIE_NAME, COOKIE_VALUE)
      window.localStorage.setItem('userId', 'test')
      cy.visit(`${CMS_BASEURL}/sites/${TEST_REPO_NAME}/workspace`)
      cy.contains('Create new folder').click()
      cy.get('input#folder').clear().type(TEST_FOLDER_NO_PAGES_TITLE)
      cy.contains('Select pages').click()
      cy.contains('Done').click()

      // Assert
      cy.wait(4000)
      cy.contains(PRETTIFIED_FOLDER_NO_PAGES_TITLE)
      cy.url().should('include', `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/folder/${PARSED_TEST_FOLDER_NO_PAGES_TITLE}`)
      cy.contains('There are no pages in this folder.')
    })

    beforeEach(() => {
      cy.setCookie(COOKIE_NAME, COOKIE_VALUE)
      window.localStorage.setItem('userId', 'test')
      cy.visit(`${CMS_BASEURL}/sites/${TEST_REPO_NAME}/folder/${PARSED_TEST_FOLDER_NO_PAGES_TITLE}`)
    })
  
    it('Should be able to create a new page with valid title and permalink', () => {
      cy.contains('Create new page').click()
      cy.get('#title').clear().type(TEST_PAGE_TITLE)
      cy.get('#permalink').clear().type(TEST_PAGE_PERMALNK)
      cy.contains('Save').click()

      // Asserts
      // 1. User should be redirected to correct EditPage
      cy.url().should('include', `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/folder/${PARSED_TEST_FOLDER_NO_PAGES_TITLE}/${TEST_PAGE_FILENAME}`)
      cy.contains(PRETTIFIED_PAGE_TITLE)

      // 2. If user goes back to the workspace, they should be able to see that the page exists
      cy.contains('button', PRETTIFIED_FOLDER_NO_PAGES_TITLE).click()
      cy.contains(PRETTIFIED_PAGE_TITLE)
    })

    it('Should not be able to create page with invalid title or permalink', () => {
      const SHORT_TITLE = 'abc'
      const SHORT_PERMALINK = '/12'
      const INVALID_PERMALINK = 'test-'

      cy.contains('Create new page').click()

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
      cy.get('.bx-dots-vertical-rounded').parent().click()
      cy.get('div[id^=settings-]').first().click()
      cy.get('#title').clear().type(EDITED_TEST_PAGE_TITLE)
      cy.contains('button', 'Save').click()

      // New page title should be reflected in the Workspace
      cy.contains(EDITED_PRETTIFIED_PAGE_TITLE)
    })

    it('Should be able to delete existing page on workspace', () => {
      const testPageCard = cy.contains(EDITED_PRETTIFIED_PAGE_TITLE)

      // Assert
      // User should be able to remove the created test page card
      cy.contains(EDITED_PRETTIFIED_PAGE_TITLE)
      cy.get('.bx-dots-vertical-rounded').parent().click()
      cy.get('div[id^=delete-]').first().click()
      cy.contains('button', 'Delete').click()
      cy.wait(2000)

      cy.contains(EDITED_PRETTIFIED_PAGE_TITLE).should('not.exist')
    })
  })
})