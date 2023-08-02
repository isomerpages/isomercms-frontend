import {
  addAdmin,
  approveReviewRequest,
  closeReviewRequest,
  closeReviewRequests,
  createReviewRequest,
  mergeReviewRequest,
} from "../api"
import {
  addUnlinkedPage,
  deleteUnlinkedPage,
  editUnlinkedPage,
  listCollectionPages,
  listUnlinkedPages,
  moveUnlinkedPage,
  deleteCollectionPage,
  renameUnlinkedPage,
} from "../api/pages.api"
import {
  E2E_EMAIL_ADMIN,
  E2E_EMAIL_COLLAB_NON_GOV,
  E2E_EMAIL_ADMIN_2,
  E2E_EMAIL_TEST_SITE,
  MOCK_REVIEW_DESCRIPTION,
  MOCK_REVIEW_TITLE,
} from "../fixtures/constants"
import {
  addAdminCollaborator,
  addCollaborator,
  removeFirstCollaborator,
  visitE2eEmailTestRepo,
} from "../utils"

const getReviewRequestButton = () => cy.contains("button", "Request a Review")
const getSubmitReviewButton = () => cy.contains("button", "Submit Review")
const getViewReviewRequestButton = () => cy.contains("p", "changed file")
const getReviewRequestOverviewPageEditButton = (itemName: string) =>
  cy
    .contains(itemName)
    .parent()
    .parent()
    .parent()
    .find('[aria-label="edit file"]')
const getPublishButton = () => cy.contains("button", "Publish now")
const openReviewRequestStateDropdown = (currentState: string) =>
  cy.contains("button", currentState).next().click()

const selectReviewer = (email: string) => {
  cy.get("div[id^='react-select']").contains(email).click()
}
const removeReviewers = () => cy.get('div[aria-label^="Remove"]').click()

const TITLE_INPUT_SELECTOR =
  "input[placeholder='Title your request'][name='title']"
const DESCRIPTION_TEXTAREA_SELECTOR =
  "textarea[name='description'][placeholder='Briefly describe the changes you’ve made, and add a review deadline (if applicable)']"

const getAddReviewerDropdown = () =>
  cy.contains("Select Admins to add as reviewers").parent()

const REVIEW_MODAL_SUBTITLE =
  "An Admin needs to review and approve your changes before they can be published"

describe("Review Requests", () => {
  before(() => {
    cy.setupDefaultInterceptors()
    cy.setEmailSessionDefaults("Email admin")
    closeReviewRequests()
    // Defensive edit - ensures that we have at least one edit to create a review request
    editUnlinkedPage(
      "faq.md",
      "some original content",
      E2E_EMAIL_TEST_SITE.repo
    )
    // Reset to no changes in the repo
    addAdmin(E2E_EMAIL_COLLAB_NON_GOV.email)
    createReviewRequest(
      MOCK_REVIEW_TITLE,
      [E2E_EMAIL_COLLAB_NON_GOV.email],
      MOCK_REVIEW_DESCRIPTION
    ).then((id) => {
      cy.actAsEmailUser(E2E_EMAIL_COLLAB_NON_GOV.email, "Email admin")
      approveReviewRequest(id)
      cy.actAsEmailUser(E2E_EMAIL_ADMIN.email, "Email admin")
      mergeReviewRequest(id)
    })
  })
  beforeEach(() => {
    cy.setupDefaultInterceptors()
    cy.setEmailSessionDefaults("Email admin")
    visitE2eEmailTestRepo()
  })
  describe("create review request", () => {
    beforeEach(() => {
      // NOTE: We want to start this test suite on a clean slate
      // and prevent other tests from interfering
      cy.setupDefaultInterceptors()
      cy.setEmailSessionDefaults("Email admin")
      visitE2eEmailTestRepo()
      removeFirstCollaborator()
      removeFirstCollaborator()
      removeFirstCollaborator()
    })

    it("should not be able to create a review request when there are no changes", () => {
      // Arrange
      addAdminCollaborator(E2E_EMAIL_ADMIN_2.email)

      // Act
      getReviewRequestButton().click()
      cy.contains(REVIEW_MODAL_SUBTITLE).should("be.visible")
      cy.get(TITLE_INPUT_SELECTOR).type(MOCK_REVIEW_TITLE)
      getAddReviewerDropdown().click()
      selectReviewer(E2E_EMAIL_ADMIN_2.email)

      // Assert
      getSubmitReviewButton().should("be.disabled")
    })
    it("should not be able to create a review request when the site has 1 collaborator", () => {
      // Arrange
      getReviewRequestButton().click()
      cy.contains(REVIEW_MODAL_SUBTITLE).should("be.visible")

      // Act
      getAddReviewerDropdown().click()

      // Assert
      cy.contains("No options").should("be.visible")
    })
    it("should not be able to create a review request without a reviewer", () => {
      // Arrange
      addCollaborator(E2E_EMAIL_COLLAB_NON_GOV.email)

      // Act
      // NOTE: There should be at least 1 other admin to be able to create a review request
      getReviewRequestButton().click()
      cy.contains(REVIEW_MODAL_SUBTITLE).should("be.visible")

      // Assert
      getAddReviewerDropdown().click()
      cy.contains("No options").should("be.visible")
    })
    it("should be able to create a review request successfully", () => {
      // Arrange
      addAdmin(E2E_EMAIL_ADMIN_2.email)
      editUnlinkedPage(
        "faq.md",
        "some review request success content",
        E2E_EMAIL_TEST_SITE.repo
      )

      // Act
      getReviewRequestButton().click()
      cy.contains(REVIEW_MODAL_SUBTITLE).should("be.visible")
      cy.get(TITLE_INPUT_SELECTOR).type(MOCK_REVIEW_TITLE)
      // NOTE: should not allow submitting of review prior to selecting reviewer
      getSubmitReviewButton().should("be.disabled")
      getAddReviewerDropdown().click()
      // select reviewer and click
      selectReviewer(E2E_EMAIL_ADMIN_2.email)
      removeReviewers()
      getSubmitReviewButton().should("be.disabled")
      // add back reviewer
      getAddReviewerDropdown().click()
      selectReviewer(E2E_EMAIL_ADMIN_2.email)
      cy.get(DESCRIPTION_TEXTAREA_SELECTOR).type(MOCK_REVIEW_DESCRIPTION)

      // Assert
      getSubmitReviewButton().click()
      cy.contains("Review request submitted").should("be.visible")
    })
  })
  describe("has pending review requests", () => {
    before(() => {
      cy.setupDefaultInterceptors()
      cy.setEmailSessionDefaults("Email admin")
      addAdmin(E2E_EMAIL_ADMIN_2.email)
      editUnlinkedPage(
        "faq.md",
        "some pending review requests content",
        E2E_EMAIL_TEST_SITE.repo
      )
    })
    beforeEach(() => {
      // NOTE: We want to start this test suite on a clean slate
      // and prevent other tests from interfering
      cy.setupDefaultInterceptors()
      cy.setEmailSessionDefaults("Email admin")
      visitE2eEmailTestRepo()
      closeReviewRequests()
    })
    it('should show the review request on the workspace with the tag "Pending review"', () => {
      // Arrange
      const RR_INTERCEPTOR = "getReviewRequest"
      cy.intercept("GET", "**/summary").as(RR_INTERCEPTOR)
      cy.actAsEmailUser(E2E_EMAIL_ADMIN_2.email, "Email admin")
      createReviewRequest(MOCK_REVIEW_TITLE, [E2E_EMAIL_ADMIN.email])
      cy.actAsEmailUser(E2E_EMAIL_ADMIN.email, "Email admin")
      visitE2eEmailTestRepo()
      // Act
      cy.contains("Review required").should("be.visible")
      cy.visit(`/sites/${E2E_EMAIL_TEST_SITE.repo}/workspace`)
      cy.wait(`@${RR_INTERCEPTOR}`)

      // Assert
      cy.contains("Review request pending approval").should("be.visible")
    })
    it("should prevent the requestor from approving their own review request", () => {
      // Arrange
      createReviewRequest(
        MOCK_REVIEW_TITLE,
        [E2E_EMAIL_ADMIN_2.email],
        MOCK_REVIEW_DESCRIPTION
      )
      visitE2eEmailTestRepo()

      // Act
      cy.contains("Review required").should("not.exist")
      getViewReviewRequestButton().click()
      openReviewRequestStateDropdown("In review")

      // Assert
      cy.contains("Approved").should("not.exist")
    })
    it("should be able to have the request approved as a collaborator", () => {
      // Arrange
      cy.actAsEmailUser(E2E_EMAIL_COLLAB_NON_GOV.email, "Email collaborator")
      cy.setEmailSessionDefaults("Email collaborator")
      createReviewRequest(
        MOCK_REVIEW_TITLE,
        [E2E_EMAIL_ADMIN.email],
        MOCK_REVIEW_DESCRIPTION
      )
      cy.actAsEmailUser(E2E_EMAIL_ADMIN.email, "Email admin")
      cy.setEmailSessionDefaults("Email admin")
      visitE2eEmailTestRepo()
      // Act
      getViewReviewRequestButton().click()
      openReviewRequestStateDropdown("In review")

      // Assert
      cy.contains("Approved").should("exist")
      cy.contains("Approved").click()
      cy.contains("This Review request has been approved!").should("exist")
    })
    it.skip("should have changes reflected in the currently open review request", () => {
      // Note: we're currently skipping this test because it's incredibly flaky to get a consistent state
      // This issue seems to stem from the github side - some actions seem to be failing when taken too close to others
      // e.g. Adding a file soon after deleting it throws a 409 error from github
      // Arrange
      const RR_OVERVIEW_INTERCEPTOR = "getReviewRequest"
      const regex = /\/review\/\d+\//
      cy.intercept("GET", regex).as(RR_OVERVIEW_INTERCEPTOR)
      const TEST_PAGE_ADD = "page add"
      const TEST_PAGE_EDIT = "page edit"
      const TEST_PAGE_DELETE = "page delete"
      const TEST_PAGE_RENAME = "page rename"
      const TEST_PAGE_MOVE = "page move"
      const TARGET_COLLECTION = "example-folder"
      listUnlinkedPages(E2E_EMAIL_TEST_SITE.repo).then((pages) => {
        // eslint-disable-next-line no-restricted-syntax
        for (const page of pages) {
          // Needs to be done sequentially to prevent mutex locks
          switch (page.name) {
            case `${TEST_PAGE_ADD}.md`:
              deleteUnlinkedPage(
                `${TEST_PAGE_ADD}.md`,
                E2E_EMAIL_TEST_SITE.repo
              )
              break
            case `${TEST_PAGE_EDIT}.md`:
              deleteUnlinkedPage(
                `${TEST_PAGE_EDIT}.md`,
                E2E_EMAIL_TEST_SITE.repo
              )
              break
            case `${TEST_PAGE_DELETE}.md`:
              deleteUnlinkedPage(
                `${TEST_PAGE_DELETE}.md`,
                E2E_EMAIL_TEST_SITE.repo
              )
              break
            case `${TEST_PAGE_RENAME}.md`:
              deleteUnlinkedPage(
                `${TEST_PAGE_RENAME}.md`,
                E2E_EMAIL_TEST_SITE.repo
              )
              break
            case `${TEST_PAGE_MOVE}.md`:
              deleteUnlinkedPage(
                `${TEST_PAGE_MOVE}.md`,
                E2E_EMAIL_TEST_SITE.repo
              )
              break
            default:
              break
          }
        }
      })
      listCollectionPages(E2E_EMAIL_TEST_SITE.repo, TARGET_COLLECTION).then(
        (pages) => {
          // eslint-disable-next-line no-restricted-syntax
          for (const page of pages) {
            // Needs to be done sequentially to prevent mutex locks
            switch (page.name) {
              case `${TEST_PAGE_MOVE}.md`:
                deleteCollectionPage(
                  `${TEST_PAGE_MOVE}.md`,
                  TARGET_COLLECTION,
                  E2E_EMAIL_TEST_SITE.repo
                )
                break
              default:
                break
            }
          }
        }
      )
      // Wait for github to update and clear local storage - attempting to create a recently deleted file will return a 409 error on github's end
      cy.wait(60000)

      addUnlinkedPage(
        `${TEST_PAGE_EDIT}.md`,
        TEST_PAGE_EDIT,
        "/permalink",
        "blahblah",
        E2E_EMAIL_TEST_SITE.repo
      )
      addUnlinkedPage(
        `${TEST_PAGE_DELETE}.md`,
        TEST_PAGE_DELETE,
        "/definitely a different permalink",
        "this is a different page from the add for realsies",
        E2E_EMAIL_TEST_SITE.repo
      )
      addUnlinkedPage(
        `${TEST_PAGE_RENAME}.md`,
        TEST_PAGE_RENAME,
        "/permalink",
        "blahblah",
        E2E_EMAIL_TEST_SITE.repo
      )
      addUnlinkedPage(
        `${TEST_PAGE_MOVE}.md`,
        TEST_PAGE_MOVE,
        "/permalink",
        "blahblah",
        E2E_EMAIL_TEST_SITE.repo
      )
      createReviewRequest(
        MOCK_REVIEW_TITLE,
        [E2E_EMAIL_ADMIN_2.email],
        MOCK_REVIEW_DESCRIPTION
      ).then((id) => {
        cy.actAsEmailUser(E2E_EMAIL_ADMIN_2.email, "Email admin")
        approveReviewRequest(id)
        cy.actAsEmailUser(E2E_EMAIL_ADMIN.email, "Email admin")
        mergeReviewRequest(id)
      })
      // Wait for github to update
      cy.wait(60000)
      // TODO: If this is hard, maybe we can just do delete + add content + have new page
      // NOTE: We define changes as being
      // 1. Adding a new page
      // 2. Editing an existing page
      // 3. Deleting an existing page
      // 4. Rename an existing page
      // 5. Moving an existing page

      addUnlinkedPage(
        `${TEST_PAGE_ADD}.md`,
        TEST_PAGE_ADD,
        "/permalink",
        "blahblahblah",
        E2E_EMAIL_TEST_SITE.repo
      )
      editUnlinkedPage(
        `${TEST_PAGE_EDIT}.md`,
        "some asdfasdfasdf content",
        E2E_EMAIL_TEST_SITE.repo
      )
      moveUnlinkedPage(
        `${TEST_PAGE_MOVE}.md`,
        "example-folder",
        E2E_EMAIL_TEST_SITE.repo
      )
      deleteUnlinkedPage(`${TEST_PAGE_DELETE}.md`, E2E_EMAIL_TEST_SITE.repo)
      renameUnlinkedPage(
        `${TEST_PAGE_RENAME}.md`,
        `new ${TEST_PAGE_RENAME}.md`,
        E2E_EMAIL_TEST_SITE.repo
      )
      createReviewRequest(
        MOCK_REVIEW_TITLE,
        [E2E_EMAIL_ADMIN_2.email],
        MOCK_REVIEW_DESCRIPTION
      )
      visitE2eEmailTestRepo()

      // Act
      getViewReviewRequestButton().click()
      cy.wait(`@${RR_OVERVIEW_INTERCEPTOR}`)

      // Assert
      cy.contains(`${TEST_PAGE_ADD}.md`).should("exist")
      getReviewRequestOverviewPageEditButton(`${TEST_PAGE_ADD}.md`).should(
        "not.be.disabled"
      )
      cy.contains(`${TEST_PAGE_EDIT}.md`).should("exist")
      getReviewRequestOverviewPageEditButton(`${TEST_PAGE_EDIT}.md`).should(
        "not.be.disabled"
      )
      cy.contains(`${TEST_PAGE_MOVE}.md`).should("exist")
      getReviewRequestOverviewPageEditButton(`${TEST_PAGE_MOVE}.md`).should(
        "not.be.disabled"
      )
      cy.contains(`${TEST_PAGE_MOVE}.md`)
        .parent()
        .contains(TARGET_COLLECTION)
        .should("exist")
      cy.contains(`${TEST_PAGE_DELETE}.md`).should("exist")
      getReviewRequestOverviewPageEditButton(`${TEST_PAGE_DELETE}.md`).should(
        "be.disabled"
      )
      cy.contains(`new ${TEST_PAGE_RENAME}.md`).should("exist")
      getReviewRequestOverviewPageEditButton(
        `new ${TEST_PAGE_RENAME}.md`
      ).should("not.be.disabled")
    })
  })
  describe("has approved review requests", () => {
    before(() => {
      addAdmin(E2E_EMAIL_ADMIN_2.email)
      closeReviewRequests()
      cy.setEmailSessionDefaults("Email admin")
      cy.actAsEmailUser(E2E_EMAIL_ADMIN_2.email, "Email admin")
      editUnlinkedPage(
        "faq.md",
        "some approved review requests content",
        E2E_EMAIL_TEST_SITE.repo
      )
      createReviewRequest(
        MOCK_REVIEW_TITLE,
        [E2E_EMAIL_ADMIN.email],
        MOCK_REVIEW_DESCRIPTION
      ).then((id) => {
        cy.actAsEmailUser(E2E_EMAIL_ADMIN.email, "Email admin")
        approveReviewRequest(id)
      })
    })
    beforeEach(() => {
      // NOTE: We want to start this test suite on a clean slate
      // and prevent other tests from interfering
      cy.setupDefaultInterceptors()
      cy.setEmailSessionDefaults("Email admin")
      visitE2eEmailTestRepo()
    })
    it("should have the review request approved alert stating that editing is disabled when on the workspace", () => {
      // Arrange
      const RR_INTERCEPTOR = "getReviewRequest"
      cy.intercept("GET", "**/summary").as(RR_INTERCEPTOR)

      // Act
      cy.visit(`/sites/${E2E_EMAIL_TEST_SITE.repo}/workspace`)
      cy.wait(`@${RR_INTERCEPTOR}`)

      // Assert
      // Toast
      cy.contains("There is currently an approved review request!")
      // Redirect to dashboard
      cy.url().should("include", `/sites/${E2E_EMAIL_TEST_SITE.repo}/dashboard`)
      // Tag
      cy.contains("Approved")
    })
    it("should prevent edits while the request is not merged", () => {
      // Arrange

      // Act
      cy.visit(`/sites/${E2E_EMAIL_TEST_SITE.repo}/editPage/example-page.md`)

      // Assert
      // Redirect to dashboard
      cy.url().should("include", `/sites/${E2E_EMAIL_TEST_SITE.repo}/dashboard`)
      // Tag
      cy.contains("Approved")
    })
    it("should allow the requestor to merge the review request", () => {
      // Arrange
      const RR_INTERCEPTOR = "getReviewRequest"
      cy.intercept("GET", "**/summary").as(RR_INTERCEPTOR)
      const MERGE_INTERCEPTOR = "getReviewRequest"
      cy.intercept("POST", "**/merge").as(MERGE_INTERCEPTOR)
      visitE2eEmailTestRepo()

      // Act
      getViewReviewRequestButton().click()
      cy.wait(`@${RR_INTERCEPTOR}`)
      getPublishButton().click()
      cy.wait(`@${MERGE_INTERCEPTOR}`)

      // Assert
      cy.contains("Your changes have been published!").should("exist")
    })
    it("should allow the reviewer to merge the review request", () => {
      // Arrange
      const RR_INTERCEPTOR = "getReviewRequest"
      cy.intercept("GET", "**/summary").as(RR_INTERCEPTOR)
      const MERGE_INTERCEPTOR = "getReviewRequest"
      cy.intercept("POST", "**/merge").as(MERGE_INTERCEPTOR)
      closeReviewRequests()
      cy.setEmailSessionDefaults("Email admin")
      editUnlinkedPage(
        "faq.md",
        "some reviewer merge review request content",
        E2E_EMAIL_TEST_SITE.repo
      )
      createReviewRequest(
        MOCK_REVIEW_TITLE,
        [E2E_EMAIL_ADMIN_2.email],
        MOCK_REVIEW_DESCRIPTION
      ).then((id) => {
        cy.actAsEmailUser(E2E_EMAIL_ADMIN_2.email, "Email admin")
        approveReviewRequest(id)
      })
      cy.actAsEmailUser(E2E_EMAIL_ADMIN.email, "Email admin")
      visitE2eEmailTestRepo()

      // Act
      getViewReviewRequestButton().click()
      cy.wait(`@${RR_INTERCEPTOR}`)
      getPublishButton().click()
      cy.wait(`@${MERGE_INTERCEPTOR}`)

      // Assert
      cy.contains("Your changes have been published!").should("exist")
    })
  })
  describe("changing review request states", () => {
    before(() => {
      addAdmin(E2E_EMAIL_ADMIN_2.email)
      closeReviewRequests()
    })
    beforeEach(() => {
      // NOTE: We want to start this test suite on a clean slate
      // and prevent other tests from interfering
      cy.setupDefaultInterceptors()
      cy.setEmailSessionDefaults("Email admin")
      closeReviewRequests()
      visitE2eEmailTestRepo()
    })
    it("should allow the reviewer to unapprove the request", () => {
      // Arrange
      const RR_INTERCEPTOR = "getReviewRequest"
      cy.intercept("GET", "**/summary").as(RR_INTERCEPTOR)
      cy.setEmailSessionDefaults("Email admin")
      cy.actAsEmailUser(E2E_EMAIL_ADMIN_2.email, "Email admin")
      editUnlinkedPage(
        "faq.md",
        "some reviewer unapprove review request content",
        E2E_EMAIL_TEST_SITE.repo
      )
      createReviewRequest(
        MOCK_REVIEW_TITLE,
        [E2E_EMAIL_ADMIN.email],
        MOCK_REVIEW_DESCRIPTION
      ).then((id) => {
        cy.actAsEmailUser(E2E_EMAIL_ADMIN.email, "Email admin")
        approveReviewRequest(id)
      })
      visitE2eEmailTestRepo()

      // Act
      getViewReviewRequestButton().click()
      cy.wait(`@${RR_INTERCEPTOR}`)
      openReviewRequestStateDropdown("Approved")
      cy.contains("In review").should("exist")
      cy.contains("In review").click()
      // Wait for dropdown menu to disappear
      cy.wait(1000)

      // Assert
      cy.contains("button", "Approved").should("not.be.visible")
      cy.contains("button", "In review").should("be.visible")
    })
    it("should allow the requestor to close the review request", () => {
      // Arrange
      const RR_INTERCEPTOR = "getReviewRequest"
      cy.intercept("GET", "**/summary").as(RR_INTERCEPTOR)
      const RR_CANCEL_INTERCEPTOR = "getReviewRequest"
      // Matches any url like /review/{digits}, since we don't know the rr number until the test runs
      const regex = /\/review\/\d+\//
      cy.intercept("DELETE", regex).as(RR_INTERCEPTOR)
      cy.setEmailSessionDefaults("Email admin")
      cy.actAsEmailUser(E2E_EMAIL_ADMIN.email, "Email admin")
      editUnlinkedPage(
        "faq.md",
        "some requestor close review request content",
        E2E_EMAIL_TEST_SITE.repo
      )
      createReviewRequest(
        MOCK_REVIEW_TITLE,
        [E2E_EMAIL_ADMIN_2.email],
        MOCK_REVIEW_DESCRIPTION
      )
      visitE2eEmailTestRepo()

      // Act
      getViewReviewRequestButton().click()
      cy.wait(`@${RR_INTERCEPTOR}`)
      openReviewRequestStateDropdown("In review")
      cy.contains("Cancel request").should("exist")
      cy.contains("Cancel request").click()
      cy.contains("Yes, cancel").click()
      cy.wait(`@${RR_CANCEL_INTERCEPTOR}`)

      // Assert
      cy.url().should("include", "/dashboard")
      visitE2eEmailTestRepo()
      getReviewRequestButton().should("exist")
    })
    it("should disallow users from viewing a closed review request", () => {
      // Arrange
      const DASHBOARD_INTERCEPTOR = "getCollaboratorDetails"
      cy.intercept("GET", "**/collaborators").as(DASHBOARD_INTERCEPTOR)
      editUnlinkedPage(
        "faq.md",
        "some disallow view closed review request content",
        E2E_EMAIL_TEST_SITE.repo
      )
      createReviewRequest(
        MOCK_REVIEW_TITLE,
        [E2E_EMAIL_ADMIN_2.email],
        MOCK_REVIEW_DESCRIPTION
      ).then((id) => {
        closeReviewRequest(id)
        // Act
        cy.visit(`/sites/e2e-email-test-repo/review/${id}`)
        cy.wait(`@${DASHBOARD_INTERCEPTOR}`)
        // Redirect to dashboard
        cy.url().should(
          "include",
          `/sites/${E2E_EMAIL_TEST_SITE.repo}/dashboard`
        )

        // Assert
        cy.contains(
          "Please ensure that you have selected a valid review request."
        )
      })
    })
    it("should disallow users from viewing a merged review request", () => {
      // Arrange
      const DASHBOARD_INTERCEPTOR = "getCollaboratorDetails"
      cy.intercept("GET", "**/collaborators").as(DASHBOARD_INTERCEPTOR)
      editUnlinkedPage(
        "faq.md",
        "some disallow view merged review request content",
        E2E_EMAIL_TEST_SITE.repo
      )
      createReviewRequest(
        MOCK_REVIEW_TITLE,
        [E2E_EMAIL_ADMIN_2.email],
        MOCK_REVIEW_DESCRIPTION
      ).then((id) => {
        cy.actAsEmailUser(E2E_EMAIL_ADMIN_2.email, "Email admin")
        approveReviewRequest(id)
        cy.actAsEmailUser(E2E_EMAIL_ADMIN.email, "Email admin")
        mergeReviewRequest(id)

        // Act
        cy.visit(`/sites/e2e-email-test-repo/review/${id}`)
        // Redirect to dashboard
        cy.wait(`@${DASHBOARD_INTERCEPTOR}`)
        // Redirect to dashboard
        cy.url().should(
          "include",
          `/sites/${E2E_EMAIL_TEST_SITE.repo}/dashboard`
        )

        // Assert
        cy.contains(
          "Please ensure that you have selected a valid review request."
        )
      })
    })
  })
})
