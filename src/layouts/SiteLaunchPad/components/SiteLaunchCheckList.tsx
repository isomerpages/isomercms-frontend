/* eslint-disable react/jsx-props-no-spreading */

import { useSiteLaunchContext } from "contexts/SiteLaunchContext"

import { SiteLaunchPadBody } from "./SiteLaunchPadBody"
import { SiteLaunchPadTitle } from "./SiteLaunchPadTitle"

export const SiteLaunchChecklistTitle = (): JSX.Element => {
  const title = "Complete these tasks to launch"
  const subTitle =
    "The following list has been generated based on information provided on your domain"
  return <SiteLaunchPadTitle title={title} subTitle={subTitle} />
}

export const SiteLaunchChecklistBody = (): JSX.Element => {
  const {
    siteLaunchStatusProps,
    setSiteLaunchStatusProps,
  } = useSiteLaunchContext()
  // todo site launch pad checklist table
  return <SiteLaunchPadBody />
}
