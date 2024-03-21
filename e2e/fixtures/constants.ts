export const {
  CYPRESS_TEST_REPO_NAME: TEST_REPO_NAME,
  CYPRESS_CMS_BASEURL: CMS_BASEURL,
  CYPRESS_BACKEND_URL: BACKEND_URL,
  CYPRESS_COOKIE_NAME: COOKIE_NAME,
  CYPRESS_COOKIE_VALUE: COOKIE_VALUE,
} = process.env as Record<string, string>

export const E2E_USER = {
  userId: "test",
  email: "test@open.gov.sg",
  contactNumber: "99999999",
}

export const E2E_EMAIL_ADMIN = {
  email: "admin@e2e.gov.sg",
} as const

export const E2E_EMAIL_ADMIN_2 = {
  email: "twodmin@e2e.gov.sg",
} as const

export const E2E_EMAIL_COLLAB = {
  email: "collab@e2e.gov.sg",
} as const

export const E2E_EMAIL_COLLAB_NON_GOV = {
  email: "collab@e2etest.com",
} as const

export const E2E_EMAIL_TEST_SITE = {
  name: "e2e email test site",
  repo: "e2e-email-test-repo",
}

export const E2E_COOKIE = {
  Auth: {
    key: COOKIE_NAME,
    value: COOKIE_VALUE,
  },
  Site: { key: "site", value: E2E_EMAIL_TEST_SITE.name },
  EmailUserType: { key: "e2eUserType" },
  Email: { key: "email" },
}

export const E2E_USER_TYPE_COOKIE_KEY = "e2eUserType"
export const E2E_SITE_KEY = "site"
export const LOCAL_STORAGE_USERID_KEY = "userId"
export const LOCAL_STORAGE_USER_KEY = "user"
export const TEST_PRIMARY_COLOR = [255, 0, 0]

export const BASE_SEO_LINK = "www.open.gov.sg"

export const E2E_EMAIL_REPO_STAGING_LINK =
  "https://staging.d2qim5mov3pptm.amplifyapp.com"

export const E2E_EMAIL_REPO_MASTER_LINK =
  "https://master.d2qim5mov3pptm.amplifyapp.com"

export const ISOMER_GUIDE_LINK = "https://guide.isomer.gov.sg/"

export const MOCK_REVIEW_TITLE = "Some interesting title"
export const MOCK_REVIEW_DESCRIPTION = "Some interesting description"

export const FORBIDDEN_CHARACTERS = "!@#$%^&*()"
export const NON_ENGLISH_CHARACTERS = "文கி"

export const timings = {
  outOfTheWay: 0.2,
  // greater than the out of the way time
  // so that when the drop ends everything will
  // have to be out of the way
  minDropTime: 0.33,
  maxDropTime: 0.55,
}

export const keyCodes = {
  space: 32,
  arrowDown: 40,
}
