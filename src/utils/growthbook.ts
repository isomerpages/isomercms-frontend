import { GrowthBook } from "@growthbook/growthbook-react"

const GROWTHBOOK_API_HOST = "https://cdn.growthbook.io"

export const getGrowthBookInstance = (clientKey: string) => {
  return new GrowthBook({
    apiHost: GROWTHBOOK_API_HOST,
    clientKey,
    enableDevMode: true, // TODO:remove for prod
  })
}
