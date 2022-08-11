import { DirectoryData, PageData, ResourcePageData } from "types/directory"
import { BackendSiteSettings } from "types/settings"

export const MOCK_PAGES_DATA: PageData[] = [
  {
    name: "some page",
    type: "file",
  },
  {
    name: "another page",
    type: "file",
  },
  {
    name:
      "some page with an extremely long name that cannot fit inside the textbox. in fact, it's so long that it should be a paragraph and perhaps a novel.",
    type: "file",
  },
  {
    name: "extra page",
    type: "file",
  },
]
export const MOCK_RESOURCE_CATEGORY_PAGES_DATA: ResourcePageData[] = [
  {
    name: "some page",
    title: "i am a title",
    date: "2022-08-04",
    resourceType: "post",
  },
  {
    name: "another page",
    title: "this a random blog post by a random blogger",
    date: "2012-02-04",
    resourceType: "post",
  },
  {
    name:
      "some page with an extremely long name that cannot fit inside the textbox",
    title:
      "some page with an extremely long name that cannot fit inside the textbox. in fact, this is so long it should be an essay but whatever",
    date: "1966-12-03",
    resourceType: "file",
  },
  {
    name: "extra page",
    title: "this is an extra page",
    date: "2000-01-02",
    resourceType: "file",
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
  accountName: "mockUser",
}

export const MOCK_BE_SETTINGS: BackendSiteSettings = {
  title: "isomer",
  description: "isomer is a website builder",
  // NOTE: No shareicon/logo/favicon as no uploaded img within the story
  facebook_pixel: "many pixel",
  google_analytics: "some analytics",
  linkedin_insights: "some insightful comment",
  is_government: true,
  colors: {
    "primary-color": "#261EFF",
    "secondary-color": "#26342F",
    "media-colors": [
      {
        title: "some colour",
        color: "#000000",
      },
      {
        title: "some colour",
        color: "#000000",
      },
      {
        title: "some colour",
        color: "#000000",
      },
      {
        title: "some colour",
        color: "#000000",
      },
      {
        title: "some colour",
        color: "#000000",
      },
    ],
  },
  contact_us: "/isomie/indomie",
  feedback: "/feed/me/back",
  faq: "/no/questions/allowed",
  show_reach: "true",
  social_media: {
    facebook: "https://www.facebook.com/iloveisomer",
    linkedin: "https://www.linkedin.com/company/isomerites",
    twitter: "https://www.twitter.com/isotwit",
    youtube: "https://www.youtube.com/isotubes",
    instagram: "https://www.instagram.com/isogram/",
    telegram: "https://t.me/isogram",
    tiktok: "https://www.tiktok.com/isotok",
  },
}

export const MOCK_FOLDER_NAME = "mock-folder"

export const MOCK_SUBFOLDER_NAME = "mock-subfolder"

export const MOCK_RESOURCE_ROOM_NAME = "mock-resource-room"

export const MOCK_RESOURCE_CATEGORY_NAME = "mock-resource-category"

export const MOCK_COLLABORATORS = {
  CONTRIBUTOR_1: {
    id: "1",
    email: "test1@vendor.sg",
    githubId: "test1",
    contactNumber: "12331231",
    lastLoggedIn: "2022-03-20T07:41:09.661Z",
    createdAt: "2022-04-04T07:25:41.013Z",
    updatedAt: "2022-07-30T07:41:09.662Z",
    deletedAt: null,
    SiteMember: {
      userId: "1",
      siteId: "16",
      role: "CONTRIBUTOR",
      createdAt: "2022-07-29T03:50:49.145Z",
      updatedAt: "2022-07-29T03:50:49.145Z",
    },
  },
  CONTRIBUTOR_2: {
    id: "4",
    email: "test4@vendor.sg",
    githubId: "test4",
    contactNumber: "12331234",
    lastLoggedIn: "2022-04-30T07:41:09.661Z",
    createdAt: "2022-04-04T07:25:41.013Z",
    updatedAt: "2022-07-30T07:41:09.662Z",
    deletedAt: null,
    SiteMember: {
      userId: "4",
      siteId: "16",
      role: "CONTRIBUTOR",
      createdAt: "2022-07-29T03:50:49.145Z",
      updatedAt: "2022-07-29T03:50:49.145Z",
    },
  },
  ADMIN_1: {
    id: "2",
    email: "test2@test.gov.sg",
    githubId: "test2",
    contactNumber: "12331232",
    lastLoggedIn: "2022-07-30T07:41:09.661Z",
    createdAt: "2022-04-04T07:25:41.013Z",
    updatedAt: "2022-07-30T07:41:09.662Z",
    deletedAt: null,
    SiteMember: {
      userId: "2",
      siteId: "16",
      role: "ADMIN",
      createdAt: "2022-07-29T03:50:49.145Z",
      updatedAt: "2022-07-29T03:50:49.145Z",
    },
  },
  ADMIN_2: {
    id: "3",
    email: "test3@test.gov.sg",
    githubId: "test3",
    contactNumber: "12331233",
    lastLoggedIn: "2022-06-30T07:41:09.661Z",
    createdAt: "2022-04-04T07:25:41.013Z",
    updatedAt: "2022-07-30T07:41:09.662Z",
    deletedAt: null,
    SiteMember: {
      userId: "3",
      siteId: "16",
      role: "ADMIN",
      createdAt: "2022-07-29T03:50:49.145Z",
      updatedAt: "2022-07-29T03:50:49.145Z",
    },
  },
}
