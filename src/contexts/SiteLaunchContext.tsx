import { createContext, useContext, useEffect, useState } from "react"
import { useQueryClient } from "react-query"
import { useParams } from "react-router-dom"

import { SITE_DASHBOARD_LAUNCH_STATUS_KEY } from "constants/queryKeys"

import { useGetSiteLaunchStatus } from "hooks/siteDashboardHooks"

import { launchSite } from "services/SiteLaunchService"

import {
  SiteLaunchFrontEndStatus,
  SiteLaunchPageIndex,
  SiteLaunchStatusProps,
  SiteLaunchTaskTypeIndex,
  SITE_LAUNCH_PAGES,
  SITE_LAUNCH_TASKS,
} from "types/siteLaunch"

interface SiteLaunchContextProps {
  siteLaunchStatusProps?: SiteLaunchStatusProps
  setSiteLaunchStatusProps: (
    siteLaunchStatusProps: SiteLaunchStatusProps
  ) => void
  generateDNSRecords: () => void
  refetchSiteLaunchStatus: () => void
  increasePageNumber: () => void
  decreasePageNumber: () => void
  pageNumber: SiteLaunchPageIndex
}

interface SiteLaunchProviderProps {
  children: React.ReactNode
  initialSiteLaunchStatus?: SiteLaunchFrontEndStatus
  initialStepNumber?: SiteLaunchTaskTypeIndex
  isNewDomain?: boolean
}

const SiteLaunchContext = createContext<SiteLaunchContextProps | null>(null)

const getInitialPageNumber = (
  siteLaunchStatusProps: SiteLaunchStatusProps | undefined
) => {
  const hasUserAlreadyStartedChecklistTasks =
    siteLaunchStatusProps?.siteLaunchStatus === "CHECKLIST_TASKS_PENDING"
  if (hasUserAlreadyStartedChecklistTasks) return SITE_LAUNCH_PAGES.CHECKLIST
  const isSiteLaunchInProgress =
    siteLaunchStatusProps?.siteLaunchStatus === "LAUNCHING"
  if (isSiteLaunchInProgress) return SITE_LAUNCH_PAGES.CHECKLIST

  return SITE_LAUNCH_PAGES.DISCLAIMER
}

export const useSiteLaunchContext = (): SiteLaunchContextProps => {
  const SiteLaunchContextData = useContext(SiteLaunchContext)
  if (!SiteLaunchContextData)
    throw new Error("useSiteLaunchContext must be used within an RoleProvider")
  return SiteLaunchContextData
}

export const SiteLaunchProvider = ({
  children,
  initialSiteLaunchStatus,
  initialStepNumber,
  isNewDomain,
}: SiteLaunchProviderProps): JSX.Element => {
  const { siteName } = useParams<{ siteName: string }>()

  const [
    siteLaunchStatusProps,
    setSiteLaunchStatusProps,
  ] = useState<SiteLaunchStatusProps>({
    siteLaunchStatus: initialSiteLaunchStatus || "LOADING",
    stepNumber: initialStepNumber || SITE_LAUNCH_TASKS.NOT_STARTED,
    isNewDomain,
  })

  //! TODO remove this bunch of code after development
  // const [
  //   siteLaunchStatusProps,
  //   setSiteLaunchStatusProps,
  // ] = useState<SiteLaunchStatusProps>({
  //   siteLaunchStatus: "CHECKLIST_TASKS_PENDING",
  //   stepNumber: SITE_LAUNCH_TASKS.NOT_STARTED,
  //   isNewDomain: true,
  //   siteUrl: "isomer.gov.sg",
  //   useWwwSubdomain: true,
  // })

  const { data: siteLaunchDto } = useGetSiteLaunchStatus(siteName)

  const queryClient = useQueryClient()
  const refetchSiteLaunchStatus = () => {
    /**
     * Since the site launch states are held both in FE and BE, we don't want to keep
     * refreshing the state unnecessarily.
     */
    queryClient.invalidateQueries([SITE_DASHBOARD_LAUNCH_STATUS_KEY, siteName])
  }

  const [pageNumber, setPageNumber] = useState<SiteLaunchPageIndex>(
    getInitialPageNumber(siteLaunchStatusProps)
  )

  const increasePageNumber = () => {
    if (pageNumber === SITE_LAUNCH_PAGES.FINAL_STATE) {
      return
    }
    // safe to assert since we do an check prior
    setPageNumber((pageNumber + 1) as SiteLaunchPageIndex)
  }
  const decreasePageNumber = () => {
    if (pageNumber === SITE_LAUNCH_PAGES.DISCLAIMER) {
      return
    }

    // safe to assert since we do an check prior
    setPageNumber((pageNumber - 1) as SiteLaunchPageIndex)
  }

  const generateDNSRecords = async () => {
    if (
      siteLaunchStatusProps.siteUrl &&
      // NOTE: we accept false values, just not undefined
      siteLaunchStatusProps.useWwwSubdomain !== undefined
    ) {
      await launchSite(
        siteName,
        siteLaunchStatusProps.siteUrl,
        siteLaunchStatusProps.useWwwSubdomain
      )
      // Since this API works async, we wait for 2 minutes before refetch
      // invalidate react query key
      setTimeout(() => {
        refetchSiteLaunchStatus()
        //! TODO: change this back to 120000 after local dev
      }, 5000)
    }
  }

  // using a UseEffect to sync the siteLaunchStatusProps with the siteLaunchDto
  // this is needed because the siteLaunchDto is fetched asynchronously
  useEffect(() => {
    if (!siteLaunchDto) return
    if (
      siteLaunchDto.siteLaunchStatus === "NOT_LAUNCHED" &&
      siteLaunchStatusProps.siteLaunchStatus === "LOADING"
    ) {
      setSiteLaunchStatusProps({
        ...siteLaunchStatusProps,
        siteLaunchStatus: "NOT_LAUNCHED",
        stepNumber: 0,
      })
    }
    if (siteLaunchDto.siteLaunchStatus === "NOT_LAUNCHED") {
      return
    }
    // this condition is added to prevent redundant re-renders
    const isSiteLaunchFEAndBESynced =
      siteLaunchStatusProps.siteLaunchStatus ===
        siteLaunchDto?.siteLaunchStatus &&
      siteLaunchStatusProps.dnsRecords === siteLaunchDto?.dnsRecords

    if (!isSiteLaunchFEAndBESynced) {
      setSiteLaunchStatusProps({
        ...siteLaunchStatusProps,
        siteLaunchStatus: siteLaunchDto.siteLaunchStatus,
        dnsRecords: siteLaunchDto.dnsRecords,
      })
    }

    // We don't want to jump to the last screen immediately after the api is called
    if (
      siteLaunchDto.siteLaunchStatus === "LAUNCHING" &&
      !isSiteLaunchFEAndBESynced
    ) {
      setPageNumber(SITE_LAUNCH_PAGES.CHECKLIST)
    }

    if (
      (siteLaunchDto.siteLaunchStatus === "LAUNCHED" ||
        siteLaunchDto.siteLaunchStatus === "FAILED") &&
      !isSiteLaunchFEAndBESynced
    ) {
      setPageNumber(SITE_LAUNCH_PAGES.FINAL_STATE)
    }
  }, [
    siteLaunchDto,
    siteLaunchStatusProps,
    siteLaunchStatusProps.dnsRecords,
    siteLaunchStatusProps.isNewDomain,
    siteLaunchStatusProps.siteLaunchStatus,
  ])

  return (
    <SiteLaunchContext.Provider
      value={{
        siteLaunchStatusProps,
        setSiteLaunchStatusProps,
        generateDNSRecords,
        refetchSiteLaunchStatus,
        increasePageNumber,
        decreasePageNumber,
        pageNumber,
      }}
    >
      {children}
    </SiteLaunchContext.Provider>
  )
}
