import * as Sentry from "@sentry/react"
import FallbackComponent from "components/FallbackComponent"
import NotFoundPage from "components/NotFoundPage"
import React from "react"
import { Switch } from "react-router-dom"

// Layouts

import CategoryPages from "layouts/CategoryPages"
import EditContactUs from "layouts/EditContactUs"
import EditHomepage from "layouts/EditHomepage"
import EditNavBar from "layouts/EditNavBar"
import EditPage from "layouts/EditPage"
import EditPageV2 from "layouts/EditPageV2"
import Folders from "layouts/Folders"
import Home from "layouts/Home"
import Media from "layouts/Media"
import ResourceRoom from "layouts/ResourceRoom"
import Settings from "layouts/Settings"
import Sites from "layouts/Sites"
import Workspace from "layouts/Workspace"

// ProtectedRoute component
import ProtectedRoute from "routing/ProtectedRoute"
import RedirectIfLoggedInRoute from "routing/RedirectIfLoggedInRoute"

export const ProtectedRouteWithProps = (props) => {
  return (
    <Sentry.ErrorBoundary fallback={FallbackComponent}>
      <ProtectedRoute {...props} />
    </Sentry.ErrorBoundary>
  )
}

export const RouteSelector = () => (
  <Switch>
    <RedirectIfLoggedInRoute exact path="/" component={Home} />
    <ProtectedRouteWithProps
      exact
      path="/sites/:siteName/folders/:collectionName/subfolders/:subCollectionName/editPage/:fileName"
      component={EditPageV2}
    />
    <ProtectedRouteWithProps
      exact
      path="/sites/:siteName/folders/:collectionName/editPage/:fileName"
      component={EditPageV2}
    />
    <ProtectedRouteWithProps
      exact
      path="/sites/:siteName/editPage/:fileName"
      component={EditPageV2}
    />
    <ProtectedRouteWithProps
      path="/sites/:siteName/folders/:collectionName/subfolders/:subCollectionName"
      component={Folders}
    />
    <ProtectedRouteWithProps
      path="/sites/:siteName/folders/:collectionName"
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
    <ProtectedRouteWithProps // temporary until refactor
      path="/sites/:siteName/resourceRoom/:resourceRoomName/resourceCategory/:resourceName/editPage/:fileName"
      component={EditPage}
      isCollectionPage={false}
      isResourcePage
    />
    <ProtectedRouteWithProps // temporary until refactor
      path="/sites/:siteName/resourceRoom/:resourceRoomName/resourceCategory/:collectionName"
      component={CategoryPages}
      isResource
    />
    <ProtectedRouteWithProps
      path={[
        "/sites/:siteName/resourceRoom/:resourceRoomName",
        "/sites/:siteName/resourceRoom",
      ]}
      component={ResourceRoom}
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
