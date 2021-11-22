import React, { createContext } from "react"
import {
  PageService,
  DirectoryService,
  MoverService,
  SettingsService,
} from "services"

const ServicesContext = createContext({}) // holds all services we need

const ServicesProvider = ({ client, children }) => {
  const pageService = new PageService({ apiClient: client })
  const directoryService = new DirectoryService({ apiClient: client })
  const moverService = new MoverService({ apiClient: client })
  const settingsService = new SettingsService({ apiClient: client })

  const services = {
    pageService,
    directoryService,
    moverService,
    settingsService,
  }

  return (
    <ServicesContext.Provider value={services}>
      {children}
    </ServicesContext.Provider>
  )
}

export { ServicesContext, ServicesProvider }
