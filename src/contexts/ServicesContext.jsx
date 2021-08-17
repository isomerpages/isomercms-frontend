import React, { createContext } from "react"
import { PageService } from "../services"

const ServicesContext = createContext({}) // holds all services we need

const ServicesProvider = ({ client, children }) => {
  const pageService = new PageService({ apiClient: client })

  const services = {
    pageService,
  }

  return (
    <ServicesContext.Provider value={services}>
      {children}
    </ServicesContext.Provider>
  )
}

export { ServicesContext, ServicesProvider }
