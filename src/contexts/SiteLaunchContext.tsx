import { createContext, useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import { useGetSiteLaunchStatus } from "hooks/siteDashboardHooks"

import {
  SiteLaunchDto,
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

function updateSiteLaunchStatusOnApiCall(
  siteLaunchDto: SiteLaunchDto,
  siteLaunchStatusProps: SiteLaunchStatusProps,
  setSiteLaunchStatusProps: (
    siteLaunchStatusProps: SiteLaunchStatusProps
  ) => void
): void {
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
    siteLaunchStatusProps.siteLaunchStatus === siteLaunchDto?.siteStatus
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
}

export const SiteLaunchProvider = ({
  children,
  initialSiteLaunchStatus,
  initialStepNumber,
}: SiteLaunchProviderProps): JSX.Element => {
  const { siteName } = useParams<{ siteName: string }>()

  const [
    siteLaunchStatusProps,
    setSiteLaunchStatusProps,
  ] = useState<SiteLaunchStatusProps>({
    siteLaunchStatus: initialSiteLaunchStatus || "LOADING",
    stepNumber: initialStepNumber || SITE_LAUNCH_TASKS.NOT_STARTED,
  })

  const { data: siteLaunchDto } = useGetSiteLaunchStatus(siteName)

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
      siteLaunchStatusProps.siteLaunchStatus === siteLaunchDto?.siteStatus
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
      }}
    >
      {children}
    </SiteLaunchContext.Provider>
  )
}
