// Fix flaky tests by waiting for DOM - taken from https://gist.github.com/xeger/8e37d241ea6c2210a8e0dcc857b4792e
import invariant from "invariant"

const isJQuery = (u) =>
  u &&
  typeof u === "object" &&
  typeof u.length === "number" &&
  typeof u.get === "function"

export default function waitForDom(subject = null, options = {}) {
  const {
    delay = 100,
    period = 500,
    timeout = Cypress.config("defaultCommandTimeout"),
  } = options

  const consoleProps = {
    Command: "waitForDom",
    "Applied to": undefined,
    Elapsed: 0,
    Quiesced: false,
    Options: options,
  }
  const log = Cypress.log({
    message: options,
    timeout,
    consoleProps: () => {
      return consoleProps
    },
  })

  return cy.window({ log: false }).then({ timeout }, (win) => {
    let observable
    if (isJQuery(subject)) {
      invariant(
        subject.length === 1,
        `must pass nothing or exactly 1 element (received ${subject.length})`
      )
      observable = subject?.get(0)
    } else {
      observable = win.document.body
    }
    consoleProps["Applied to"] = observable

    return new Cypress.Promise((resolve) => {
      const iMax = Math.floor(timeout / delay)
      const iStableMin = Math.ceil(period / delay - 1)

      let nMutations = 0
      const observer = new win.MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          // disregard changes to `class` attribute; care about everything else.
          if (
            mutation.type === "attributes" &&
            mutation.attributeName !== "class"
          ) {
            nMutations += 1
          } else if (mutation.type !== "attributes") {
            nMutations += 1
          }
        })
      })
      const observerConfig = {
        attributes: true,
        childList: true,
        subtree: true,
      }
      observer.observe(observable, observerConfig)

      let i = 0
      let iStable = 0
      const timer = setInterval(() => {
        consoleProps.Elapsed += delay
        i += 1
        iStable = nMutations === 0 ? iStable + 1 : 0
        nMutations = 0
        if (iStable >= iStableMin || i >= iMax) {
          clearInterval(timer)
          observer.disconnect()
          consoleProps.Quiesced = i <= iMax
          log.set({ $el: Cypress.$(observable) })
          resolve(subject)
        }
      }, delay)
    })
  })
}
