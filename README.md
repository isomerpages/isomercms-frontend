## IsomerCMS Frontend

This repo contains the source code for the IsomerCMS frontend.

### How it works

The frontend is built using React and hosted on Netlify. The frontend interacts with the IsomerCMS backend server, which in turn calls GitHub APIs to modify code in the users' Isomer website repo.

### How to develop

```
source .env
npm install
npm run start
```

### Running end-to-end tests using Cypress

Add the following Cypress environment variables:

- CYPRESS_BASEURL (CMS frontend baseurl of the environment you want to test)
- CYPRESS_COOKIE_NAME (Name of the JWT cookie that the CMS frontend sends to the backend)
- CYPRESS_COOKIE_VALUE (Value of the JWT cookie)
- CYPRESS_TEST_REPO_NAME (Name of the test repo on GitHub)

Add the following environment variables which we use to reset our test repo:

- E2E_COMMIT_HASH (the commit hash which you would like to reset the `e2e-test-repo` to)
- PERSONAL_ACCESS_TOKEN (your GitHub personal access token)
- USERNAME (your GitHub username)

Run the following:

```
source .env
npm run test-e2e
```

If you would like the Cypress UI, run

```
npm run cypress:open
```
