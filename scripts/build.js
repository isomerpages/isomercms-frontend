/* eslint-disable no-console */
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
const E2E_GITHUB_REPO_NAME = "e2e-test-repo"
const E2E_EMAIL_REPO_NAME = "e2e-email-test-repo"
const E2E_EMAIL_COMMIT_HASH = "93593ceb8ee8af690267e49ea787701fc73baed8"

const resetRepo = async (repo, hash, branch) => {
  const endpoint = `https://api.github.com/repos/${GITHUB_ORG_NAME}/${repo}/git/refs/heads/${branch}`
  await axios.patch(
    endpoint,
    {
      sha: hash,
      force: true,
    },
    {
      headers,
    }
  )
  console.log(`Successfully reset ${repo} to ${hash}`)
}

const resetGithubE2eTestRepo = () =>
  resetRepo(E2E_GITHUB_REPO_NAME, E2E_COMMIT_HASH, "staging")

const resetEmailE2eTestRepo = () => {
  resetRepo(E2E_EMAIL_REPO_NAME, E2E_EMAIL_COMMIT_HASH, "staging")
  resetRepo(E2E_EMAIL_REPO_NAME, E2E_EMAIL_COMMIT_HASH, "master")
}

const resetE2eTestRepo = async () => {
  await resetGithubE2eTestRepo()
  await resetEmailE2eTestRepo()
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
