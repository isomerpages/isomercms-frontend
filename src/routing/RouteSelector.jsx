import { Banner } from "@opengovsg/design-system-react"
import VerifyUserDetailsModal from "components/VerifyUserDetailsModal"
import { ReactQueryDevtools } from "react-query/devtools"
import { Switch } from "react-router-dom"

// Layouts

import { ReviewRequestRoleProvider } from "contexts/ReviewRequestRoleContext"
import { SiteLaunchProvider } from "contexts/SiteLaunchContext"

import EditContactUs from "layouts/EditContactUs"
import EditHomepage from "layouts/EditHomepage"
import EditNavBar from "layouts/EditNavBar"
import EditPage from "layouts/EditPage"
import { Folders } from "layouts/Folders"
import { LoginPage } from "layouts/Login"
import { Media } from "layouts/Media"
import NotFoundPage from "layouts/NotFoundPage"
import { ResourceCategory } from "layouts/ResourceCategory"
import { ResourceRoom } from "layouts/ResourceRoom"
import { ReviewRequestDashboard } from "layouts/ReviewRequest/Dashboard"
import { Settings } from "layouts/Settings"
import { SiteDashboard } from "layouts/SiteDashboard"
import { Sites } from "layouts/Sites"
import { Workspace } from "layouts/Workspace"

// ProtectedRoute component
import { ProtectedRouteWithProps } from "routing/ProtectedRouteWithProps"
import RedirectIfLoggedInRoute from "routing/RedirectIfLoggedInRoute"

import {
  ApprovedReviewRedirect,
  injectApprovalRedirect,
} from "./ApprovedReviewRedirect"

const { REACT_APP_BANNER_VARIANT: BANNER_VARIANT } = process.env
const { REACT_APP_BANNER_MESSAGE: BANNER_MESSAGE } = process.env

export const RouteSelector = () => (
  <>
    {!!BANNER_MESSAGE && (
      <Banner useMarkdown variant={BANNER_VARIANT}>
        {BANNER_MESSAGE}
      </Banner>
    )}
    <Switch>
      <RedirectIfLoggedInRoute exact path="/" unauthedComponent={LoginPage} />

      <ProtectedRouteWithProps
        exact
        path={[
          "/sites/:siteName/resourceRoom/:resourceRoomName/resourceCategory/:resourceCategoryName/editPage/:fileName",
          "/sites/:siteName/folders/:collectionName/subfolders/:subCollectionName/editPage/:fileName",
          "/sites/:siteName/folders/:collectionName/editPage/:fileName",
          "/sites/:siteName/editPage/:fileName",
        ]}
        component={injectApprovalRedirect(EditPage)}
      />

      <ProtectedRouteWithProps
        path={[
          "/sites/:siteName/folders/:collectionName/subfolders/:subCollectionName",
          "/sites/:siteName/folders/:collectionName",
        ]}
      >
        <ApprovedReviewRedirect>
          <Folders />
        </ApprovedReviewRedirect>
      </ProtectedRouteWithProps>

      <ProtectedRouteWithProps
        exact
        path="/sites/:siteName/navbar"
        component={injectApprovalRedirect(EditNavBar)}
      />

      <ProtectedRouteWithProps
        path={[
          "/sites/:siteName/media/:mediaRoom/mediaDirectory/:mediaDirectoryName",
        ]}
      >
        <ApprovedReviewRedirect>
          <Media />
        </ApprovedReviewRedirect>
      </ProtectedRouteWithProps>

      <ProtectedRouteWithProps path="/sites/:siteName/dashboard">
        <SiteLaunchProvider>
          <SiteDashboard />
        </SiteLaunchProvider>
      </ProtectedRouteWithProps>

      <ProtectedRouteWithProps path="/sites/:siteName/review/:reviewId">
        <ReviewRequestRoleProvider>
          <ReviewRequestDashboard />
        </ReviewRequestRoleProvider>
      </ProtectedRouteWithProps>

      <ProtectedRouteWithProps path="/sites/:siteName/workspace">
        <ApprovedReviewRedirect>
          <Workspace />
        </ApprovedReviewRedirect>
      </ProtectedRouteWithProps>

      <ProtectedRouteWithProps
        path="/sites/:siteName/homepage"
        component={injectApprovalRedirect(EditHomepage)}
      />

      <ProtectedRouteWithProps
        path="/sites/:siteName/contact-us"
        component={injectApprovalRedirect(EditContactUs)}
      />

      <ProtectedRouteWithProps path="/sites/:siteName/resourceRoom/:resourceRoomName/resourceCategory/:resourceCategoryName">
        <ApprovedReviewRedirect>
          <ResourceCategory />
        </ApprovedReviewRedirect>
      </ProtectedRouteWithProps>

      <ProtectedRouteWithProps
        path={[
          "/sites/:siteName/resourceRoom/:resourceRoomName",
          "/sites/:siteName/resourceRoom",
        ]}
      >
        <ApprovedReviewRedirect>
          <ResourceRoom />
        </ApprovedReviewRedirect>
      </ProtectedRouteWithProps>

      <ProtectedRouteWithProps
        path="/sites/:siteName/navbar"
        component={injectApprovalRedirect(EditNavBar)}
      />

      <ProtectedRouteWithProps path="/sites/:siteName/settings">
        <ApprovedReviewRedirect>
          <Settings />
        </ApprovedReviewRedirect>
      </ProtectedRouteWithProps>

      <ProtectedRouteWithProps exact path="/sites" component={Sites} />

      <ProtectedRouteWithProps path="/" component={NotFoundPage} />
    </Switch>
    <VerifyUserDetailsModal />
    {process.env.REACT_APP_ENV === "LOCAL_DEV" && (
      <ReactQueryDevtools initialIsOpen={false} />
    )}
  </>
)
