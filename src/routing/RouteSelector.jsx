import * as Sentry from "@sentry/react"
import FallbackComponent from "components/FallbackComponent"
import VerifyUserDetailsModal from "components/VerifyUserDetailsModal"
import React from "react"
import { Switch } from "react-router-dom"

// Layouts

import EditContactUs from "layouts/EditContactUs"
import EditHomepage from "layouts/EditHomepage"
import EditNavBar from "layouts/EditNavBar"
import EditPage from "layouts/EditPage"
import Folders from "layouts/Folders"
import Home from "layouts/Home"
import Media from "layouts/Media"
import NotFoundPage from "layouts/NotFoundPage"
import ResourceCategory from "layouts/ResourceCategory"
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
  <>
    <Switch>
      <RedirectIfLoggedInRoute exact path="/" component={Home} />
      <ProtectedRouteWithProps
        exact
        path={[
          "/sites/:siteName/resourceRoom/:resourceRoomName/resourceCategory/:resourceCategoryName/editPage/:fileName",
          "/sites/:siteName/folders/:collectionName/subfolders/:subCollectionName/editPage/:fileName",
          "/sites/:siteName/folders/:collectionName/editPage/:fileName",
          "/sites/:siteName/editPage/:fileName",
        ]}
        component={EditPage}
      />
      <ProtectedRouteWithProps
        path={[
          "/sites/:siteName/folders/:collectionName/subfolders/:subCollectionName",
          "/sites/:siteName/folders/:collectionName",
        ]}
        component={Folders}
      />
      <ProtectedRouteWithProps
        exact
        path="/sites/:siteName/navbar"
        component={EditNavBar}
      />
      <ProtectedRouteWithProps
        path={[
          "/sites/:siteName/media/:mediaRoom/mediaDirectory/:mediaDirectoryName",
        ]}
        component={Media}
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
        path="/sites/:siteName/resourceRoom/:resourceRoomName/resourceCategory/:resourceCategoryName"
        component={ResourceCategory}
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
    <VerifyUserDetailsModal />
  </>
)
