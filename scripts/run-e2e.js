const axios = require("axios")
const btoa = require("btoa")
const { spawn } = require("child_process")
const cypress = require("cypress")
const path = require("path")

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

// reset e2e-test-repo
const { E2E_COMMIT_HASH } = process.env
const GITHUB_ORG_NAME = "isomerpages"
const REPO_NAME = "e2e-test-repo"

const resetE2eTestRepo = async () => {
  const baseRefEndpoint = `https://api.github.com/repos/${GITHUB_ORG_NAME}/${REPO_NAME}/git/refs`
  const refEndpoint = `${baseRefEndpoint}/heads/staging`
  await axios
    .patch(
      refEndpoint,
      {
        sha: E2E_COMMIT_HASH,
        force: true,
      },
      {
        headers,
      }
    )
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
}

resetE2eTestRepo()
