import { EditedItemProps } from "layouts/ReviewRequest/components/RequestOverview"

import {
  DirectoryData,
  MediaData,
  PageData,
  ResourcePageData,
} from "types/directory"
import { NotificationData } from "types/notifications"
import { BackendSiteSettings } from "types/settings"
import {
  CollaboratorsStats,
  ReviewRequestStatus,
  SiteDashboardInfo,
  SiteDashboardReviewRequest,
} from "types/siteDashboard"
import { LoggedInUser } from "types/user"

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
  {
    name: "extra page",
    title: "this is an external link",
    date: "2020-01-02",
    resourceType: "link",
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

export const MOCK_USER: LoggedInUser = {
  userId: "mockUser",
  email: "mockUser@open.gov.sg",
  contactNumber: "98765432",
  displayedName: "mockUser",
}

const MOCK_MEDIA_ITEM_DATA: MediaData[] = [
  {
    mediaPath: "/some/thing",
    mediaUrl:
      "https://www.thebrandingjournal.com/wp-content/uploads/2014/06/20-Funny-Shocked-Cat-Memes-3.jpg",
    name: "shocked cat",
    sha: "sha",
    type: "file",
  },
  {
    mediaPath: "/some/thing",
    mediaUrl: "https://uploads.dailydot.com/2018/10/olli-the-polite-cat.jpg",
    name: "polite cat",
    sha: "sha",
    type: "file",
  },
  {
    mediaPath: "/some/thing",
    mediaUrl: "https://img-9gag-fun.9cache.com/photo/a2W12m9_700bwp.webp",
    name: "screaming cat",
    sha: "sha",
    type: "file",
  },
  {
    mediaPath: "/some/thing",
    mediaUrl:
      "https://cdn.pixabay.com/photo/2012/08/27/14/19/mountains-55067__340.png",
    name: "some mountain",
    sha: "sha",
    type: "file",
  },
  {
    mediaPath: "/some/thing",
    mediaUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cG9ydHJhaXR8ZW58MHx8MHx8&w=1000&q=80.png",
    name: "pearly",
    sha: "sha",
    type: "file",
  },
]

export const MOCK_MEDIA_DATA: (MediaData | DirectoryData)[] = [
  ...MOCK_DIR_DATA,
  ...MOCK_MEDIA_ITEM_DATA,
]

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

export const MOCK_SITE_DASHBOARD_REVIEW_REQUESTS: SiteDashboardReviewRequest[] = [
  {
    id: 150,
    title: "Update STCCED hyperlink, customs duty and other fees 6/7/22 3:43PM",
    description:
      "Added new section to homepage for upcoming event.\n\nPlease review by 12 Jan! Added new section to homepage for upcoming event. Please review by 12 Jan! Added new section to homepage for upcoming event. Please review by 12 Jan!",
    author: "audrey@open.gov.sg",
    status: ReviewRequestStatus.PENDING,
    changedFiles: 10,
    newComments: 1,
    firstView: false,
    createdAt: 1654587801,
  },
]

export const MOCK_SITE_DASHBOARD_COLLABORATORS_STATISTICS: CollaboratorsStats = {
  total: 10,
  inactive: 8,
}

export const MOCK_SITE_DASHBOARD_INFO: SiteDashboardInfo = {
  savedAt: 1642559061000,
  savedBy: "Siti_Julaiha_ASMURI@hdb.gov.sg",
  publishedAt: 1642559061000,
  publishedBy: "Siti_Julaiha_ASMURI@hdb.gov.sg",
  stagingUrl: "https://opengovsg-test-staging.netlify.app",
  siteUrl: "https://www.open.gov.sg",
}

export const MOCK_ITEMS: EditedItemProps[] = [
  {
    type: ["page"],
    name: "A page",
    path: ["some", "thing"],
    url: "www.google.com",
    lastEditedBy: "asdf",
    lastEditedTime: 129823104094,
  },
  {
    type: ["nav"],
    name: "A nav",
    path: ["some", "thing"],
    url: "www.google.com",
    lastEditedBy: "asdf",
    lastEditedTime: 823104823094,
  },
  {
    type: ["file"],
    name: "a file",
    path: ["some", "thing"],
    url: "www.google.com",
    lastEditedBy: "asdf",
    lastEditedTime: 129823104823094,
  },
  {
    type: ["setting"],
    name:
      "A setting with an extremely long title that probably can't fit into a single line and we have to truncate this somehow. so we will hopefully display an ellipsis over it",
    // NOTE: We don't have arbitrary nested folders.
    // We only have depth = 2 for our folders.
    path: [
      "something extremely long that",
      "might not be able to fit into a single line",
      "so we have to truncate it to show an ellipsis at the end",
    ],
    url: "www.google.com",
    lastEditedBy: "asdf",
    lastEditedTime: 129823094,
  },
  {
    type: ["setting"],
    name: "a normal setting",
    path: ["some", "thing"],
    url: "www.google.com",
    lastEditedBy: "asdf",
    lastEditedTime: 12123498294,
  },
  {
    type: ["image"],
    name: "some file",
    path: ["some", "thing"],
    url: "www.google.com",
    lastEditedBy: "asdf",
    lastEditedTime: 129823094,
  },
  {
    // NOTE: This has 2 types - we tiebreak by using the first item in the array for the icon.
    // For the filtering, it should appear in both.
    type: ["nav", "setting"],
    name: "a file with two types",
    path: ["another", "path"],
    url: "www.google.com",
    lastEditedBy: "asdf",
    lastEditedTime: 129823094,
  },
]

export const MOCK_ADMINS = [
  {
    value: "cat@cat.sg",
    label: "Cat",
  },
  {
    value: "Someone@anonymous.sg",
    label: "Unknown",
  },
  {
    value: "aLongLabel@tooLongFor.me",
    label:
      "an extremely long label, so long that it should overflow. so let us see if it truly does. if it is so long, should it be called a paralabel? as it is a paragraph label.",
  },
]

export const MOCK_NOTIFICATION_DATA: NotificationData[] = [
  {
    message: "first unread notification",
    createdAt: "2022-10-03 04:45:38.087",
    link: "/",
    isRead: false,
    sourceUsername: "User1",
    type: "type",
  },
  {
    message: "another notification",
    createdAt: "2022-09-03 04:45:38.087",
    link: "/",
    isRead: false,
    sourceUsername: "AnotherUser",
    type: "type",
  },
  {
    message:
      "some notification with an extremely long name that cannot fit inside the textbox. in fact, it's so long that it should be a paragraph and perhaps a novel.",
    createdAt: "2022-10-01 04:45:38.087",
    link: "/",
    isRead: false,
    sourceUsername: "ThirdUser",
    type: "type",
  },
  {
    message: "Non-user notification",
    createdAt: "2022-09-23 04:45:38.087",
    link: "/",
    isRead: false,
    sourceUsername: "",
    type: "type",
  },
  {
    message: "another notification",
    createdAt: "2022-09-03 04:45:38.087",
    link: "/",
    isRead: false,
    sourceUsername: "AnotherUser",
    type: "type",
  },
  {
    message: "another notification",
    createdAt: "2022-09-03 04:45:38.087",
    link: "/",
    isRead: false,
    sourceUsername: "AnotherUser",
    type: "type",
  },
]

export const MOCK_ALL_NOTIFICATION_DATA: NotificationData[] = [
  ...MOCK_NOTIFICATION_DATA,
  {
    message: "even more notification",
    createdAt: "2022-09-23 04:45:38.087",
    link: "/",
    isRead: true,
    sourceUsername: "EvenMore",
    type: "type",
  },
]
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
