import { useContext } from "react"

import { SidebarContextProps, SidebarContext } from "contexts/SidebarContext"

export const useSidebarContext = (): SidebarContextProps => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error(
      "useSidebarContext must be called within a sidebar provider!"
    )
  }

  return context
}
