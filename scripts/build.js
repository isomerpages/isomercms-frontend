const { spawn } = require("child_process")

const axios = require("axios")
const btoa = require("btoa")

// login credentials
const { PERSONAL_ACCESS_TOKEN, USERNAME } = process.env
if (!PERSONAL_ACCESS_TOKEN || !USERNAME) {
  throw new Error(
    `E2E tests require env vars PERSONAL_ACCESS_TOKEN (${PERSONAL_ACCESS_TOKEN}) and USERNAME (${USERNAME}) to be set.`
  )
}

const CREDENTIALS = `${USERNAME}:${PERSONAL_ACCESS_TOKEN}`
const headers = {
  authorization: `basic ${btoa(CREDENTIALS)}`,
  accept: "application/json",
}

// cypress commands
const cypressCommand = process.argv[2] // either `run` or `open`
const baseCypressCommand = `npx cypress ${cypressCommand}`
// if we are running tests, record them on the dashboard so that github will show the corresponding status
const runCypressCommand =
  cypressCommand === "run"
    ? `${baseCypressCommand} --record`
    : baseCypressCommand

// reset e2e-test-repo
const { E2E_COMMIT_HASH } = process.env
if (!E2E_COMMIT_HASH) {
  throw new Error(
    `E2E tests require env var E2E_COMMIT_HASH (${E2E_COMMIT_HASH}) to be set.`
  )
}
const GITHUB_ORG_NAME = "isomerpages"
const REPO_NAME = "e2e-test-repo"

const resetE2eTestRepo = async () => {
  const baseRefEndpoint = `https://api.github.com/repos/${GITHUB_ORG_NAME}/${REPO_NAME}/git/refs`
  const refEndpoint = `${baseRefEndpoint}/heads/staging`
  await axios.patch(
    refEndpoint,
    {
      sha: E2E_COMMIT_HASH,
      force: true,
    },
    {
      headers,
    }
  )
  console.log(`Successfully reset e2e-test-repo to ${E2E_COMMIT_HASH}`)
}

// resets the e2e repo then runs the corresponding cypress command
const runE2eTests = async () =>
  resetE2eTestRepo()
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
        process.exit(exitCode)
      })
    })
    .catch((err) => {
      console.error(err)
      // NOTE: If we encounter an error at any step, we should exit with a failure code.
      // This also prevents CI from recording this as a successful step.
      process.exit(1)
    })

module.exports = {
  runE2eTests,
  resetE2eTestRepo,
}
