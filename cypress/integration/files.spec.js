import 'cypress-file-upload';
import { generateImageorFilePath, slugifyCategory, deslugifyDirectory } from '../../src/utils'

describe('Files', () => {
  const CMS_BASEURL = Cypress.env('BASEURL')
  const COOKIE_NAME = Cypress.env('COOKIE_NAME')
  const COOKIE_VALUE = Cypress.env('COOKIE_VALUE')
  const TEST_REPO_NAME = Cypress.env('TEST_REPO_NAME')

  const TEST_FILE_PATH = 'files/singapore.pdf'
  const FILE_TITLE = 'singapore.pdf'
  const DIRECTORY_TITLE = 'Singapore'

  beforeEach(() => {
    cy.setCookie(COOKIE_NAME, COOKIE_VALUE)
    window.localStorage.setItem('userId', 'test')
    cy.visit(`${CMS_BASEURL}/sites/${TEST_REPO_NAME}/documents`)
  })

  it('Files should contain Directories and Ungrouped Files', () => {
    cy.contains('Directories')
    cy.contains('Ungrouped files')
    cy.contains('Upload new file')
    cy.contains('Create new directory')
  })

  describe('Files flow', () => {

    it('Should be able to create new file with valid title', () => {
      // Set intercept to listen for POST request on server
      cy.intercept({ method:'POST', url: `/v1/sites/${TEST_REPO_NAME}/documents` }).as('createFile')

      cy.uploadMedia(FILE_TITLE, TEST_FILE_PATH)
      // ASSERTS
      cy.wait('@createFile') // should intercept POST request
      cy.contains(FILE_TITLE) // file should be contained in Files
    
    })

    it('Should be able to edit an file', () => {
      const NEW_FILE_TITLE = 'america.pdf'
      
      cy.renameMedia(FILE_TITLE, NEW_FILE_TITLE)
      // ASSERTS
      cy.contains(NEW_FILE_TITLE) // file should be contained in Files

      cy.renameMedia(NEW_FILE_TITLE, FILE_TITLE) // Rename file to original title 
      // ASSERTS
      cy.contains(FILE_TITLE)
    })


    it('Should not be able to create file with invalid title', () => {
      const MISSING_EXTENSION = 'singapore'
      const INVALID_CHARACTER = '!!.pdf'
      const ACTION_DISABLED = 'true'
      
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

      // users should not be able to create file with duplicated filename in folder (NOT SUPPORTED YET)
      // cy.uploadMedia(FILE_TITLE, TEST_FILE_PATH, ACTION_DISABLED) 
      // // ASSERTS
      // cy.contains('Invalid filename: filename can only contain one full stop and must follow the structure {name}.{extension}')
      // cy.get('button').contains(/^Upload$/).should('be.disabled') // necessary as multiple buttons containing Upload on page
    })

    it('Should not be able to edit file and save with invalid title', () => {
      const MISSING_EXTENSION = 'singapore'
      const INVALID_CHARACTER = '!!.png'
      const ACTION_DISABLED = 'true'
      
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
      // cy.uploadFile(FILE_TITLE, TEST_FILE_PATH, ACTION_DISABLED)  
      // cy.contains('Invalid filename: filename can only contain one full stop and must follow the structure {name}.{extension}')
      // cy.get('button').contains(/^Save$/).should('be.disabled') // necessary as multiple buttons containing Upload on page
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

  describe('File Directories flows', () => {
    
    it('Should be able to create new file directory', () => {
      // Set intercept to listen for POST request on server
      cy.intercept({ method:'POST', url: `/v1/sites/${TEST_REPO_NAME}/media/documents/${slugifyCategory(DIRECTORY_TITLE)}` }).as('createDirectory')

      cy.contains('Create new directory').click()
      cy.get("[id='file directory']").clear().type(DIRECTORY_TITLE)  

      cy.get('button').contains(/^Create$/).click() 

      // ASSERTS
      cy.wait('@createDirectory') // Should intercept POST request
      cy.contains(DIRECTORY_TITLE) // Directory name should be contained in Files
    })

    it('Should be able to edit file directory name', () => {
      const NEW_DIRECTORY_TITLE = 'America'
      
      // User should be able edit directory details
      const testDirectoryCard = cy.contains(DIRECTORY_TITLE)
      testDirectoryCard.children().within(() => cy.get('[id^=settings-]').click())
      cy.get('div[id^=settings-]').first().click() // .first() is necessary because the get returns multiple elements (refer to MenuDropdown.jsx)
      cy.get('#newDirectoryName').clear().type(NEW_DIRECTORY_TITLE)
      cy.contains('button', 'Save').click()

      // ASSERTS
      cy.wait(3000)
      cy.contains(NEW_DIRECTORY_TITLE) // New file directory name should be contained in Files

      // Rename directory to original directory title
      const newTestDirectoryCard = cy.contains(NEW_DIRECTORY_TITLE)
      newTestDirectoryCard.children().within(() => cy.get('[id^=settings-]').click())
      cy.get('div[id^=settings-]').first().click() // .first() is necessary because the get returns multiple elements (refer to MenuDropdown.jsx)
      cy.get('#newDirectoryName').clear().type(DIRECTORY_TITLE)
      cy.contains('button', 'Save').click()
      
      // ASSERTS
      cy.wait(3000)
      cy.contains(DIRECTORY_TITLE) // Original file directory name should be contained in Files
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

  describe('Nested Files flow', () => {
    
    const EXISTING_DIRECTORY_TITLE = 'test' // Should be existing repo since we don't want the tests to fail in cascade 
    
    beforeEach(() => {
      cy.visit(`${CMS_BASEURL}/sites/${TEST_REPO_NAME}/documents/${EXISTING_DIRECTORY_TITLE}`)
    })

    it('Should be able to add file to file directory', () => {
      // Set intercept to listen for POST request on server
      cy.intercept({ method:'POST', url: `/v1/sites/${TEST_REPO_NAME}/documents` }).as('createFile')

      cy.uploadMedia(FILE_TITLE, TEST_FILE_PATH)
      // ASSERTS
      cy.wait('@createFile') // should intercept POST request
      cy.contains(FILE_TITLE) // file should be contained in Files
    })

    it('Should be able to edit an file in file directory', () => {
      const NEW_FILE_TITLE = 'america.pdf'
      
      cy.renameMedia(FILE_TITLE, NEW_FILE_TITLE)
      // ASSERTS
      cy.contains(NEW_FILE_TITLE) // File should be contained in Files

      cy.renameMedia(NEW_FILE_TITLE, FILE_TITLE) // Rename file to original title 
      // ASSERTS
      cy.contains(FILE_TITLE)
    })

    it('Should be able to delete file from file directory', () => {
      // Set intercept to listen for POST request on server
      cy.intercept({ method:'DELETE', url: `/v1/sites/${TEST_REPO_NAME}/documents/${generateImageorFilePath(EXISTING_DIRECTORY_TITLE, FILE_TITLE)}` }).as('deleteFile')

      cy.deleteMedia(FILE_TITLE)
      // ASSERTS
      cy.wait('@deleteFile') // Should intercept DELETE request
      cy.contains(FILE_TITLE).should('not.exist') //File file name should not exist in Files
    })
  })
})