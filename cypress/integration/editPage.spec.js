import 'cypress-file-upload'
import { slugifyCategory, generateResourceFileName, generatePageFileName } from '../../src/utils'

Cypress.config('baseUrl', Cypress.env('BASEURL'))
Cypress.config('defaultCommandTimeout', 5000)

// Constants
const CMS_BASEURL = Cypress.env('BASEURL')
const COOKIE_NAME = Cypress.env('COOKIE_NAME')
const COOKIE_VALUE = Cypress.env('COOKIE_VALUE')
const TEST_REPO_NAME = Cypress.env('TEST_REPO_NAME')

const TEST_PRIMARY_COLOR_VALUES = [255, 0, 0]
const PRIMARY_COLOUR = `rgb(${TEST_PRIMARY_COLOR_VALUES.join(', ')})`
const TEST_SECONDARY_COLOR_VALUES = [0, 255, 0]
const SECONDARY_COLOUR = `rgb(${TEST_SECONDARY_COLOR_VALUES.join(', ')})`

describe('Edit unlinked page', () => {
  const TEST_PAGE_CONTENT = 'lorem ipsum'

  const TEST_UNLINKED_PAGE_TITLE = 'Test Unlinked Page'
  const TEST_UNLINKED_PAGE_FILE_NAME = `${slugifyCategory(TEST_UNLINKED_PAGE_TITLE)}.md`

  const DEFAULT_IMAGE_TITLE = 'hero-banner.png'
  const ADDED_IMAGE_TITLE = 'balloon.png'
  const ADDED_IMAGE_PATH = 'images/balloon.png'

  const ADDED_FILE_TITLE = 'editpage_placeholder_add.txt'
  const ADDED_FILE_PATH = 'files/editpage_placeholder_add.txt'

  const LINK_TITLE = 'link'
  const LINK_URL = 'https://www.google.com'

  before(() => {
    cy.setCookie(COOKIE_NAME, COOKIE_VALUE)
    window.localStorage.setItem('userId', 'test')

    // Set colour
    cy.visit(`/sites/${TEST_REPO_NAME}/settings`)
    cy.contains('p', 'Primary').siblings('div').click()
    cy.contains(/^r/).siblings().clear().type(TEST_PRIMARY_COLOR_VALUES[0].toString())
    cy.contains(/^g/).siblings().clear().type(TEST_PRIMARY_COLOR_VALUES[1].toString())
    cy.contains(/^b/).siblings().clear().type(TEST_PRIMARY_COLOR_VALUES[2].toString())
    cy.contains('button', 'Select').click()
    cy.contains('button', 'Save').click()
    cy.wait(2000)

    // Set up test resource categories
    cy.visit(`/sites/${TEST_REPO_NAME}/workspace`)
    cy.contains('Add a new page').click()
    cy.get('#title').clear().type(TEST_UNLINKED_PAGE_TITLE)
    cy.contains('Save').click()
    cy.wait(5000)
  })

  beforeEach(() => {
    // Before each test, we can automatically preserve the cookie.
    // This means it will not be cleared before the NEXT test starts.
    cy.setCookie(COOKIE_NAME, COOKIE_VALUE)
    window.localStorage.setItem('userId', 'test')
    cy.visit(`/sites/${TEST_REPO_NAME}/pages/${TEST_UNLINKED_PAGE_FILE_NAME}`)
    cy.wait(2000)
  })

  it('Edit page (unlinked) should have correct colour', () => {
    cy.get('#display-header').should('have.css', 'background-color', PRIMARY_COLOUR)
  })

  it('Edit page (unlinked) should have name of title', () => {
    cy.contains(TEST_UNLINKED_PAGE_TITLE)
  })

  it('Edit page (unlinked) should provide a warning to users when navigating away', () => {
    cy.get('.CodeMirror-scroll').type(TEST_PAGE_CONTENT)
    cy.contains(':button', 'My Workspace').click()

    cy.contains('Warning')
    cy.contains(':button', 'No').click()

    // Sanity check: still in unlinked pages and content still present
    cy.url().should('include', `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/pages/${TEST_UNLINKED_PAGE_FILE_NAME}`)
    cy.contains(TEST_PAGE_CONTENT)

    cy.contains(':button', 'My Workspace').click()

    cy.contains('Warning')
    cy.contains(':button', 'Yes').click()

    // Assert: in Workspace
    cy.url().should('include', `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/workspace`)
  })

  it('Edit page should allow user to modify and save content', () => {
    cy.get('.CodeMirror-scroll').type(TEST_PAGE_CONTENT)
    cy.contains(':button', 'Save').click()

    // Asserts
    // 1. Toast
    cy.contains('Successfully saved page content')

    // 2. Content is there even after refreshing
    cy.reload()
    cy.contains(TEST_PAGE_CONTENT).should('exist')
  })

  it('Edit page should allow user to add existing image', () => {
    cy.get('.image').click()
    cy.contains(DEFAULT_IMAGE_TITLE).click()
    cy.contains(':button', 'Select image').click()

    cy.contains(`/images/${DEFAULT_IMAGE_TITLE}`)
  })

  it('Edit page should allow user to upload and add existing image', () => {
    cy.get('.image').click()
    cy.contains(':button', 'Add new image').click()

    cy.get('#file-upload').attachFile(ADDED_IMAGE_PATH)
    cy.get('#file-name').clear().type(ADDED_IMAGE_TITLE)
    cy.get('button').contains(/^Upload$/).click()
    cy.wait(2000)

    cy.contains(`/images/${ADDED_IMAGE_TITLE}`)
  })

  it('Edit page should allow user to upload and add new file', () => {
    cy.get('.file').click()
    cy.contains(':button', 'Add new file').click()

    cy.get('#file-upload').attachFile(ADDED_FILE_PATH)
    cy.get('#file-name').clear().type(ADDED_FILE_TITLE)
    cy.get('button').contains(/^Upload$/).click()
    cy.wait(2000)

    cy.contains(`/files/${ADDED_FILE_TITLE}`)
  })

  it('Edit page should allow user to add existing file', () => {
    cy.get('.file').click()
    cy.contains(ADDED_FILE_TITLE).click()
    cy.contains(':button', 'Select file').click()

    cy.contains(`/files/${ADDED_FILE_TITLE}`)
  })

  it('Edit page should allow user to add link', () => {
    cy.get('.link').click()

    cy.get('input[id="text"]').type(LINK_TITLE)
    cy.get('input[id="link"]').type(LINK_URL)
    cy.contains(':button', 'Save').click()

    cy.contains(`[${LINK_TITLE}](${LINK_URL})`)
  })

  it('Edit page should allow user to delete page', () => {
    cy.contains(':button', 'Delete').click()

    // Cancel works properly in modal
    cy.get('#modal-cancel').click()

    cy.contains(':button', 'Delete').click()

    // Test delete in modal
    cy.get('#modal-delete').click()
    
    // Assert: page no longer exists
    cy.visit(`/sites/${TEST_REPO_NAME}/pages/${TEST_UNLINKED_PAGE_FILE_NAME}`)
    cy.contains('The page you are looking for does not exist anymore.')
  })
})

describe('Edit collection page', () => {
  const TEST_FOLDER_TITLE = 'Test Edit Collection Category'
  const TEST_FOLDER_TITLE_SLUGIFIED = slugifyCategory(TEST_FOLDER_TITLE)

  const TEST_PAGE_TITLE = 'Test Collection Page'
  const TEST_PAGE_TITLE_SLUGIFIED = generatePageFileName(TEST_PAGE_TITLE)

  before(() => {
    cy.setCookie(COOKIE_NAME, COOKIE_VALUE)
    window.localStorage.setItem('userId', 'test')

    // Set up test collection
    cy.visit(`/sites/${TEST_REPO_NAME}/workspace`)
    cy.contains('Create new folder').should('exist').click()
    cy.get('input#folder').clear().type(TEST_FOLDER_TITLE)
    cy.contains('Select pages').click()
    cy.contains('Done').click()
    cy.wait(2000)

    // Set up test collection page
    cy.visit(`/sites/${TEST_REPO_NAME}/folder/${TEST_FOLDER_TITLE_SLUGIFIED}`)
    cy.contains('Create new page').should('exist').click()
    cy.get('#title').clear().type(TEST_PAGE_TITLE)
    cy.contains('Save').click()
    cy.wait(2000)
  })

  beforeEach(() => {
    // Before each test, we can automatically preserve the cookie.
    // This means it will not be cleared before the NEXT test starts.
    cy.setCookie(COOKIE_NAME, COOKIE_VALUE)
    window.localStorage.setItem('userId', 'test')
    cy.visit(`/sites/${TEST_REPO_NAME}/folder/${TEST_FOLDER_TITLE_SLUGIFIED}/${TEST_PAGE_TITLE_SLUGIFIED}`)
    cy.wait(2000)
  })

  it('Edit page (collection) should have correct colour', () => {
    cy.get('#display-header').should('have.css', 'background-color', PRIMARY_COLOUR)
  })

  it('Edit page (collection) should have third nav menu', () => {
    cy.get('#sidenav').contains(TEST_PAGE_TITLE).should('exist')
  })
})

describe('Edit resource page', () => {
  const TEST_CATEGORY = 'Test Edit Resource Category'
  const TEST_CATEGORY_SLUGIFIED = slugifyCategory(TEST_CATEGORY)

  const TEST_PAGE_TITLE = 'Test Resource Page'
  const TEST_PAGE_DATE = '2021-05-17'

  before(() => {
    cy.setCookie(COOKIE_NAME, COOKIE_VALUE)
    window.localStorage.setItem('userId', 'test')

    // Set colour
    cy.visit(`/sites/${TEST_REPO_NAME}/settings`)
    cy.contains('p', 'Secondary').siblings('div').click()
    cy.contains(/^r/).siblings().clear().type(TEST_SECONDARY_COLOR_VALUES[0].toString())
    cy.contains(/^g/).siblings().clear().type(TEST_SECONDARY_COLOR_VALUES[1].toString())
    cy.contains(/^b/).siblings().clear().type(TEST_SECONDARY_COLOR_VALUES[2].toString())
    cy.contains('button', 'Select').click()
    cy.contains('button', 'Save').click()
    cy.wait(2000)

    // Set up test resource category
    cy.visit(`/sites/${TEST_REPO_NAME}/resources`)
    cy.contains('Create new category').click()
    cy.get('input').clear().type(TEST_CATEGORY)
    cy.contains('Save').click()
    cy.wait(2000)

    // Set up test resource page
    cy.visit(`${CMS_BASEURL}/sites/${TEST_REPO_NAME}/resources/${TEST_CATEGORY_SLUGIFIED}`)

    cy.contains('Add a new page').click()
    cy.wait(2000)

    cy.get('input[id="title"]').clear().type(TEST_PAGE_TITLE)
    cy.get('input[id="date"]').clear().type(TEST_PAGE_DATE)
    cy.contains('Save').click()
    cy.wait(2000)
  })

  beforeEach(() => {
    // Before each test, we can automatically preserve the cookie.
    // This means it will not be cleared before the NEXT test starts.
    cy.setCookie(COOKIE_NAME, COOKIE_VALUE)
    window.localStorage.setItem('userId', 'test')
    cy.visit(`${CMS_BASEURL}/sites/${TEST_REPO_NAME}/resources/${TEST_CATEGORY_SLUGIFIED}/${generateResourceFileName(TEST_PAGE_TITLE, TEST_PAGE_DATE, true)}`)
    cy.wait(2000)
  })

  it('Edit page (resource) should have correct colour', () => {
    cy.get('#display-header').should('have.css', 'background-color', SECONDARY_COLOUR)
  })
})