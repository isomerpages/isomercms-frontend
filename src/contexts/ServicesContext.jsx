import React, { createContext } from "react"

import {
  PageService,
  DirectoryService,
  MoverService,
  ConfigService,
  MediaService,
} from "services"

const ServicesContext = createContext({}) // holds all services we need

const ServicesProvider = ({ client, children }) => {
  const pageService = new PageService({ apiClient: client })
  const directoryService = new DirectoryService({ apiClient: client })
  const moverService = new MoverService({ apiClient: client })
  const configService = new ConfigService({ apiClient: client })
  const mediaService = new MediaService({ apiClient: client })

  const services = {
    pageService,
    directoryService,
    moverService,
    configService,
    mediaService,
  }

  return (
    <ServicesContext.Provider value={services}>
      {children}
    </ServicesContext.Provider>
  )
}

export { ServicesContext, ServicesProvider }
