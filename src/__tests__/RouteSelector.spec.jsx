import "../tests/TestDecoder.mock"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import "@testing-library/jest-dom/extend-expect"

import { LoginContext } from "contexts/LoginContext"

import { RouteSelector } from "routing/RouteSelector"

const HOME_LAYOUT_TEXT = "Home layout mock text"
const SITES_LAYOUT_TEXT = "Site layout mock text"
const SETTINGS_LAYOUT_TEXT = "Settings layout mock text"
const EDIT_NAVBAR_LAYOUT_TEXT = "Navbar editor layout mock text"
const RESOURCES_LAYOUT_TEXT = "Resources layout mock text"
const RESOURCES_CATEGORY_LAYOUT_TEXT = "Resource category layout text"
const EDIT_CONTACT_US_LAYOUT_TEXT = "Contact us editor layout mock text"
const EDIT_HOMEPAGE_LAYOUT_TEXT = "Homepage editor layout mock text"
const WORKSPACE_LAYOUT_TEXT = "Workspace layout mock text"
const MEDIA_LAYOUT_TEXT = "Media layout mock text"
const EDIT_PAGE_LAYOUT_TEXT = "Page editor layout mock text"
const FOLDERS_LAYOUT_TEXT = "Folders layout mock text"
const NOT_FOUND_LAYOUT_TEXT = "Route does not exist"

// Layout mocks
jest.mock("layouts/Login", () => {
  return {
    LoginPage: () => {
      return <div>{HOME_LAYOUT_TEXT}</div>
    },
  }
})

jest.mock("layouts/Login/LoginPage", () => {
  return {
    __esModule: true,
    default: () => {
      return <div>{HOME_LAYOUT_TEXT}</div>
    },
  }
})

jest.mock("layouts/Sites", () => {
  return {
    __esModule: true,
    default: () => {
      return <div>{SITES_LAYOUT_TEXT}</div>
    },
  }
})

jest.mock("layouts/Settings", () => {
  return {
    Settings: () => {
      return <div>{SETTINGS_LAYOUT_TEXT}</div>
    },
  }
})

jest.mock("layouts/EditNavBar", () => {
  return {
    __esModule: true,
    default: () => {
      return <div>{EDIT_NAVBAR_LAYOUT_TEXT}</div>
    },
  }
})

jest.mock("layouts/ResourceRoom", () => {
  return {
    ResourceRoom: () => {
      return <div>{RESOURCES_LAYOUT_TEXT}</div>
    },
  }
})

jest.mock("layouts/ResourceCategory", () => {
  return {
    ResourceCategory: () => {
      return <div>{RESOURCES_CATEGORY_LAYOUT_TEXT}</div>
    },
  }
})

jest.mock("layouts/EditContactUs", () => {
  return {
    __esModule: true,
    default: () => {
      return <div>{EDIT_CONTACT_US_LAYOUT_TEXT}</div>
    },
  }
})

jest.mock("layouts/EditHomepage", () => {
  return {
    __esModule: true,
    default: () => {
      return <div>{EDIT_HOMEPAGE_LAYOUT_TEXT}</div>
    },
  }
})

jest.mock("layouts/Workspace", () => {
  return {
    Workspace: () => {
      return <div>{WORKSPACE_LAYOUT_TEXT}</div>
    },
  }
})

jest.mock("layouts/Media", () => {
  return {
    __esModule: true,
    default: () => {
      return <div>{MEDIA_LAYOUT_TEXT}</div>
    },
  }
})

jest.mock("layouts/EditPage", () => {
  return {
    __esModule: true,
    default: () => {
      return <div>{EDIT_PAGE_LAYOUT_TEXT}</div>
    },
  }
})

jest.mock("layouts/Folders", () => {
  return {
    Folders: () => {
      return <div>{FOLDERS_LAYOUT_TEXT}</div>
    },
  }
})

jest.mock("layouts/NotFoundPage", () => {
  return {
    __esModule: true,
    default: () => {
      return <div>{NOT_FOUND_LAYOUT_TEXT}</div>
    },
  }
})

// Context mocks
const LoggedInContextProvider = ({ children }) => {
  const loggedInContextData = {
    userId: "test-user",
    email: "test-email",
    logout: jest.fn(),
  }

  return (
    <LoginContext.Provider value={loggedInContextData}>
      {children}
    </LoginContext.Provider>
  )
}

const NotLoggedInContextProvider = ({ children }) => {
  const notLoggedInContextData = {
    userId: null,
    email: null,
    logout: jest.fn(),
  }

  return (
    <LoginContext.Provider value={notLoggedInContextData}>
      {children}
    </LoginContext.Provider>
  )
}

// Test suite
describe("Tests for RouteSelector", () => {
  describe("/", () => {
    test("Should render Home layout if not logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={["/"]}>
          <NotLoggedInContextProvider>
            <RouteSelector />
          </NotLoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(HOME_LAYOUT_TEXT)).toBeInTheDocument()
    })

    test("Should redirect to /sites and render Sites layout if logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={["/"]}>
          <LoggedInContextProvider>
            <RouteSelector />
          </LoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(HOME_LAYOUT_TEXT)).not.toBeInTheDocument()
      expect(screen.queryByText(SITES_LAYOUT_TEXT)).toBeInTheDocument()
    })
  })

  describe("/sites", () => {
    test("Should render Sites page if at /sites and logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={["/sites"]}>
          <LoggedInContextProvider>
            <RouteSelector />
          </LoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(SITES_LAYOUT_TEXT)).toBeInTheDocument()
    })

    test("Should redirect to /home and not render Sites page if at /sites and not logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={["/sites"]}>
          <NotLoggedInContextProvider>
            <RouteSelector />
          </NotLoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(SITES_LAYOUT_TEXT)).not.toBeInTheDocument()
      expect(screen.queryByText(HOME_LAYOUT_TEXT)).toBeInTheDocument()
    })
  })

  describe("/sites/:siteName/settings", () => {
    test("Should render Settings page for site site-name if logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={["/sites/site-name/settings"]}>
          <LoggedInContextProvider>
            <RouteSelector />
          </LoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(SETTINGS_LAYOUT_TEXT)).toBeInTheDocument()
    })

    test("Should redirect to /home and not render Settings page if not logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={["/sites/site-name/settings"]}>
          <NotLoggedInContextProvider>
            <RouteSelector />
          </NotLoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(SETTINGS_LAYOUT_TEXT)).not.toBeInTheDocument()
      expect(screen.queryByText(HOME_LAYOUT_TEXT)).toBeInTheDocument()
    })
  })

  describe("/sites/:siteName/navbar", () => {
    test("Should render Navbar editor page for site site-name if logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={["/sites/site-name/navbar"]}>
          <LoggedInContextProvider>
            <RouteSelector />
          </LoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(EDIT_NAVBAR_LAYOUT_TEXT)).toBeInTheDocument()
    })

    test("Should redirect to /home and not render Navbar editor page if not logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={["/sites/site-name/navbar"]}>
          <NotLoggedInContextProvider>
            <RouteSelector />
          </NotLoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(
        screen.queryByText(EDIT_NAVBAR_LAYOUT_TEXT)
      ).not.toBeInTheDocument()
      expect(screen.queryByText(HOME_LAYOUT_TEXT)).toBeInTheDocument()
    })
  })

  describe("/sites/:siteName/resourceRoom", () => {
    test("Should render Resource room page for site site-name if logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={["/sites/site-name/resourceRoom"]}>
          <LoggedInContextProvider>
            <RouteSelector />
          </LoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(RESOURCES_LAYOUT_TEXT)).toBeInTheDocument()
    })

    test("Should redirect to /home and not render Resource room page if not logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={["/sites/site-name/resources"]}>
          <NotLoggedInContextProvider>
            <RouteSelector />
          </NotLoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(RESOURCES_LAYOUT_TEXT)).not.toBeInTheDocument()
      expect(screen.queryByText(HOME_LAYOUT_TEXT)).toBeInTheDocument()
    })
  })

  describe("/sites/:siteName/resourceRoom/:resourceName/resourceCategory/:categoryName", () => {
    test("Should render Resources Catrgory layout page for site site-name if logged in", () => {
      // Act
      render(
        <MemoryRouter
          initialEntries={[
            "/sites/site-name/resourceRoom/some-resource/resourceCategory/my-collection",
          ]}
        >
          <LoggedInContextProvider>
            <RouteSelector />
          </LoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(
        screen.queryByText(RESOURCES_CATEGORY_LAYOUT_TEXT)
      ).toBeInTheDocument()
    })

    test("Should redirect to /home and not render Resources Collection layout page if not logged in", () => {
      // Act
      render(
        <MemoryRouter
          initialEntries={["/sites/site-name/resources/my-collection"]}
        >
          <NotLoggedInContextProvider>
            <RouteSelector />
          </NotLoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(
        screen.queryByText(RESOURCES_CATEGORY_LAYOUT_TEXT)
      ).not.toBeInTheDocument()
      expect(screen.queryByText(HOME_LAYOUT_TEXT)).toBeInTheDocument()
    })
  })

  describe("/sites/:siteName/resourceRoom/:resourceRoomName/resourceCategory/:resourceCategoryName/editPage/:fileName", () => {
    test("Should render EditPage layout page for site site-name if logged in", () => {
      // Act
      render(
        <MemoryRouter
          initialEntries={[
            "/sites/site-name/resourceRoom/my-resource/resourceCategory/my-category/editPage/my-file",
          ]}
        >
          <LoggedInContextProvider>
            <RouteSelector />
          </LoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(EDIT_PAGE_LAYOUT_TEXT)).toBeInTheDocument()
    })

    test("Should redirect to /home and not render Resources Collection layout page if not logged in", () => {
      // Act
      render(
        <MemoryRouter
          initialEntries={["/sites/site-name/resources/my-collection/my-file"]}
        >
          <NotLoggedInContextProvider>
            <RouteSelector />
          </NotLoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(EDIT_PAGE_LAYOUT_TEXT)).not.toBeInTheDocument()
      expect(screen.queryByText(HOME_LAYOUT_TEXT)).toBeInTheDocument()
    })
  })

  describe("/sites/:siteName/contact-us", () => {
    test("Should render Contact Us editor page for site site-name if logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={["/sites/site-name/contact-us"]}>
          <LoggedInContextProvider>
            <RouteSelector />
          </LoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(
        screen.queryByText(EDIT_CONTACT_US_LAYOUT_TEXT)
      ).toBeInTheDocument()
    })

    test("Should redirect to /home and not render Contact Us editor page if not logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={["/sites/site-name/contact-us"]}>
          <NotLoggedInContextProvider>
            <RouteSelector />
          </NotLoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(
        screen.queryByText(EDIT_CONTACT_US_LAYOUT_TEXT)
      ).not.toBeInTheDocument()
      expect(screen.queryByText(HOME_LAYOUT_TEXT)).toBeInTheDocument()
    })
  })

  describe("/sites/:siteName/homepage", () => {
    test("Should render Homepage editor page for site site-name if logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={["/sites/site-name/homepage"]}>
          <LoggedInContextProvider>
            <RouteSelector />
          </LoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(EDIT_HOMEPAGE_LAYOUT_TEXT)).toBeInTheDocument()
    })

    test("Should redirect to /home and not render Homepage editor page if not logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={["/sites/site-name/homepage"]}>
          <NotLoggedInContextProvider>
            <RouteSelector />
          </NotLoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(
        screen.queryByText(EDIT_HOMEPAGE_LAYOUT_TEXT)
      ).not.toBeInTheDocument()
      expect(screen.queryByText(HOME_LAYOUT_TEXT)).toBeInTheDocument()
    })
  })

  describe("/sites/:siteName/workspace", () => {
    test("Should render Workspace page for site site-name if logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={["/sites/site-name/workspace"]}>
          <LoggedInContextProvider>
            <RouteSelector />
          </LoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(WORKSPACE_LAYOUT_TEXT)).toBeInTheDocument()
    })

    test("Should redirect to /home and not render Workspace page if not logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={["/sites/site-name/workspace"]}>
          <NotLoggedInContextProvider>
            <RouteSelector />
          </NotLoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(WORKSPACE_LAYOUT_TEXT)).not.toBeInTheDocument()
      expect(screen.queryByText(HOME_LAYOUT_TEXT)).toBeInTheDocument()
    })
  })

  describe("/sites/:siteName/editPage/:fileName", () => {
    test("Should render EditPage page for site site-name if logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={["/sites/site-name/editPage/my-file"]}>
          <LoggedInContextProvider>
            <RouteSelector />
          </LoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(EDIT_PAGE_LAYOUT_TEXT)).toBeInTheDocument()
    })

    test("Should redirect to /home and not render Workspace page if not logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={["/sites/site-name/pages/my-file"]}>
          <NotLoggedInContextProvider>
            <RouteSelector />
          </NotLoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(EDIT_PAGE_LAYOUT_TEXT)).not.toBeInTheDocument()
      expect(screen.queryByText(HOME_LAYOUT_TEXT)).toBeInTheDocument()
    })
  })

  describe("/sites/:siteName/media/:mediaRoom/mediaDirectory/:mediaDirectoryName", () => {
    test("Should render Media page for site site-name if logged in", () => {
      // Act
      render(
        <MemoryRouter
          initialEntries={[
            "/sites/site-name/media/my-room/mediaDirectory/my-directory-name",
          ]}
        >
          <LoggedInContextProvider>
            <RouteSelector />
          </LoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(MEDIA_LAYOUT_TEXT)).toBeInTheDocument()
    })

    test("Should redirect to /home and not render Images page if not logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={["/sites/site-name/images"]}>
          <NotLoggedInContextProvider>
            <RouteSelector />
          </NotLoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(MEDIA_LAYOUT_TEXT)).not.toBeInTheDocument()
      expect(screen.queryByText(HOME_LAYOUT_TEXT)).toBeInTheDocument()
    })
  })

  describe("/sites/:siteName/folders/:collectionName", () => {
    test("Should render Folders layout page for site site-name if logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={["/sites/site-name/folders/my-folder"]}>
          <LoggedInContextProvider>
            <RouteSelector />
          </LoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(FOLDERS_LAYOUT_TEXT)).toBeInTheDocument()
    })

    test("Should redirect to /home and not render Folders layout page if not logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={["/sites/site-name/folder/my-folder"]}>
          <NotLoggedInContextProvider>
            <RouteSelector />
          </NotLoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(FOLDERS_LAYOUT_TEXT)).not.toBeInTheDocument()
      expect(screen.queryByText(HOME_LAYOUT_TEXT)).toBeInTheDocument()
    })
  })

  describe("/sites/:siteName/folders/:collectionName/subfolders/:subCollectionName", () => {
    test("Should render Folders layout page for site site-name if logged in", () => {
      // Act
      render(
        <MemoryRouter
          initialEntries={[
            "/sites/site-name/folders/my-folder/subfolders/my-subfolder",
          ]}
        >
          <LoggedInContextProvider>
            <RouteSelector />
          </LoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(FOLDERS_LAYOUT_TEXT)).toBeInTheDocument()
    })

    test("Should redirect to /home and not render Folders layout page if not logged in", () => {
      // Act
      render(
        <MemoryRouter
          initialEntries={[
            "/sites/site-name/folder/my-folder/subfolder/my-subfolder",
          ]}
        >
          <NotLoggedInContextProvider>
            <RouteSelector />
          </NotLoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(FOLDERS_LAYOUT_TEXT)).not.toBeInTheDocument()
      expect(screen.queryByText(HOME_LAYOUT_TEXT)).toBeInTheDocument()
    })
  })

  describe("/sites/:siteName/folders/:collectionName/editPage/:fileName", () => {
    test("Should render EditPage page for site site-name if logged in", () => {
      // Act
      render(
        <MemoryRouter
          initialEntries={[
            "/sites/site-name/folders/my-folder/editPage/my-file",
          ]}
        >
          <LoggedInContextProvider>
            <RouteSelector />
          </LoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(EDIT_PAGE_LAYOUT_TEXT)).toBeInTheDocument()
    })

    test("Should redirect to /home and not render EditPage page if not logged in", () => {
      // Act
      render(
        <MemoryRouter
          initialEntries={["/sites/site-name/folder/my-folder/my-file"]}
        >
          <NotLoggedInContextProvider>
            <RouteSelector />
          </NotLoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(EDIT_PAGE_LAYOUT_TEXT)).not.toBeInTheDocument()
      expect(screen.queryByText(HOME_LAYOUT_TEXT)).toBeInTheDocument()
    })
  })

  describe("/sites/:siteName/folders/:collectionName/subfolders/:subCollectionName/editPage/:fileName", () => {
    test("Should render EditPage page for site site-name if logged in", () => {
      // Act
      render(
        <MemoryRouter
          initialEntries={[
            "/sites/site-name/folders/my-folder/subfolders/my-subfolder/editPage/my-file",
          ]}
        >
          <LoggedInContextProvider>
            <RouteSelector />
          </LoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(EDIT_PAGE_LAYOUT_TEXT)).toBeInTheDocument()
    })

    test("Should redirect to /home and not render EditPage page if not logged in", () => {
      // Act
      render(
        <MemoryRouter
          initialEntries={[
            "/sites/site-name/folder/my-folder/subfolder/my-subfolder/my-file",
          ]}
        >
          <NotLoggedInContextProvider>
            <RouteSelector />
          </NotLoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(EDIT_PAGE_LAYOUT_TEXT)).not.toBeInTheDocument()
      expect(screen.queryByText(HOME_LAYOUT_TEXT)).toBeInTheDocument()
    })
  })

  describe("/not-found", () => {
    test("Should render NotFound page for site site-name if logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={["/not-found"]}>
          <LoggedInContextProvider>
            <RouteSelector />
          </LoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(NOT_FOUND_LAYOUT_TEXT)).toBeInTheDocument()
    })

    test("Should redirect to /home and not render NotFound page if not logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={["/not-found"]}>
          <NotLoggedInContextProvider>
            <RouteSelector />
          </NotLoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(NOT_FOUND_LAYOUT_TEXT)).not.toBeInTheDocument()
      expect(screen.queryByText(HOME_LAYOUT_TEXT)).toBeInTheDocument()
    })
  })
})
