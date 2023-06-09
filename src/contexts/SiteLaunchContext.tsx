import { createContext, useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import { useGetSiteLaunchStatus } from "hooks/siteDashboardHooks"

import {
  SiteLaunchDto,
  SiteLaunchFrontEndStatus,
  SiteLaunchStatusProps,
  SITE_LAUNCH_TASKS_LENGTH,
} from "types/siteLaunch"

interface SiteLaunchContextProps {
  siteLaunchStatusProps: SiteLaunchStatusProps
  setSiteLaunchStatusProps: (
    siteLaunchStatusProps: SiteLaunchStatusProps
  ) => void
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
  initialSiteLaunchStatus = "NOT_LAUNCHED",
  initialStepNumber = 0,
}: {
  children: React.ReactNode
  initialSiteLaunchStatus?: SiteLaunchFrontEndStatus
  initialStepNumber?: number
}): JSX.Element => {
  const { siteName } = useParams<{ siteName: string }>()

  const [
    siteLaunchStatusProps,
    setSiteLaunchStatusProps,
  ] = useState<SiteLaunchStatusProps>({
    siteLaunchStatus: initialSiteLaunchStatus,
    stepNumber: initialStepNumber,
  })
  const { data: siteLaunchDto } = useGetSiteLaunchStatus(siteName)
  const { siteStatus: siteStatusDto, stepNumber: stepNumberDto } =
    siteLaunchDto ||
    ({
      siteStatus: "NOT_LAUNCHED", // defaulting to not launched
      stepNumber: 0,
    } as SiteLaunchDto)
  useEffect(() => {
    if (siteStatusDto === "LAUNCHED" || siteStatusDto === "LAUNCHING") {
      setSiteLaunchStatusProps({
        ...siteLaunchStatusProps,
        siteLaunchStatus: siteStatusDto,
        stepNumber: SITE_LAUNCH_TASKS_LENGTH,
        dnsRecords: siteLaunchDto?.dnsRecords,
      })
      return
    }
    if (
      siteStatusDto !== "NOT_LAUNCHED" &&
      siteLaunchStatusProps.siteLaunchStatus !== "NOT_LAUNCHED"
    ) {
      setSiteLaunchStatusProps({
        ...siteLaunchStatusProps,
        siteLaunchStatus: siteStatusDto,
        stepNumber: stepNumberDto,
      })
    }
  }, [siteLaunchDto, siteLaunchStatusProps, siteStatusDto, stepNumberDto])

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
