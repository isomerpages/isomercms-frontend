import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react"
import { BiChevronRight } from "react-icons/bi"
import { useRouteMatch, Link as RouterLink } from "react-router-dom"

import { getDecodedParams } from "utils/decoding"

import { ResourceRoomRouteParams } from "types/resources"
import { deslugifyDirectory } from "utils"

export const ResourceBreadcrumb = (): JSX.Element => {
  const { params } = useRouteMatch<ResourceRoomRouteParams>()
  const { siteName, resourceRoomName } = getDecodedParams({ ...params })

  return (
    <Breadcrumb spacing="2px" separator={<BiChevronRight color="text.body" />}>
      <BreadcrumbItem isCurrentPage isLastChild>
        <BreadcrumbLink
          as={RouterLink}
          textStyle="body-2"
          textDecoration="underline"
          to={`/sites/${siteName}/resourceRoom/${resourceRoomName}`}
        >
          {resourceRoomName && deslugifyDirectory(resourceRoomName)}
        </BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  )
}
