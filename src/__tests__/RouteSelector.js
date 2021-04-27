
import React from 'react';
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import '@testing-library/jest-dom/extend-expect'

import { RouteSelector } from '../routing/RouteSelector'
import { LoginContext } from '../contexts/LoginContext'

const HOME_LAYOUT_TEXT = "Home layout mock text"
const SITES_LAYOUT_TEXT = "Site layout mock text"
const SETTINGS_LAYOUT_TEXT = "Settings layout mock text"
const EDIT_NAVBAR_LAYOUT_TEXT = "Navbar editor layout mock text"
const RESOURCES_LAYOUT_TEXT = "Resources layout mock text"
const RESOURCES_CATEGORY_LAYOUT_TEXT = "Resource category layout text"
const EDIT_CONTACT_US_LAYOUT_TEXT = "Contact us editor layout mock text"
const EDIT_HOMEPAGE_LAYOUT_TEXT = "Homepage editor layout mock text"
const WORKSPACE_LAYOUT_TEXT = "Workspace layout mock text"
const IMAGES_LAYOUT_TEXT = "Images layout mock text"
const FILES_LAYOUT_TEXT = "Files layout mock text"
const EDIT_FILE_LAYOUT_TEXT = "File editor layout mock text"
const EDIT_PAGE_LAYOUT_TEXT = "Page editor layout mock text"
const FOLDERS_LAYOUT_TEXT = "Folders layout mock text"
const NOT_FOUND_LAYOUT_TEXT = "Route does not exist"

// Layout mocks
jest.mock("../layouts/Home", () => {
  return {
    __esModule: true,
    default: () => {
      return <div>{HOME_LAYOUT_TEXT}</div>
    },
  }
})

jest.mock("../layouts/Sites", () => {
  return {
    __esModule: true,
    default: () => {
      return <div>{SITES_LAYOUT_TEXT}</div>
    },
  }
})

jest.mock("../layouts/Settings", () => {
  return {
    __esModule: true,
    default: () => {
      return <div>{SETTINGS_LAYOUT_TEXT}</div>
    },
  }
})

jest.mock("../layouts/EditNavBar", () => {
  return {
    __esModule: true,
    default: () => {
      return <div>{EDIT_NAVBAR_LAYOUT_TEXT}</div>
    },
  }
})

jest.mock("../layouts/Resources", () => {
  return {
    __esModule: true,
    default: () => {
      return <div>{RESOURCES_LAYOUT_TEXT}</div>
    },
  }
})

jest.mock("../layouts/CategoryPages", () => {
  return {
    __esModule: true,
    default: () => {
      return <div>{RESOURCES_CATEGORY_LAYOUT_TEXT}</div>
    },
  }
})

jest.mock("../layouts/EditContactUs", () => {
  return {
    __esModule: true,
    default: () => {
      return <div>{EDIT_CONTACT_US_LAYOUT_TEXT}</div>
    },
  }
})

jest.mock("../layouts/EditHomepage", () => {
  return {
    __esModule: true,
    default: () => {
      return <div>{EDIT_HOMEPAGE_LAYOUT_TEXT}</div>
    },
  }
})

jest.mock("../layouts/Workspace", () => {
  return {
    __esModule: true,
    default: () => {
      return <div>{WORKSPACE_LAYOUT_TEXT}</div>
    },
  }
})

jest.mock("../layouts/Images", () => {
  return {
    __esModule: true,
    default: () => {
      return <div>{IMAGES_LAYOUT_TEXT}</div>
    },
  }
})

jest.mock("../layouts/Files", () => {
  return {
    __esModule: true,
    default: () => {
      return <div>{FILES_LAYOUT_TEXT}</div>
    },
  }
})

jest.mock("../layouts/EditFile", () => {
  return {
    __esModule: true,
    default: () => {
      return <div>{EDIT_FILE_LAYOUT_TEXT}</div>
    },
  }
})

jest.mock("../layouts/EditPage", () => {
  return {
    __esModule: true,
    default: () => {
      return <div>{EDIT_PAGE_LAYOUT_TEXT}</div>
    },
  }
})

jest.mock("../layouts/Folders", () => {
  return {
    __esModule: true,
    default: () => {
      return <div>{FOLDERS_LAYOUT_TEXT}</div>
    },
  }
})

jest.mock("../layouts/Folders", () => {
  return {
    __esModule: true,
    default: () => {
      return <div>{FOLDERS_LAYOUT_TEXT}</div>
    },
  }
})

jest.mock("../components/NotFoundPage", () => {
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
    userId: 'test-user',
    logout: jest.fn()
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
    logout: jest.fn()
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
        <MemoryRouter initialEntries={['/']}>
          <NotLoggedInContextProvider>
            <RouteSelector/>
          </NotLoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(HOME_LAYOUT_TEXT)).toBeInTheDocument()
    })

    test("Should redirect to /sites and render Sites layout if logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={['/']}>
          <LoggedInContextProvider>
            <RouteSelector/>
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
        <MemoryRouter initialEntries={['/sites']}>
          <LoggedInContextProvider>
            <RouteSelector/>
          </LoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(SITES_LAYOUT_TEXT)).toBeInTheDocument()
    })

    test("Should redirect to /home and not render Sites page if at /sites and not logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={['/sites']}>
          <NotLoggedInContextProvider>
            <RouteSelector/>
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
        <MemoryRouter initialEntries={['/sites/site-name/settings']}>
          <LoggedInContextProvider>
            <RouteSelector/>
          </LoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(SETTINGS_LAYOUT_TEXT)).toBeInTheDocument()
    })

    test("Should redirect to /home and not render Settings page if not logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={['/sites/site-name/settings']}>
          <NotLoggedInContextProvider>
            <RouteSelector/>
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
        <MemoryRouter initialEntries={['/sites/site-name/navbar']}>
          <LoggedInContextProvider>
            <RouteSelector/>
          </LoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(EDIT_NAVBAR_LAYOUT_TEXT)).toBeInTheDocument()
    })

    test("Should redirect to /home and not render Navbar editor page if not logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={['/sites/site-name/navbar']}>
          <NotLoggedInContextProvider>
            <RouteSelector/>
          </NotLoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(EDIT_NAVBAR_LAYOUT_TEXT)).not.toBeInTheDocument()
      expect(screen.queryByText(HOME_LAYOUT_TEXT)).toBeInTheDocument()
    })
  })

  describe("/sites/:siteName/resources", () => {
    test("Should render Resources editor page for site site-name if logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={['/sites/site-name/resources']}>
          <LoggedInContextProvider>
            <RouteSelector/>
          </LoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(RESOURCES_LAYOUT_TEXT)).toBeInTheDocument()
    })

    test("Should redirect to /home and not render Resources editor page if not logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={['/sites/site-name/resources']}>
          <NotLoggedInContextProvider>
            <RouteSelector/>
          </NotLoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(RESOURCES_LAYOUT_TEXT)).not.toBeInTheDocument()
      expect(screen.queryByText(HOME_LAYOUT_TEXT)).toBeInTheDocument()
    })
  })

  describe("/sites/:siteName/resources/:collectionName", () => {
    test("Should render Resources Collection layout page for site site-name if logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={['/sites/site-name/resources/my-collection']}>
          <LoggedInContextProvider>
            <RouteSelector/>
          </LoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(RESOURCES_CATEGORY_LAYOUT_TEXT)).toBeInTheDocument()
    })

    test("Should redirect to /home and not render Resources Collection layout page if not logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={['/sites/site-name/resources/my-collection']}>
          <NotLoggedInContextProvider>
            <RouteSelector/>
          </NotLoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(RESOURCES_CATEGORY_LAYOUT_TEXT)).not.toBeInTheDocument()
      expect(screen.queryByText(HOME_LAYOUT_TEXT)).toBeInTheDocument()
    })
  })

  describe("/sites/:siteName/resources/:resourceName/:fileName", () => {
    test("Should render EditPage layout page for site site-name if logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={['/sites/site-name/resources/my-collection/my-file']}>
          <LoggedInContextProvider>
            <RouteSelector/>
          </LoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(EDIT_PAGE_LAYOUT_TEXT)).toBeInTheDocument()
    })

    test("Should redirect to /home and not render Resources Collection layout page if not logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={['/sites/site-name/resources/my-collection/my-file']}>
          <NotLoggedInContextProvider>
            <RouteSelector/>
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
        <MemoryRouter initialEntries={['/sites/site-name/contact-us']}>
          <LoggedInContextProvider>
            <RouteSelector/>
          </LoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(EDIT_CONTACT_US_LAYOUT_TEXT)).toBeInTheDocument()
    })

    test("Should redirect to /home and not render Contact Us editor page if not logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={['/sites/site-name/contact-us']}>
          <NotLoggedInContextProvider>
            <RouteSelector/>
          </NotLoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(EDIT_CONTACT_US_LAYOUT_TEXT)).not.toBeInTheDocument()
      expect(screen.queryByText(HOME_LAYOUT_TEXT)).toBeInTheDocument()
    })
  })

  describe("/sites/:siteName/homepage", () => {
    test("Should render Homepage editor page for site site-name if logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={['/sites/site-name/homepage']}>
          <LoggedInContextProvider>
            <RouteSelector/>
          </LoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(EDIT_HOMEPAGE_LAYOUT_TEXT)).toBeInTheDocument()
    })

    test("Should redirect to /home and not render Homepage editor page if not logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={['/sites/site-name/homepage']}>
          <NotLoggedInContextProvider>
            <RouteSelector/>
          </NotLoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(EDIT_HOMEPAGE_LAYOUT_TEXT)).not.toBeInTheDocument()
      expect(screen.queryByText(HOME_LAYOUT_TEXT)).toBeInTheDocument()
    })
  })

  describe("/sites/:siteName/workspace", () => {
    test("Should render Workspace page for site site-name if logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={['/sites/site-name/workspace']}>
          <LoggedInContextProvider>
            <RouteSelector/>
          </LoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(WORKSPACE_LAYOUT_TEXT)).toBeInTheDocument()
    })

    test("Should redirect to /home and not render Workspace page if not logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={['/sites/site-name/workspace']}>
          <NotLoggedInContextProvider>
            <RouteSelector/>
          </NotLoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(WORKSPACE_LAYOUT_TEXT)).not.toBeInTheDocument()
      expect(screen.queryByText(HOME_LAYOUT_TEXT)).toBeInTheDocument()
    })
  })

  describe("/sites/:siteName/pages/:fileName", () => {
    test("Should render EditPage page for site site-name if logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={['/sites/site-name/pages/my-file']}>
          <LoggedInContextProvider>
            <RouteSelector/>
          </LoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(EDIT_PAGE_LAYOUT_TEXT)).toBeInTheDocument()
    })

    test("Should redirect to /home and not render Workspace page if not logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={['/sites/site-name/pages/my-file']}>
          <NotLoggedInContextProvider>
            <RouteSelector/>
          </NotLoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(EDIT_PAGE_LAYOUT_TEXT)).not.toBeInTheDocument()
      expect(screen.queryByText(HOME_LAYOUT_TEXT)).toBeInTheDocument()
    })
  })

  describe("/sites/:siteName/images", () => {
    test("Should render Images page for site site-name if logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={['/sites/site-name/images']}>
          <LoggedInContextProvider>
            <RouteSelector/>
          </LoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(IMAGES_LAYOUT_TEXT)).toBeInTheDocument()
    })

    test("Should redirect to /home and not render Images page if not logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={['/sites/site-name/images']}>
          <NotLoggedInContextProvider>
            <RouteSelector/>
          </NotLoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(IMAGES_LAYOUT_TEXT)).not.toBeInTheDocument()
      expect(screen.queryByText(HOME_LAYOUT_TEXT)).toBeInTheDocument()
    })
  })

  describe("/sites/:siteName/images/:customPath", () => {
    test("Should render Images page for site site-name if logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={['/sites/site-name/images/custom-image-path']}>
          <LoggedInContextProvider>
            <RouteSelector/>
          </LoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(IMAGES_LAYOUT_TEXT)).toBeInTheDocument()
    })

    test("Should redirect to /home and not render Images page if not logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={['/sites/site-name/images/custom-image-path']}>
          <NotLoggedInContextProvider>
            <RouteSelector/>
          </NotLoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(IMAGES_LAYOUT_TEXT)).not.toBeInTheDocument()
      expect(screen.queryByText(HOME_LAYOUT_TEXT)).toBeInTheDocument()
    })
  })

  describe("/sites/:siteName/files", () => {
    test("Should render Files page for site site-name if logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={['/sites/site-name/files']}>
          <LoggedInContextProvider>
            <RouteSelector/>
          </LoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(FILES_LAYOUT_TEXT)).toBeInTheDocument()
    })

    test("Should redirect to /home and not render Files page if not logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={['/sites/site-name/files']}>
          <NotLoggedInContextProvider>
            <RouteSelector/>
          </NotLoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(FILES_LAYOUT_TEXT)).not.toBeInTheDocument()
      expect(screen.queryByText(HOME_LAYOUT_TEXT)).toBeInTheDocument()
    })
  })

  describe("/sites/:siteName/files/:fileName", () => {
    test("Should render Edit Files page for site site-name if logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={['/sites/site-name/files/my-file']}>
          <LoggedInContextProvider>
            <RouteSelector/>
          </LoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(EDIT_FILE_LAYOUT_TEXT)).toBeInTheDocument()
    })

    test("Should redirect to /home and not render Edit Files page if not logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={['/sites/site-name/files/my-file']}>
          <NotLoggedInContextProvider>
            <RouteSelector/>
          </NotLoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(EDIT_FILE_LAYOUT_TEXT)).not.toBeInTheDocument()
      expect(screen.queryByText(HOME_LAYOUT_TEXT)).toBeInTheDocument()
    })
  })

  describe("/sites/:siteName/folder/:folderName", () => {
    test("Should render Folders layout page for site site-name if logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={['/sites/site-name/folder/my-folder']}>
          <LoggedInContextProvider>
            <RouteSelector/>
          </LoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(FOLDERS_LAYOUT_TEXT)).toBeInTheDocument()
    })

    test("Should redirect to /home and not render Folders layout page if not logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={['/sites/site-name/folder/my-folder']}>
          <NotLoggedInContextProvider>
            <RouteSelector/>
          </NotLoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(FOLDERS_LAYOUT_TEXT)).not.toBeInTheDocument()
      expect(screen.queryByText(HOME_LAYOUT_TEXT)).toBeInTheDocument()
    })
  })

  describe("/sites/:siteName/folder/:folderName/subfolder/:subfolderName", () => {
    test("Should render Folders layout page for site site-name if logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={['/sites/site-name/folder/my-folder/subfolder/my-subfolder']}>
          <LoggedInContextProvider>
            <RouteSelector/>
          </LoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(FOLDERS_LAYOUT_TEXT)).toBeInTheDocument()
    })

    test("Should redirect to /home and not render Folders layout page if not logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={['/sites/site-name/folder/my-folder/subfolder/my-subfolder']}>
          <NotLoggedInContextProvider>
            <RouteSelector/>
          </NotLoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(FOLDERS_LAYOUT_TEXT)).not.toBeInTheDocument()
      expect(screen.queryByText(HOME_LAYOUT_TEXT)).toBeInTheDocument()
    })
  })

  describe("/sites/:siteName/folder/:folderName/:fileName", () => {
    test("Should render EditPage page for site site-name if logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={['/sites/site-name/folder/my-folder/my-file']}>
          <LoggedInContextProvider>
            <RouteSelector/>
          </LoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(EDIT_PAGE_LAYOUT_TEXT)).toBeInTheDocument()
    })

    test("Should redirect to /home and not render EditPage page if not logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={['/sites/site-name/folder/my-folder/my-file']}>
          <NotLoggedInContextProvider>
            <RouteSelector/>
          </NotLoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(EDIT_PAGE_LAYOUT_TEXT)).not.toBeInTheDocument()
      expect(screen.queryByText(HOME_LAYOUT_TEXT)).toBeInTheDocument()
    })
  })

  describe("/sites/:siteName/folder/:folderName/subfolder/:subfolderName/:fileName", () => {
    test("Should render EditPage page for site site-name if logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={['/sites/site-name/folder/my-folder/subfolder/my-subfolder/my-file']}>
          <LoggedInContextProvider>
            <RouteSelector/>
          </LoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(EDIT_PAGE_LAYOUT_TEXT)).toBeInTheDocument()
    })

    test("Should redirect to /home and not render EditPage page if not logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={['/sites/site-name/folder/my-folder/subfolder/my-subfolder/my-file']}>
          <NotLoggedInContextProvider>
            <RouteSelector/>
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
        <MemoryRouter initialEntries={['/not-found']}>
          <LoggedInContextProvider>
            <RouteSelector/>
          </LoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(NOT_FOUND_LAYOUT_TEXT)).toBeInTheDocument()
    })

    test("Should redirect to /home and not render NotFound page if not logged in", () => {
      // Act
      render(
        <MemoryRouter initialEntries={['/not-found']}>
          <NotLoggedInContextProvider>
            <RouteSelector/>
          </NotLoggedInContextProvider>
        </MemoryRouter>
      )

      // Assert
      expect(screen.queryByText(NOT_FOUND_LAYOUT_TEXT)).not.toBeInTheDocument()
      expect(screen.queryByText(HOME_LAYOUT_TEXT)).toBeInTheDocument()
    })
  })
})