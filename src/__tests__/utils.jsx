import Policy from "csp-parse"
import { format } from "date-fns-tz"

import checkCSP from "../utils/cspUtils"

const { getDefaultFrontMatter } = require("../utils")

describe("Utils test", () => {
  describe("getDefaultFrontMatter should return the correct parameters", () => {
    const exampleTitle = "Example Title"
    const collectionName = "collection"
    const subCollectionName = "subcollection"
    const resourceRoomName = "resourceRoom"
    const resourceCategoryName = "resourceCategory"
    const exampleDate = format(Date.now(), "yyyy-MM-dd")
    const exampleLayout = "post"

    it("returns the proper parameters for unlinked pages", async () => {
      const params = {}
      const examplePermalink = "/permalink"

      expect(getDefaultFrontMatter(params, [])).toMatchObject({
        title: exampleTitle,
        permalink: examplePermalink,
      })
    })

    it("returns the proper parameters for unlinked pages with an existing title", async () => {
      const params = {}
      const examplePermalink = "/permalink"
      const existingTitles = [`${exampleTitle}.md`, `${exampleTitle} 1.md`]

      expect(getDefaultFrontMatter(params, existingTitles)).toMatchObject({
        title: `${exampleTitle} 1 1`,
        permalink: examplePermalink,
      })
    })

    it("returns the proper parameters for collection pages", async () => {
      const params = {
        collectionName,
      }
      const examplePermalink = `/${collectionName}/permalink`

      expect(getDefaultFrontMatter(params, [])).toMatchObject({
        title: exampleTitle,
        permalink: examplePermalink,
      })
    })

    it("returns the proper parameters for subcollection pages", async () => {
      const params = {
        collectionName,
        subCollectionName,
      }
      const examplePermalink = `/${collectionName}/${subCollectionName}/permalink`

      expect(getDefaultFrontMatter(params, [])).toMatchObject({
        title: exampleTitle,
        permalink: examplePermalink,
      })
    })

    it("returns the proper parameters for resource pages", async () => {
      const params = {
        resourceRoomName,
        resourceCategoryName,
      }
      const examplePermalink = `/${resourceRoomName}/${resourceCategoryName}/permalink`

      expect(getDefaultFrontMatter(params, [])).toMatchObject({
        title: exampleTitle,
        permalink: examplePermalink,
        date: exampleDate,
        layout: exampleLayout,
      })
    })

    it("returns the proper parameters for resource pages if example title already used", async () => {
      const params = {
        resourceRoomName,
        resourceCategoryName,
      }
      const exampleResourceTitle = `${exampleDate}-${exampleLayout}-${exampleTitle}`
      const examplePermalink = `/${resourceRoomName}/${resourceCategoryName}/permalink`

      expect(
        getDefaultFrontMatter(params, [
          `${exampleResourceTitle}.md`,
          `${exampleResourceTitle} 1.md`,
        ])
      ).toMatchObject({
        title: `${exampleTitle} 1 1`,
        permalink: examplePermalink,
        date: exampleDate,
        layout: exampleLayout,
      })
    })
  })

  describe("checkCSP should return the correct decision", () => {
    const cspPolicy = new Policy(
      "default-src 'self'; script-src 'self' blob: https://www.instagram.com; object-src 'self'; style-src 'self' 'unsafe-inline'; img-src *; media-src *; frame-src https://form.gov.sg/; frame-ancestors 'none'; font-src * data:; connect-src 'self';"
    )

    it("should not be a CSP violation if the script source is safe", async () => {
      const exampleContentWithHttpsScript = `<script src="https://www.instagram.com/embed.js" async></script>`
      const exampleContentWithProtocolRelativeScript = `<script src="//www.instagram.com/embed.js" async></script>`

      expect(checkCSP(cspPolicy, exampleContentWithHttpsScript)).toHaveProperty(
        "isCspViolation",
        false
      )
      expect(
        checkCSP(cspPolicy, exampleContentWithProtocolRelativeScript)
      ).toHaveProperty("isCspViolation", false)
    })

    it("should be a CSP violation if the script source is not safe", async () => {
      const exampleContentWithHttpScript = `<script src="http://www.instagram.com/embed.js" async></script>`
      const exampleContentWithNonTrustedScript = `<script src="https://www.example.com/evil.js"></script>`
      const exampleContentWithDataScript = `<script src="data:text/javascript;base64,ZXhwbG9yZQ==" async></script>`

      expect(checkCSP(cspPolicy, exampleContentWithHttpScript)).toHaveProperty(
        "isCspViolation",
        true
      )
      expect(
        checkCSP(cspPolicy, exampleContentWithNonTrustedScript)
      ).toHaveProperty("isCspViolation", true)
      expect(checkCSP(cspPolicy, exampleContentWithDataScript)).toHaveProperty(
        "isCspViolation",
        true
      )
    })
  })
})
