import { DirectoryData } from "types/directory"

export const MOCK_PAGES_DATA = [
  {
    name: "some page",
  },
  {
    name: "another page",
  },
  {
    name:
      "some page with an extremely long name that cannot fit inside the textbox",
  },
  {
    name: "extra page",
  },
]

export const MOCK_DIR_DATA: DirectoryData[] = [
  {
    name: "A directory",
    type: "dir",
    children: [],
  },
  {
    name: "Another directory",
    type: "dir",
    children: ["something", "something else"],
  },
  {
    name:
      "some dir with an extremely long name that cannot fit inside the textbox. in fact, it's so long that it should be a paragraph and perhaps a novel.",
    type: "dir",
    children: ["one"],
  },
  {
    name: "why so extra",
    type: "dir",
    children: [],
  },
]

export const MOCK_USER = {
  userId: "mockUser",
  email: "mockUser@open.gov.sg",
  contactNumber: "98765432",
}

export const MOCK_FOLDER_NAME = "mock-folder"
