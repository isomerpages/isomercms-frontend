import 'cypress-file-upload';
import { generateImageorFilePath, slugifyCategory, deslugifyDirectory } from '../../src/utils'

describe('Images', () => {
  const CMS_BASEURL = Cypress.env('BASEURL')
  const COOKIE_NAME = Cypress.env('COOKIE_NAME')
  const COOKIE_VALUE = Cypress.env('COOKIE_VALUE')
  const TEST_REPO_NAME = Cypress.env('TEST_REPO_NAME')

  const TEST_IMAGE_PATH = 'images/singapore.jpg'
  const IMAGE_TITLE = 'singapore.jpg'
  const ALBUM_TITLE = 'Singapore'

  beforeEach(() => {
    cy.setCookie(COOKIE_NAME, COOKIE_VALUE)
    window.localStorage.setItem('userId', 'test')
    cy.visit(`${CMS_BASEURL}/sites/${TEST_REPO_NAME}/images`)
  })

  it('Images should contain Albums and Ungrouped Images', () => {
    cy.contains('Albums')
    cy.contains('Ungrouped images')
    cy.contains('Upload new image')
    cy.contains('Create new album')
  })

  describe('Images flow', () => {

    it('Should be able to create new image with valid title', () => {
      // Set intercept to listen for POST request on server
      cy.intercept({ method:'POST', url: `/v1/sites/${TEST_REPO_NAME}/images` }).as('createImage')

      cy.uploadImage(IMAGE_TITLE, TEST_IMAGE_PATH)
      // ASSERTS
      cy.wait('@createImage') // should intercept POST request
      cy.contains(IMAGE_TITLE) // image should be contained in Images
    
    })

    it('Should be able to edit an image', () => {
      const NEW_IMAGE_TITLE = 'america.jpg'
      
      cy.renameImage(IMAGE_TITLE, NEW_IMAGE_TITLE)
      // ASSERTS
      cy.contains(NEW_IMAGE_TITLE) // Image should be contained in Images

      cy.renameImage(NEW_IMAGE_TITLE, IMAGE_TITLE) // Rename image to original title 
      // ASSERTS
      cy.contains(IMAGE_TITLE)
    })


    it('Should not be able to create image with invalid title', () => {
      const MISSING_EXTENSION = 'singapore'
      const INVALID_CHARACTER = '!!.png'
      const ACTION_DISABLED = 'true'
      
      // should not be able to save with invalid characters in title 
      cy.uploadImage(INVALID_CHARACTER, TEST_IMAGE_PATH, ACTION_DISABLED)
      // ASSERTS
      cy.contains('Invalid filename: filename must not contain any special characters')
      cy.get('button').contains(/^Upload$/).should('be.disabled') // necessary as multiple buttons containing Upload on page 
      cy.get('#closeMediaSettingsModal').click()

      // title should not allow for names without extensions
      cy.uploadImage(MISSING_EXTENSION, TEST_IMAGE_PATH, ACTION_DISABLED)
      // ASSERTS
      cy.contains('Invalid filename: filename can only contain one full stop and must follow the structure {name}.{extension}')
      cy.get('button').contains(/^Upload$/).should('be.disabled') // necessary as multiple buttons containing Upload on page 
      cy.get('#closeMediaSettingsModal').click()

      // users should not be able to create file with duplicated filename in folder (NOT SUPPORTED YET)
      // cy.uploadImage(IMAGE_TITLE, TEST_IMAGE_PATH, ACTION_DISABLED) 
      // // ASSERTS
      // cy.contains('Invalid filename: filename can only contain one full stop and must follow the structure {name}.{extension}')
      // cy.get('button').contains(/^Upload$/).should('be.disabled') // necessary as multiple buttons containing Upload on page
    })

    it('Should not be able to edit image and save with invalid title', () => {
      const MISSING_EXTENSION = 'singapore'
      const INVALID_CHARACTER = '!!.png'
      const ACTION_DISABLED = 'true'
      
      // should not be able to save with invalid characters in title 
      cy.renameImage(IMAGE_TITLE, INVALID_CHARACTER, ACTION_DISABLED)
      // ASSERTS
      cy.contains('Invalid filename: filename must not contain any special characters')
      cy.get('button').contains(/^Save$/).should('be.disabled') // necessary as multiple buttons containing Upload on page 
      cy.get('#closeMediaSettingsModal').click()

      // title should not allow for names without extensions
      cy.renameImage(IMAGE_TITLE, MISSING_EXTENSION, ACTION_DISABLED)
      // ASSERTS
      cy.contains('Invalid filename: filename can only contain one full stop and must follow the structure {name}.{extension}')
      cy.get('button').contains(/^Save$/).should('be.disabled') // necessary as multiple buttons containing Upload on page 
      cy.get('#closeMediaSettingsModal').click()

      // should not be able to save if no change
      cy.renameImage(IMAGE_TITLE, IMAGE_TITLE, ACTION_DISABLED)
      // ASSERTS
      cy.get('button').contains(/^Save$/).should('be.disabled') // necessary as multiple buttons containing Upload on page 
      cy.get('#closeMediaSettingsModal').click()

      // users should not be able to create file with duplicated filename in folder (NOT SUPPORTED YET)
      // cy.uploadImage(IMAGE_TITLE, TEST_IMAGE_PATH, ACTION_DISABLED)  
      // cy.contains('Invalid filename: filename can only contain one full stop and must follow the structure {name}.{extension}')
      // cy.get('button').contains(/^Save$/).should('be.disabled') // necessary as multiple buttons containing Upload on page
    })

    it('Should be able to delete image', () => {
      // Set intercept to listen for POST request on server
      cy.intercept({ method:'DELETE', url: `/v1/sites/${TEST_REPO_NAME}/images/${generateImageorFilePath('', IMAGE_TITLE)}` }).as('deleteImage')

      cy.deleteImage(IMAGE_TITLE)
      // ASSERTS
      cy.wait('@deleteImage') // Should intercept DELETE request
      cy.contains(IMAGE_TITLE).should('not.exist') //Image file name should not exist in Images
    })
  })

  describe('Image Albums flows', () => {
    
    it('Should be able to create new image album', () => {
      // Set intercept to listen for POST request on server
      cy.intercept({ method:'POST', url: `/v1/sites/${TEST_REPO_NAME}/media/images/${slugifyCategory(ALBUM_TITLE)}` }).as('createAlbum')

      cy.contains('Create new album').click()
      cy.get("[id='image album']").clear().type(ALBUM_TITLE)  

      cy.get('button').contains(/^Create$/).click() 

      // ASSERTS
      cy.wait('@createAlbum') // Should intercept POST request
      cy.contains(ALBUM_TITLE) // Album name should be contained in Images
    })

    it('Should be able to edit image album name', () => {
      const NEW_ALBUM_TITLE = 'America'
      
      // User should be able edit album details
      const testAlbumCard = cy.contains(ALBUM_TITLE)
      testAlbumCard.children().within(() => cy.get('[id^=settings-]').click())
      cy.get('div[id^=settings-]').first().click() // .first() is necessary because the get returns multiple elements (refer to MenuDropdown.jsx)
      cy.get('#newDirectoryName').clear().type(NEW_ALBUM_TITLE)
      cy.contains('button', 'Save').click()

      // ASSERTS
      cy.wait(3000)
      cy.contains(NEW_ALBUM_TITLE) // New image album name should be contained in Images

      // Rename album to original album title
      const newTestAlbumCard = cy.contains(NEW_ALBUM_TITLE)
      newTestAlbumCard.children().within(() => cy.get('[id^=settings-]').click())
      cy.get('div[id^=settings-]').first().click() // .first() is necessary because the get returns multiple elements (refer to MenuDropdown.jsx)
      cy.get('#newDirectoryName').clear().type(ALBUM_TITLE)
      cy.contains('button', 'Save').click()
      
      // ASSERTS
      cy.wait(3000)
      cy.contains(ALBUM_TITLE) // Original image album name should be contained in Images
    })

    it('Should be able to delete image album', () => {
      // Set intercept to listen for DELETE request on server
      cy.intercept({ method:'DELETE', url: `/v1/sites/${TEST_REPO_NAME}/media/images/${slugifyCategory(ALBUM_TITLE)}`}).as('deleteAlbum')

      // User should be able delete album 
      const testAlbumCard = cy.contains(ALBUM_TITLE)
      testAlbumCard.children().within(() => cy.get('[id^=settings-]').click())
      cy.get('div[id^=delete-]').first().click() // .first() is necessary because the get returns multiple elements (refer to MenuDropdown.jsx)
      cy.contains('button', 'Delete').click()

      // ASSERTS
      cy.wait('@deleteAlbum') // Should intercept POST request
      cy.contains(ALBUM_TITLE).should('not.exist') // Album name should not be contained in Images
    })
  })

  describe('Nested Images flow', () => {
    
    const EXISTING_ALBUM_TITLE = 'test' // Should be existing repo since we don't want the tests to fail in cascade 
    
    beforeEach(() => {
      cy.visit(`${CMS_BASEURL}/sites/${TEST_REPO_NAME}/images/${EXISTING_ALBUM_TITLE}`)
    })

    it('Should be able to add image to image album', () => {
      // Set intercept to listen for POST request on server
      cy.intercept({ method:'POST', url: `/v1/sites/${TEST_REPO_NAME}/images` }).as('createImage')

      cy.uploadImage(IMAGE_TITLE, TEST_IMAGE_PATH)
      // ASSERTS
      cy.wait('@createImage') // should intercept POST request
      cy.contains(IMAGE_TITLE) // image should be contained in Images
    })

    it('Should be able to edit an image in image album', () => {
      const NEW_IMAGE_TITLE = 'america.jpg'
      
      cy.renameImage(IMAGE_TITLE, NEW_IMAGE_TITLE)
      // ASSERTS
      cy.contains(NEW_IMAGE_TITLE) // Image should be contained in Images

      cy.renameImage(NEW_IMAGE_TITLE, IMAGE_TITLE) // Rename image to original title 
      // ASSERTS
      cy.contains(IMAGE_TITLE)
    })

    it('Should be able to delete image from image album', () => {
      // Set intercept to listen for POST request on server
      cy.intercept({ method:'DELETE', url: `/v1/sites/${TEST_REPO_NAME}/images/${generateImageorFilePath(EXISTING_ALBUM_TITLE, IMAGE_TITLE)}` }).as('deleteImage')

      cy.deleteImage(IMAGE_TITLE)
      // ASSERTS
      cy.wait('@deleteImage') // Should intercept DELETE request
      cy.contains(IMAGE_TITLE).should('not.exist') //Image file name should not exist in Images
    })
  })
})