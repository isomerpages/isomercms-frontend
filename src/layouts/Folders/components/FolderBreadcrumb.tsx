// NOTE: As Isomer does not have recursively nested folders at present,

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Text,
} from "@chakra-ui/react"
import { BiChevronRight } from "react-icons/bi"
import { useRouteMatch, Link as RouterLink } from "react-router-dom"

import { getDecodedParams } from "utils/decoding"

import { deslugifyDirectory } from "utils"

interface FolderUrlParams {
  siteName: string
  collectionName: string
  subCollectionName?: string
}

// NOTE: A folder breadcrumb is dependent solely on whether the sub folder is present
export const FolderBreadcrumbs = (): JSX.Element => {
  const { params } = useRouteMatch<FolderUrlParams>()
  const { siteName, collectionName, subCollectionName } = getDecodedParams({
    ...params,
  })
  const breadcrumbItems = [
    {
      name: collectionName,
      to: `/sites/${siteName}/folders/${collectionName}`,
    },
    {
      name: subCollectionName,
      to: `/sites/${siteName}/folders/${collectionName}/subfolders/${subCollectionName}`,
    },
  ].filter(({ name }) => !!name)

  return (
    <Breadcrumb spacing="2px" separator={<BiChevronRight color="text.body" />}>
      <BreadcrumbItem>
        <BreadcrumbLink as={RouterLink} to={`/sites/${siteName}/workspace`}>
          <Text textStyle="body-2" color="text.body">
            My Workspace
          </Text>
        </BreadcrumbLink>
      </BreadcrumbItem>
      {breadcrumbItems.map(({ name, to }, idx) => {
        const hasModifier = idx === breadcrumbItems.length - 1
        return (
          <BreadcrumbItem isLastChild={hasModifier} isCurrentPage={hasModifier}>
            <BreadcrumbLink as={RouterLink} to={to}>
              <Text
                textStyle="body-2"
                color="text.body"
                // NOTE: If it's the last child (and the current page), the breadcrumb item
                // should have an underline. Otherwise, default to chakra's underlying HTML element (p tag)
                as={hasModifier ? "u" : "p"}
              >
                {deslugifyDirectory(name)}
              </Text>
            </BreadcrumbLink>
          </BreadcrumbItem>
        )
      })}
    </Breadcrumb>
  )
}
