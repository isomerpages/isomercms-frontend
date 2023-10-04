/* eslint-disable no-console */
const { spawn } = require("child_process")

const axios = require("axios")

// Login credentials
const {
  CYPRESS_COOKIE_NAME,
  CYPRESS_COOKIE_VALUE,
  CYPRESS_BACKEND_URL,
} = process.env
if (!CYPRESS_COOKIE_NAME || !CYPRESS_COOKIE_VALUE) {
  throw new Error(
    `E2E tests require env vars CYPRESS_COOKIE_NAME and CYPRESS_COOKIE_VALUE to be set.`
  )
}

const emailHeaders = {
  Cookie: `${CYPRESS_COOKIE_NAME}=${CYPRESS_COOKIE_VALUE}; e2eUserType=Email admin; site=e2e email test site; email=admin@e2e.gov.sg`,
}

const githubHeaders = {
  Cookie: `${CYPRESS_COOKIE_NAME}=${CYPRESS_COOKIE_VALUE}; e2eUserType=Github user`,
}

// Cypress test runner
const cypressCommand = process.argv[2] // either `run` or `open`
const baseCypressCommand = `npx cypress ${cypressCommand}`
// if we are running tests, record them on the dashboard so that github will show the corresponding status
const runCypressCommand =
  cypressCommand === "run"
    ? `${baseCypressCommand} --record`
    : baseCypressCommand

// E2E test repositories
const e2eTestRepositoriesWithHashes = {
  "e2e-test-repo": "bcfe46da1288b3302c5bb5f72c5c58b50574f26c",
  "e2e-email-test-repo": "93593ceb8ee8af690267e49ea787701fc73baed8",
  "e2e-notggs-test-repo": "1ccc5253dd06e06a088d1e6ec86a38c870c0a3d6",
}

// Reset test repositories
const resetRepository = async (repository, branchName, userType) => {
  const endpoint = `${CYPRESS_BACKEND_URL}/sites/${repository}/admin/resetRepo`
  const headers = userType === "github" ? githubHeaders : emailHeaders
  await axios.post(
    endpoint,
    {
      commitSha: e2eTestRepositoriesWithHashes[repository],
      branchName,
    },
    { headers },
    { withCredentials: true }
  )
  console.log(
    `Successfully reset ${repository} (${branchName}) to ${e2eTestRepositoriesWithHashes[repository]}}`
  )
}

const resetE2ETestRepositories = async () => {
  resetRepository("e2e-test-repo", "staging", "github")
  resetRepository("e2e-notggs-test-repo", "staging", "github")
  resetRepository("e2e-email-test-repo", "staging", "email")
  resetRepository("e2e-email-test-repo", "master", "email")
}

const runE2ETests = async () => {
  resetE2ETestRepositories()
    .then(() => {
      const child = spawn(runCypressCommand, { shell: true })
      child.stderr.on("data", (data) => {
        console.error(data.toString().trim())
      })
      child.stdout.on("data", (data) => {
        console.log(data.toString().trim())
      })
      child.on("exit", (exitCode) => {
        console.log(`Child exited with code: ${exitCode}`)
        // NOTE: Cypress uses the exit code to show the number of failed tests.
        // If we do not exit here, the child process (that's running the test) will not be able to feedback
        // to Github Actions if the tests pass.
        // If exitCode is null, means that the child process was killed by a signal.
        process.exit(exitCode || 1)
      })
    })
    .catch((err) => {
      console.error(err)
      // NOTE: If we encounter an error at any step, we should exit with a failure code.
      // This also prevents CI from recording this as a successful step.
      process.exit(1)
    })
}

module.exports = {
  runE2ETests,
  resetE2ETestRepositories,
}
