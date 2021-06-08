import React from "react"
import { Switch } from "react-router-dom"

import * as Sentry from "@sentry/react"

import FallbackComponent from "@components/FallbackComponent"
import NotFoundPage from "@components/NotFoundPage"

import CategoryPages from "@layouts/CategoryPages"
import EditContactUs from "@layouts/EditContactUs"
import EditHomepage from "@layouts/EditHomepage"
import EditNavBar from "@layouts/EditNavBar"
import EditPage from "@layouts/EditPage"
import Folders from "@layouts/Folders"
import Home from "@layouts/Home"
import Media from "@layouts/Media"
import Resources from "@layouts/Resources"
import Settings from "@layouts/Settings"
import Sites from "@layouts/Sites"
import Workspace from "@layouts/Workspace"

import ProtectedRoute from "@routing/ProtectedRoute"
import RedirectIfLoggedInRoute from "@routing/RedirectIfLoggedInRoute"

const ProtectedRouteWithProps = (props) => (
  <Sentry.ErrorBoundary fallback={FallbackComponent}>
    <ProtectedRoute {...props} />
  </Sentry.ErrorBoundary>
)

export const RouteSelector = () => (
  <Switch>
    <RedirectIfLoggedInRoute exact path="/" component={Home} />
    <ProtectedRouteWithProps
      exact
      path="/sites/:siteName/folder/:folderName/subfolder/:subfolderName/:fileName"
      component={EditPage}
      isCollectionPage
      isResourcePage={false}
    />
    <ProtectedRouteWithProps
      exact
      path="/sites/:siteName/folder/:folderName/:fileName"
      component={EditPage}
      isCollectionPage
      isResourcePage={false}
    />
    <ProtectedRouteWithProps
      exact
      path="/sites/:siteName/folder/:folderName"
      component={Folders}
    />
    <ProtectedRouteWithProps
      exact
      path="/sites/:siteName/folder/:folderName/subfolder/:subfolderName"
      component={Folders}
    />
    <ProtectedRouteWithProps
      exact
      path="/sites/:siteName/navbar"
      component={EditNavBar}
    />
    <ProtectedRouteWithProps
      path="/sites/:siteName/documents/:customPath"
      component={Media}
      mediaType="documents"
    />
    <ProtectedRouteWithProps
      path="/sites/:siteName/documents"
      component={Media}
      mediaType="documents"
    />
    <ProtectedRouteWithProps
      path="/sites/:siteName/images/:customPath"
      component={Media}
      mediaType="images"
    />
    <ProtectedRouteWithProps
      path="/sites/:siteName/images"
      component={Media}
      mediaType="images"
    />
    <ProtectedRouteWithProps
      path="/sites/:siteName/pages/:fileName"
      component={EditPage}
      isCollectionPage={false}
      isResourcePage={false}
    />
    <ProtectedRouteWithProps
      path="/sites/:siteName/workspace"
      component={Workspace}
    />
    <ProtectedRouteWithProps
      path="/sites/:siteName/homepage"
      component={EditHomepage}
    />
    <ProtectedRouteWithProps
      path="/sites/:siteName/contact-us"
      component={EditContactUs}
    />
    <ProtectedRouteWithProps
      path="/sites/:siteName/resources/:resourceName/:fileName"
      component={EditPage}
      isCollectionPage={false}
      isResourcePage
    />
    <ProtectedRouteWithProps
      path="/sites/:siteName/resources/:collectionName"
      component={CategoryPages}
      isResource
    />
    <ProtectedRouteWithProps
      path="/sites/:siteName/resources"
      component={Resources}
    />
    <ProtectedRouteWithProps
      path="/sites/:siteName/navbar"
      component={EditNavBar}
    />
    <ProtectedRouteWithProps
      path="/sites/:siteName/settings"
      component={Settings}
    />
    <ProtectedRouteWithProps exact path="/sites" component={Sites} />
    <ProtectedRouteWithProps path="/" component={NotFoundPage} />
  </Switch>
)
