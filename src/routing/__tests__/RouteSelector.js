
import React, { createContext, useContext } from 'react';
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import '@testing-library/jest-dom/extend-expect'

import { RouteSelector } from '../RouteSelector'
import { LoginContext } from '../../contexts/LoginContext'

const HOME_LAYOUT_TEXT = "Home layout mock text"
const SITES_LAYOUT_TEXT = "Site layout mock text"

// Layout mocks
jest.mock("../../layouts/Home", () => {
  return {
    __esModule: true,
    default: () => {
      return <div>{HOME_LAYOUT_TEXT}</div>
    },
  }
})

jest.mock("../../layouts/Sites", () => {
  return {
    __esModule: true,
    default: () => {
      return <div>{SITES_LAYOUT_TEXT}</div>
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
describe("Tests for App Router", () => {
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
})