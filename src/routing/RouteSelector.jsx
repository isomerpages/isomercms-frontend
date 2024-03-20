import { useFeatureIsOn, useFeatureValue } from "@growthbook/growthbook-react"
import { Banner } from "@opengovsg/design-system-react"
import { ReactQueryDevtools } from "react-query/devtools"
import { Switch } from "react-router-dom"

import VerifyUserDetailsModal from "components/VerifyUserDetailsModal"

// Layouts

import { FEATURE_FLAGS } from "constants/featureFlags"

import { ReviewRequestRoleProvider } from "contexts/ReviewRequestRoleContext"
import { SiteLaunchProvider } from "contexts/SiteLaunchContext"

import EditContactUs from "layouts/EditContactUs"
import EditHomepage from "layouts/EditHomepage"
import EditNavBar from "layouts/EditNavBar"
import { EditPage } from "layouts/EditPage/index"
import { Folders } from "layouts/Folders"
import { LinksReport } from "layouts/LinkReport/LinksReport"
import { LoginPage } from "layouts/Login"
import { SgidLoginCallbackPage } from "layouts/Login/SgidLoginCallbackPage"
import { Media } from "layouts/Media"
import { NotFoundPage } from "layouts/NotFoundPage"
import { ResourceCategory } from "layouts/ResourceCategory"
import { ResourceRoom } from "layouts/ResourceRoom"
import { ReviewRequestDashboard } from "layouts/ReviewRequest/Dashboard"
import { Settings } from "layouts/Settings"
import { SiteDashboard } from "layouts/SiteDashboard"
import { SiteLaunchPadPage } from "layouts/SiteLaunchPad"
import { Sites } from "layouts/Sites"
import { Workspace } from "layouts/Workspace"

// ProtectedRoute component
import { ProtectedRouteWithProps } from "routing/ProtectedRouteWithProps"
import RedirectIfLoggedInRoute from "routing/RedirectIfLoggedInRoute"

import { specialCharactersRegexTest } from "utils"

import {
  ApprovedReviewRedirect,
  injectApprovalRedirect,
} from "./ApprovedReviewRedirect"

export const RouteSelector = () => {
  const isBannerOn = useFeatureIsOn(FEATURE_FLAGS.BANNER)
  const bannerParams = useFeatureValue(FEATURE_FLAGS.BANNER)
  return (
    <>
      {isBannerOn && (
        <Banner useMarkdown variant={bannerParams.variant}>
          {bannerParams.message}
        </Banner>
      )}
      <Switch>
        <RedirectIfLoggedInRoute
          exact
          path={["/"]}
          unauthedComponent={LoginPage}
        />

        <RedirectIfLoggedInRoute
          exact
          path="/sgid-callback"
          unauthedComponent={SgidLoginCallbackPage}
        />

        <ProtectedRouteWithProps
          exact
          path={[
            "/sites/:siteName([a-zA-Z0-9-]+)/resourceRoom/:resourceRoomName([a-zA-Z0-9-]+)/resourceCategory/:resourceCategoryName([a-zA-Z0-9-]+)/editPage/:fileName",
            "/sites/:siteName([a-zA-Z0-9-]+)/folders/:collectionName([a-zA-Z0-9-]+)/subfolders/:subCollectionName/editPage/:fileName",
            "/sites/:siteName([a-zA-Z0-9-]+)/folders/:collectionName([a-zA-Z0-9-]+)/editPage/:fileName",
            "/sites/:siteName([a-zA-Z0-9-]+)/editPage/:fileName",
          ]}
          component={injectApprovalRedirect(EditPage)}
          validate={{
            fileName: (value) => {
              const encodedName = value.split(".").slice(0, -1).join(".")
              const decodedName = decodeURIComponent(encodedName)
              return (
                value === "terms-of-use.md" ||
                !specialCharactersRegexTest.test(decodedName)
              )
            },
            subCollectionName: (value) => {
              return !specialCharactersRegexTest.test(decodeURIComponent(value))
            },
          }}
        />

        <ProtectedRouteWithProps
          path={[
            "/sites/:siteName([a-zA-Z0-9-]+)/folders/:collectionName([a-zA-Z0-9-]+)/subfolders/:subCollectionName",
            "/sites/:siteName([a-zA-Z0-9-]+)/folders/:collectionName([a-zA-Z0-9-]+)",
          ]}
          validate={{
            subCollectionName: (value) => {
              return !specialCharactersRegexTest.test(decodeURIComponent(value))
            },
          }}
        >
          <ApprovedReviewRedirect>
            <Folders />
          </ApprovedReviewRedirect>
        </ProtectedRouteWithProps>

        <ProtectedRouteWithProps
          exact
          path="/sites/:siteName([a-zA-Z0-9-]+)/navbar"
          component={injectApprovalRedirect(EditNavBar)}
        />

        <ProtectedRouteWithProps
          path={[
            "/sites/:siteName([a-zA-Z0-9-]+)/media/:mediaRoom(images|files)/mediaDirectory/:mediaDirectoryName",
          ]}
          validate={{
            mediaDirectoryName: (value) => {
              // NOTE: This value is prepended with either `files|images`
              // and nested directories are separated by `/` as well.
              const decodedValues = decodeURIComponent(value).split("/")
              return decodedValues.every(
                (val) => !specialCharactersRegexTest.test(val)
              )
            },
          }}
        >
          <ApprovedReviewRedirect>
            <Media />
          </ApprovedReviewRedirect>
        </ProtectedRouteWithProps>

        <ProtectedRouteWithProps path="/sites/:siteName([a-zA-Z0-9-]+)/dashboard">
          <SiteLaunchProvider>
            <SiteDashboard />
          </SiteLaunchProvider>
        </ProtectedRouteWithProps>

        <ProtectedRouteWithProps path="/sites/:siteName([a-zA-Z0-9-]+)/linkCheckerReport">
          <SiteLaunchProvider>
            <LinksReport />
          </SiteLaunchProvider>
        </ProtectedRouteWithProps>

        <ProtectedRouteWithProps path="/sites/:siteName([a-zA-Z0-9-]+)/siteLaunchPad">
          <SiteLaunchProvider>
            <SiteLaunchPadPage />
          </SiteLaunchProvider>
        </ProtectedRouteWithProps>

        <ProtectedRouteWithProps path="/sites/:siteName([a-zA-Z0-9-]+)/review/:reviewId([0-9]+)">
          <ReviewRequestRoleProvider>
            <ReviewRequestDashboard />
          </ReviewRequestRoleProvider>
        </ProtectedRouteWithProps>

        <ProtectedRouteWithProps path="/sites/:siteName([a-zA-Z0-9-]+)/workspace">
          <ApprovedReviewRedirect>
            <Workspace />
          </ApprovedReviewRedirect>
        </ProtectedRouteWithProps>

        <ProtectedRouteWithProps
          path="/sites/:siteName([a-zA-Z0-9-]+)/homepage"
          component={injectApprovalRedirect(EditHomepage)}
        />

        <ProtectedRouteWithProps
          path="/sites/:siteName([a-zA-Z0-9-]+)/contact-us"
          component={injectApprovalRedirect(EditContactUs)}
        />

        <ProtectedRouteWithProps path="/sites/:siteName([a-zA-Z0-9-]+)/resourceRoom/:resourceRoomName([a-zA-Z0-9-]+)/resourceCategory/:resourceCategoryName([a-zA-Z0-9-]+)">
          <ApprovedReviewRedirect>
            <ResourceCategory />
          </ApprovedReviewRedirect>
        </ProtectedRouteWithProps>

        <ProtectedRouteWithProps
          path={[
            "/sites/:siteName([a-zA-Z0-9-]+)/resourceRoom/:resourceRoomName([a-zA-Z0-9-]+)",
            "/sites/:siteName([a-zA-Z0-9-]+)/resourceRoom",
          ]}
        >
          <ApprovedReviewRedirect>
            <ResourceRoom />
          </ApprovedReviewRedirect>
        </ProtectedRouteWithProps>

        <ProtectedRouteWithProps path="/sites/:siteName([a-zA-Z0-9-]+)/settings">
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
}
