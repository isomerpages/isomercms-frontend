import { useState, createContext, ChildContextProvider } from "react"

import { TabSection } from "types/sidebar"

export interface SidebarContextProps {
  selectedTab: TabSection
  setSelectedTab: (tab: TabSection) => void
}

export const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
)

export const SidebarContextProvider = (
  props: ChildContextProvider<SidebarContextProps>
): JSX.Element => {
  const [selectedTab, setSelectedTab] = useState<TabSection>("workspace")
  return (
    <SidebarContext.Provider
      value={{ selectedTab, setSelectedTab }}
      {...props}
    />
  )
}
