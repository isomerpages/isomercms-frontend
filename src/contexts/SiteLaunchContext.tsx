import { createContext, useContext, useEffect, useState } from "react"
import { useQueryClient } from "react-query"
import { useParams } from "react-router-dom"

import { SITE_DASHBOARD_LAUNCH_STATUS_KEY } from "constants/queryKeys"

import { useGetSiteLaunchStatus } from "hooks/siteDashboardHooks"

import { launchSite } from "services/SiteLaunchService"

import {
  SiteLaunchFrontEndStatus,
  SiteLaunchStatusProps,
  SiteLaunchTaskTypeIndex,
  SITE_LAUNCH_TASKS,
  SITE_LAUNCH_TASKS_LENGTH,
} from "types/siteLaunch"

interface SiteLaunchContextProps {
  siteLaunchStatusProps?: SiteLaunchStatusProps
  setSiteLaunchStatusProps: (
    siteLaunchStatusProps: SiteLaunchStatusProps
  ) => void
  generateDNSRecords: () => void
  refetchSiteLaunchStatus: () => void
  isSiteLaunchBlockedModalOpen: boolean
  setIsSiteLaunchBlockedModalOpen: (isOpen: boolean) => void
}

interface SiteLaunchProviderProps {
  children: React.ReactNode
  initialSiteLaunchStatus?: SiteLaunchFrontEndStatus
  initialStepNumber?: SiteLaunchTaskTypeIndex
}

const SiteLaunchContext = createContext<SiteLaunchContextProps | null>(null)

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
}: SiteLaunchProviderProps): JSX.Element => {
  const { siteName } = useParams<{ siteName: string }>()
  const [
    isSiteLaunchBlockedModalOpen,
    setIsSiteLaunchBlockedModalOpen,
  ] = useState<boolean>(false)
  const [
    siteLaunchStatusProps,
    setSiteLaunchStatusProps,
  ] = useState<SiteLaunchStatusProps>({
    siteLaunchStatus: initialSiteLaunchStatus || "LOADING",
    stepNumber: initialStepNumber || SITE_LAUNCH_TASKS.NOT_STARTED,
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
      siteLaunchDto.siteStatus === "NOT_LAUNCHED" &&
      siteLaunchStatusProps.siteLaunchStatus === "LOADING"
    ) {
      setSiteLaunchStatusProps({
        siteLaunchStatus: "NOT_LAUNCHED",
        stepNumber: 0,
      })
    }
    // this condition is added to prevent redundant re-renders
    const isSiteLaunchFEAndBESynced =
      siteLaunchStatusProps.siteLaunchStatus === siteLaunchDto?.siteStatus &&
      siteLaunchStatusProps.dnsRecords === siteLaunchDto?.dnsRecords
    if (
      (siteLaunchDto.siteStatus === "LAUNCHED" ||
        siteLaunchDto.siteStatus === "LAUNCHING") &&
      !isSiteLaunchFEAndBESynced
    ) {
      setSiteLaunchStatusProps({
        siteLaunchStatus: siteLaunchDto.siteStatus,
        stepNumber: SITE_LAUNCH_TASKS_LENGTH,
        dnsRecords: siteLaunchDto.dnsRecords,
      })
    }
  }, [siteLaunchDto, siteLaunchStatusProps.siteLaunchStatus])

  return (
    <SiteLaunchContext.Provider
      value={{
        siteLaunchStatusProps,
        setSiteLaunchStatusProps,
        generateDNSRecords,
        refetchSiteLaunchStatus,
        isSiteLaunchBlockedModalOpen,
        setIsSiteLaunchBlockedModalOpen,
      }}
    >
      {children}
    </SiteLaunchContext.Provider>
  )
}
