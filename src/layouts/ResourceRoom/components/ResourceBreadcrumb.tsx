// NOTE: As Isomer does not have recursively nested folders at present,

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react"
import { BiChevronRight } from "react-icons/bi"
import { useRouteMatch, Link as RouterLink } from "react-router-dom"

import { getDecodedParams } from "utils/decoding"

import { ResourceRoomRouteParams } from "types/resources"
import { deslugifyDirectory } from "utils"

// NOTE: A folder breadcrumb is dependent solely on whether the sub folder is present
export const ResourceBreadcrumb = (): JSX.Element => {
  const { params } = useRouteMatch<ResourceRoomRouteParams>()
  const { siteName, resourceRoomName } = getDecodedParams({ ...params })

  return (
    <Breadcrumb spacing="2px" separator={<BiChevronRight color="text.body" />}>
      <BreadcrumbItem isCurrentPage isLastChild>
        <BreadcrumbLink
          as={RouterLink}
          textStyle="body-2"
          to={`/sites/${siteName}/resourceRoom/${resourceRoomName}`}
        >
          {resourceRoomName && deslugifyDirectory(resourceRoomName)}
        </BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  )
}
