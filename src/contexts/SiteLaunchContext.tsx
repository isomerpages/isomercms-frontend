import { createContext, useContext, useEffect, useState } from "react"
import { useQueryClient } from "react-query"
import { useParams } from "react-router-dom"

import { SITE_DASHBOARD_LAUNCH_STATUS_KEY } from "constants/queryKeys"

import { useGetSiteLaunchStatus } from "hooks/siteDashboardHooks"

import { launchSite } from "services/SiteLaunchService"

import {
  SiteLaunchBEStatus,
  SiteLaunchFEStatus,
  SiteLaunchFEStatusType,
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
  initialSiteLaunchStatus?: SiteLaunchFEStatusType
  initialStepNumber?: SiteLaunchTaskTypeIndex
  isNewDomain?: boolean
}

const SiteLaunchContext = createContext<SiteLaunchContextProps | null>(null)

const getInitialPageNumber = (
  siteLaunchStatusProps: SiteLaunchStatusProps | undefined
) => {
  const hasUserAlreadyStartedChecklistTasks =
    siteLaunchStatusProps?.siteLaunchStatus ===
    SiteLaunchFEStatus.ChecklistTasksPending
  if (hasUserAlreadyStartedChecklistTasks) return SITE_LAUNCH_PAGES.CHECKLIST
  const isSiteLaunchInProgress =
    siteLaunchStatusProps?.siteLaunchStatus === SiteLaunchFEStatus.Launching
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
    siteLaunchStatus: initialSiteLaunchStatus || SiteLaunchFEStatus.Loading,
    stepNumber: initialStepNumber || SITE_LAUNCH_TASKS.NOT_STARTED,
    isNewDomain,
  })

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
    if (pageNumber >= SITE_LAUNCH_PAGES.FINAL_STATE) {
      return
    }
    // safe to assert since we do an check prior
    setPageNumber((pageNumber + 1) as SiteLaunchPageIndex)
  }
  const decreasePageNumber = () => {
    if (pageNumber <= SITE_LAUNCH_PAGES.DISCLAIMER) {
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
      }, 120000)
    }
  }

  // using a UseEffect to sync the siteLaunchStatusProps with the siteLaunchDto
  // this is needed because the siteLaunchDto is fetched asynchronously
  useEffect(() => {
    if (!siteLaunchDto) return
    if (
      siteLaunchDto.siteLaunchStatus === SiteLaunchBEStatus.NotLaunched &&
      siteLaunchStatusProps.siteLaunchStatus === SiteLaunchFEStatus.Loading
    ) {
      setSiteLaunchStatusProps({
        ...siteLaunchStatusProps,
        siteLaunchStatus: SiteLaunchFEStatus.NotLaunched,
        stepNumber: 0,
      })
    }
    if (siteLaunchDto.siteLaunchStatus === SiteLaunchBEStatus.NotLaunched) {
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
      siteLaunchDto.siteLaunchStatus === SiteLaunchFEStatus.Launching &&
      !isSiteLaunchFEAndBESynced
    ) {
      setPageNumber(SITE_LAUNCH_PAGES.CHECKLIST)
    }

    if (
      (siteLaunchDto.siteLaunchStatus === SiteLaunchBEStatus.Launched ||
        siteLaunchDto.siteLaunchStatus === SiteLaunchBEStatus.Failed) &&
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
