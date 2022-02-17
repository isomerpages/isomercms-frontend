import { format } from "date-fns-tz"

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
})
