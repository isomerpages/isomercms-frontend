import React from "react"
import * as Sentry from "@sentry/react"
import { Switch } from "react-router-dom"

// Layouts
import Home from "../layouts/Home"
import Sites from "../layouts/Sites"
import Workspace from "../layouts/Workspace"
import Folders from "../layouts/Folders"
import EditPage from "../layouts/EditPage"
import EditPageV2 from "../layouts/EditPageV2"
import CategoryPages from "../layouts/CategoryPages"
import Media from "../layouts/Media"
import EditHomepage from "../layouts/EditHomepage"
import EditContactUs from "../layouts/EditContactUs"
import Resources from "../layouts/Resources"
import EditNavBar from "../layouts/EditNavBar"
import Settings from "../layouts/Settings"
import NotFoundPage from "../components/NotFoundPage"
import FallbackComponent from "../components/FallbackComponent"

// ProtectedRoute component
import ProtectedRoute from "./ProtectedRoute"
import RedirectIfLoggedInRoute from "./RedirectIfLoggedInRoute"

const ProtectedRouteWithProps = (props) => {
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
      path="/sites/:siteName/folder/:folderName/subfolder/:subfolderName/:fileName"
      component={EditPageV2}
      isCollectionPage
      isResourcePage={false}
    />
    <ProtectedRouteWithProps
      exact
      path="/sites/:siteName/folder/:folderName/:fileName"
      component={EditPageV2}
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
