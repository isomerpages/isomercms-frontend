import 'cypress-file-upload';
import { generateImageorFilePath, slugifyCategory } from '../../src/utils'

describe('Files', () => {
  Cypress.config('baseUrl', Cypress.env('BASEURL'))
  const COOKIE_NAME = Cypress.env('COOKIE_NAME')
  const COOKIE_VALUE = Cypress.env('COOKIE_VALUE')
  const TEST_REPO_NAME = Cypress.env('TEST_REPO_NAME')
  const CUSTOM_TIMEOUT = Cypress.env('CUSTOM_TIMEOUT')

  const FILE_TITLE = 'singapore.pdf'
  const OTHER_FILE_TITLE = 'america.pdf'
  const TEST_FILE_PATH = 'files/singapore.pdf'

  const DIRECTORY_TITLE = 'Purple'
  const OTHER_DIRECTORY_TITLE = 'Green'
  const SLUGIFIED_DIRECTORY_TITLE = slugifyCategory(DIRECTORY_TITLE)

  const MISSING_EXTENSION = 'singapore'
  const INVALID_CHARACTER = '!!.pdf'
  const ACTION_DISABLED = 'true'

  describe('Create file, delete file, edit file settings in Files', () => {
    beforeEach(() => {
      cy.setCookie(COOKIE_NAME, COOKIE_VALUE)
      window.localStorage.setItem('userId', 'test')

      cy.visit(`/sites/${TEST_REPO_NAME}/documents`)
    })
      
    it('Files should contain Directories and Ungrouped Files', () => {
      cy.contains('Directories')
      cy.contains('Ungrouped files')
      cy.contains('Upload new file')
      cy.contains('Create new directory')
    })

    it('Should be able to create new file with valid title', () => {
      // Set intercept to listen for POST request on server
      cy.intercept({ method:'POST', url: `/v1/sites/${TEST_REPO_NAME}/documents` }).as('createFile')

      cy.uploadMedia(FILE_TITLE, TEST_FILE_PATH)
      // ASSERTS
      cy.wait('@createFile') // should intercept POST request
      cy.contains(FILE_TITLE, { timeout: CUSTOM_TIMEOUT}).should('exist') // file should be contained in Files
    
    })

    it('Should be able to edit an file', () => {
      // Set intercept to listen for POST request on server
      cy.intercept({ method:'POST', url: `/v1/sites/e2e-test-repo/documents/${FILE_TITLE}/rename/${OTHER_FILE_TITLE}` }).as('renameFile')
      
      cy.renameMedia(FILE_TITLE, OTHER_FILE_TITLE)
      // ASSERTS
      cy.wait('@renameFile')
      cy.contains(OTHER_FILE_TITLE, { timeout: CUSTOM_TIMEOUT}).should('exist') // file should be contained in Files

      // Set intercept to listen for POST request on server
      cy.intercept({ method:'POST', url: `/v1/sites/e2e-test-repo/documents/${OTHER_FILE_TITLE}/rename/${FILE_TITLE}` }).as('renameFileBack')
      
      cy.renameMedia(OTHER_FILE_TITLE, FILE_TITLE) // Rename file to original title 
      // ASSERTS
      cy.wait('@renameFileBack')
      cy.contains(FILE_TITLE, { timeout: CUSTOM_TIMEOUT}).should('exist')
    })

    it('Should not be able to create file with invalid title', () => {
      
      // should not be able to save with invalid characters in title 
      cy.uploadMedia(INVALID_CHARACTER, TEST_FILE_PATH, ACTION_DISABLED)
      // ASSERTS
      cy.contains('Invalid filename: filename must not contain any special characters')
      cy.get('button').contains(/^Upload$/).should('be.disabled') // necessary as multiple buttons containing Upload on page 
      cy.get('#closeMediaSettingsModal').click()

      // title should not allow for names without extensions
      cy.uploadMedia(MISSING_EXTENSION, TEST_FILE_PATH, ACTION_DISABLED)
      // ASSERTS
      cy.contains('Invalid filename: filename can only contain one full stop and must follow the structure {name}.{extension}')
      cy.get('button').contains(/^Upload$/).should('be.disabled') // necessary as multiple buttons containing Upload on page 
      cy.get('#closeMediaSettingsModal').click()

      // users should not be able to create file with duplicated filename in folder
      cy.uploadMedia(FILE_TITLE, TEST_FILE_PATH, ACTION_DISABLED) 
      // ASSERTS
      cy.contains('This title is already in use. Please choose a different title.')
      cy.get('button').contains(/^Upload$/).should('be.disabled') // necessary as multiple buttons containing Upload on page
    })

    it('Should not be able to edit file and save with invalid title', () => {
      
      // should not be able to save with invalid characters in title 
      cy.renameMedia(FILE_TITLE, INVALID_CHARACTER, ACTION_DISABLED)
      // ASSERTS
      cy.contains('Invalid filename: filename must not contain any special characters')
      cy.get('button').contains(/^Save$/).should('be.disabled') // necessary as multiple buttons containing Upload on page 
      cy.get('#closeMediaSettingsModal').click()

      // title should not allow for names without extensions
      cy.renameMedia(FILE_TITLE, MISSING_EXTENSION, ACTION_DISABLED)
      // ASSERTS
      cy.contains('Invalid filename: filename can only contain one full stop and must follow the structure {name}.{extension}')
      cy.get('button').contains(/^Save$/).should('be.disabled') // necessary as multiple buttons containing Upload on page 
      cy.get('#closeMediaSettingsModal').click()

      // should not be able to save if no change
      cy.renameMedia(FILE_TITLE, FILE_TITLE, ACTION_DISABLED)
      // ASSERTS
      cy.get('button').contains(/^Save$/).should('be.disabled') // necessary as multiple buttons containing Upload on page 
      cy.get('#closeMediaSettingsModal').click()

      // users should not be able to create file with duplicated filename in folder (NOT SUPPORTED YET)
      cy.uploadMedia(OTHER_FILE_TITLE, TEST_FILE_PATH)  
      cy.renameMedia(OTHER_FILE_TITLE, FILE_TITLE, ACTION_DISABLED)  
      // ASSERTS
      cy.contains('This title is already in use. Please choose a different title.')
      cy.get('button').contains(/^Save$/).should('be.disabled') // necessary as multiple buttons containing Upload on page
      cy.get('#closeMediaSettingsModal').click()
      cy.deleteMedia(OTHER_FILE_TITLE) // clean up
    })

    it('Should be able to delete file', () => {
      // Set intercept to listen for POST request on server
      cy.intercept({ method:'DELETE', url: `/v1/sites/${TEST_REPO_NAME}/documents/${generateImageorFilePath('', FILE_TITLE)}` }).as('deleteFile')

      cy.deleteMedia(FILE_TITLE)
      // ASSERTS
      cy.wait('@deleteFile') // Should intercept DELETE request
      cy.contains(FILE_TITLE).should('not.exist') // File name should not exist in Files
    })
  })

  describe('Create file directory, delete file directory, edit file directory settings in Files', () => {
    
    beforeEach(() => {
      cy.setCookie(COOKIE_NAME, COOKIE_VALUE)
      window.localStorage.setItem('userId', 'test')

      cy.visit(`/sites/${TEST_REPO_NAME}/documents`)
    })

    it('Should be able to create new file directory', () => {
      // Set intercept to listen for POST request on server
      cy.intercept({ method:'POST', url: `/v1/sites/${TEST_REPO_NAME}/media/documents/${slugifyCategory(DIRECTORY_TITLE)}` }).as('createDirectory')

      cy.contains('Create new directory').click()
      cy.get("[id='file directory']").clear().type(DIRECTORY_TITLE)  

      cy.get('button').contains(/^Create$/).click() 

      // ASSERTS
      cy.wait('@createDirectory') // Should intercept POST request
      cy.contains(DIRECTORY_TITLE, { timeout: CUSTOM_TIMEOUT} ).should('exist') // Directory name should be contained in Files
    })

    it('Should be able to edit file directory name', () => {
      
      // User should be able edit directory details
      const testDirectoryCard = cy.contains(DIRECTORY_TITLE)
      testDirectoryCard.children().within(() => cy.get('[id^=settings-]').click())
      cy.get('div[id^=settings-]').first().click() // .first() is necessary because the get returns multiple elements (refer to MenuDropdown.jsx)
      cy.get('#newDirectoryName').clear().type(OTHER_DIRECTORY_TITLE)
      cy.contains('button', 'Save').click()

      // ASSERTS
      cy.contains(OTHER_DIRECTORY_TITLE, { timeout: CUSTOM_TIMEOUT} ).should('exist') // New file directory name should be contained in Files

      // Rename directory to original directory title
      const newTestDirectoryCard = cy.contains(OTHER_DIRECTORY_TITLE)
      newTestDirectoryCard.children().within(() => cy.get('[id^=settings-]').click())
      cy.get('div[id^=settings-]').first().click() // .first() is necessary because the get returns multiple elements (refer to MenuDropdown.jsx)
      cy.get('#newDirectoryName').clear().type(DIRECTORY_TITLE)
      cy.contains('button', 'Save').click()
      
      // ASSERTS
      cy.contains(DIRECTORY_TITLE, { timeout: CUSTOM_TIMEOUT} ).should('exist') // Original file directory name should be contained in Files
    })

    it('Should be able to delete file directory', () => {
      // Set intercept to listen for DELETE request on server
      cy.intercept({ method:'DELETE', url: `/v1/sites/${TEST_REPO_NAME}/media/documents/${slugifyCategory(DIRECTORY_TITLE)}`}).as('deleteDirectory')

      // User should be able delete directory 
      const testDirectoryCard = cy.contains(DIRECTORY_TITLE)
      testDirectoryCard.children().within(() => cy.get('[id^=settings-]').click())
      cy.get('div[id^=delete-]').first().click() // .first() is necessary because the get returns multiple elements (refer to MenuDropdown.jsx)
      cy.contains('button', 'Delete').click()

      // ASSERTS
      cy.wait('@deleteDirectory') // Should intercept POST request
      cy.contains(DIRECTORY_TITLE).should('not.exist') // Directory name should not be contained in Files
    })
  })

  describe('Create file, delete file, edit file settings, and move files in file directories', () => {
    before(() => {
      cy.setCookie(COOKIE_NAME, COOKIE_VALUE)
      window.localStorage.setItem('userId', 'test')

      cy.visit(`/sites/${TEST_REPO_NAME}/documents`)
      cy.contains('Create new directory').click()
      cy.get("[id='file directory']").clear().type(DIRECTORY_TITLE)  
      cy.get('button').contains(/^Create$/).click() 

      // Assert
      cy.contains(DIRECTORY_TITLE, { timeout: CUSTOM_TIMEOUT}).should('exist')
    })

    beforeEach(() => {
      cy.setCookie(COOKIE_NAME, COOKIE_VALUE)
      window.localStorage.setItem('userId', 'test')

      cy.visit(`/sites/${TEST_REPO_NAME}/documents/${SLUGIFIED_DIRECTORY_TITLE}`)
    })

    it('Should be able to add file to file directory', () => {
      // Set intercept to listen for POST request on server
      cy.intercept({ method:'POST', url: `/v1/sites/${TEST_REPO_NAME}/documents` }).as('createFile')

      cy.uploadMedia(FILE_TITLE, TEST_FILE_PATH)
      // ASSERTS
      cy.wait('@createFile') // should intercept POST request
      cy.contains(FILE_TITLE, { timeout: CUSTOM_TIMEOUT}).should('exist') // file should be contained in Files
    })

    it('Should be able to edit an file in file directory', () => {      
      cy.intercept({ method:'POST', url: `/v1/sites/e2e-test-repo/documents/${generateImageorFilePath(SLUGIFIED_DIRECTORY_TITLE, FILE_TITLE)}/rename/${generateImageorFilePath(SLUGIFIED_DIRECTORY_TITLE, OTHER_FILE_TITLE)}` }).as('renameFile')
      
      cy.renameMedia(FILE_TITLE, OTHER_FILE_TITLE)
      // ASSERTS
      cy.wait('@renameFile')
      cy.contains(OTHER_FILE_TITLE, { timeout: CUSTOM_TIMEOUT}).should('exist') // File should be contained in Files

      cy.intercept({ method:'POST', url: `/v1/sites/e2e-test-repo/documents/${generateImageorFilePath(SLUGIFIED_DIRECTORY_TITLE, OTHER_FILE_TITLE)}/rename/${generateImageorFilePath(SLUGIFIED_DIRECTORY_TITLE, FILE_TITLE)}` }).as('renameFileBack')
      
      cy.renameMedia(OTHER_FILE_TITLE, FILE_TITLE)
      // ASSERTS
      cy.wait('@renameFileBack')
      cy.contains(FILE_TITLE, { timeout: CUSTOM_TIMEOUT}).should('exist')
    })

    it('Should be able to delete file from file directory', () => {
      // Set intercept to listen for POST request on server
      cy.intercept({ method:'DELETE', url: `/v1/sites/${TEST_REPO_NAME}/documents/${generateImageorFilePath(SLUGIFIED_DIRECTORY_TITLE, FILE_TITLE)}` }).as('deleteFile')

      cy.deleteMedia(FILE_TITLE)
      // ASSERTS
      cy.wait('@deleteFile') // Should intercept DELETE request
      cy.contains(FILE_TITLE, { timeout: CUSTOM_TIMEOUT}).should('not.exist') //File file name should not exist in Files
    })

    it('Should be able to move file from file directory to Files', () => {
      cy.intercept({ method:'POST', url: `/v1/sites/${TEST_REPO_NAME}/documents` }).as('createFile')
      cy.uploadMedia(FILE_TITLE, TEST_FILE_PATH)
      cy.wait('@createFile')
      
      // Set intercept to listen for POST request on server
      cy.intercept({ method:'POST', url: `/v1/sites/${TEST_REPO_NAME}/documents/${encodeURIComponent(`${SLUGIFIED_DIRECTORY_TITLE}/${FILE_TITLE}`)}/move/${FILE_TITLE}`}).as('moveFile')
      cy.moveMedia(FILE_TITLE)
      
      // ASSERTS
      cy.wait('@moveFile')  // should intercept POST request
      cy.visit(`/sites/${TEST_REPO_NAME}/documents`)
      cy.contains(FILE_TITLE) // file should be contained in directory
      
      cy.deleteMedia(FILE_TITLE) // cleanup
    })

    it('Should be able to move file from Files to file directory', () => {
      cy.intercept({ method:'POST', url: `/v1/sites/${TEST_REPO_NAME}/documents` }).as('createFile')
      cy.visit(`/sites/${TEST_REPO_NAME}/documents`)
      cy.uploadMedia(FILE_TITLE, TEST_FILE_PATH)
      cy.wait('@createFile')
      
      // Set intercept to listen for POST request on server
      cy.intercept({ method:'POST', url: `/v1/sites/${TEST_REPO_NAME}/documents/${FILE_TITLE}/move/${encodeURIComponent(`${SLUGIFIED_DIRECTORY_TITLE}/${FILE_TITLE}`)}`}).as('moveFile')
      cy.moveMedia(FILE_TITLE, SLUGIFIED_DIRECTORY_TITLE)
      
      // ASSERTS
      cy.wait('@moveFile')  // should intercept POST request
      cy.visit(`/sites/${TEST_REPO_NAME}/documents/${SLUGIFIED_DIRECTORY_TITLE}`)
      cy.contains(FILE_TITLE) // file should be contained in directory
      
      cy.deleteMedia(FILE_TITLE) // cleanup
    })

    after(() => {
      cy.visit(`/sites/${TEST_REPO_NAME}/documents`)
      const testDirectoryCard = cy.contains(DIRECTORY_TITLE)
      testDirectoryCard.children().within(() => cy.get('[id^=settings-]').click())
      cy.get('div[id^=delete-]').first().click() // .first() is necessary because the get returns multiple elements (refer to MenuDropdown.jsx)
      cy.contains('button', 'Delete').click()

      // ASSERTS
      cy.contains(DIRECTORY_TITLE, { timeout: CUSTOM_TIMEOUT}).should('not.exist')
    })
  })
})