### Pre-requisites

This document assumes that you have valid read-only access to the **production** database, in order to extract the data of the e2e test sites.

### Setup

#### Github e2e tests

In order to run the github e2e tests successfully, we need to perform the following one-off setup:

1. go to the backend folder (assuming that both FE + BE are in the same folder, you can `cd ../isomercms-backend`)
2. set `E2E_ISOMER_ID` to your desired value
3. ensure that the `E2E_TEST_GH_TOKEN` has sufficient permissions (try running any test)

#### Email e2e tests

In order to run the email e2e tests successfully, we need to perform the following one-off setup:

1. go to the **production** database (reader instance)
2. search for the `e2e email test site` in `sites`
3. copy the value over to your local db in `sites`
4. search for the `e2e-email-test-repo` in `repos`
5. copy the value over to your local db in `repos`

### Explanation

You can read more [here](https://www.notion.so/opengov/E2E-email-tests-e8d088d60fb3492686451999fe75d76b?pvs=4)

but a brief explanation is as follows:

For all e2e tests, we rely on the cookie secret to check if the user is indeed an e2e user.

For **Github** tests, we rely on the backend defined `E2E_ISOMER_ID` to check if the user is an e2e user, after the initial session data has been created (from extracted credentials on the cookie). As the `e2e-test-site` is not in our db, no further changes have to be made, and we just check on the path.

For **email** tests, we rely on the initial cookie credentials to create the user in our db and tie it back to the `e2e-email-test-site`. thereafter, we just check using the `site_members` table to see if the user has access credentials.
