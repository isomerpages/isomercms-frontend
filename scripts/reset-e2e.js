const { spawn } = require("child_process")
const path = require("path")

const axios = require("axios")
const btoa = require("btoa")
const cypress = require("cypress")

// login credentials
const { PERSONAL_ACCESS_TOKEN, USERNAME } = process.env

const CREDENTIALS = `${USERNAME}:${PERSONAL_ACCESS_TOKEN}`
const headers = {
  authorization: `basic ${btoa(CREDENTIALS)}`,
  accept: "application/json",
}

// cypress commands
const cypressCommand = process.argv[2] // either `run` or `open`
const srcPath = path.resolve(__dirname, "..")
const envFilePath = `${srcPath}/.env`
const runCypressCommand = `source ${envFilePath} && npx cypress ${cypressCommand}`
// NOTE: This is not prefixed with source because the env vars should be set in the hosting platform
const buildCommand = "npm run build"

// reset e2e-test-repo
const { E2E_COMMIT_HASH } = process.env
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
}

// resets the e2e repo then runs the corresponding cypress command
const runE2eTests = async () =>
  resetE2eTestRepo()
    .then(() => {
      console.log(`Successfully reset e2e-test-repo to ${E2E_COMMIT_HASH}`)

      const child = spawn(runCypressCommand, { shell: true })
      child.stderr.on("data", (data) => {
        console.error(data.toString().trim())
      })
      child.stdout.on("data", (data) => {
        console.log(data.toString().trim())
      })
      child.on("exit", (exitCode) => {
        console.log(`Child exited with code: ${exitCode}`)
      })
    })
    .catch((err) => console.error(err))

const runCi = async () =>
  resetE2eTestRepo()
    .then(() => {
      console.log(`Successfully reset e2e-test-repo to ${E2E_COMMIT_HASH}`)

      const child = spawn(buildCommand, { shell: true })
      child.stderr.on("data", (data) => {
        console.error(data.toString().trim())
      })
      child.stdout.on("data", (data) => {
        console.log(data.toString().trim())
      })
      child.on("exit", (exitCode) => {
        console.log(`Child exited with code: ${exitCode}`)
      })
    })
    .catch((err) => console.error(err))

module.exports = {
  runE2eTests,
  resetE2eTestRepo,
  runCi,
}
