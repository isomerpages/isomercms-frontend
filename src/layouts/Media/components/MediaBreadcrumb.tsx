import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react"
import { BiChevronRight } from "react-icons/bi"
import { useRouteMatch, Link as RouterLink } from "react-router-dom"

import { deslugifyDirectory } from "utils"

// NOTE: Media directories are recursively nested;
// However, this nesting is marked by %2F in the url parameter.
// Hence, we have to parse the mediaDirectoryName to get the nesting params.
export const MediaBreadcrumbs = (): JSX.Element => {
  const {
    params: { mediaDirectoryName, siteName, mediaRoom: mediaType },
  } = useRouteMatch<{
    mediaDirectoryName: string
    siteName: string
    mediaRoom: "files" | "images"
  }>()
  const directories = mediaDirectoryName.split("%2F")
  const firstItem = directories[0]

  return (
    <Breadcrumb
      spacing="0.5rem"
      separator={<BiChevronRight color="text.body" />}
    >
      {directories
        .slice(1)
        .reduce(
          (mediaDirectoriesInfo, currentMediaDirectoryInfo) => {
            const prev = mediaDirectoriesInfo[mediaDirectoriesInfo.length - 1]
            const directoryUrl = `${prev.url}%2F${currentMediaDirectoryInfo}`
            const displayedDirectoryName = deslugifyDirectory(
              currentMediaDirectoryInfo
            )
            return [
              ...mediaDirectoriesInfo,
              {
                name: displayedDirectoryName,
                url: directoryUrl,
              },
            ]
          },
          [
            {
              name: deslugifyDirectory(firstItem),
              url: `/sites/${siteName}/media/${mediaType}/mediaDirectory/${firstItem}`,
            },
          ]
        )
        .map(({ name, url }, idx) => {
          if (
            directories.length > 3 &&
            idx > 1 &&
            idx < directories.length - 2
          ) {
            return <></>
          }

          const isEllipsis = directories.length > 3 && idx === 1
          const hasModifier = idx === directories.length - 1 || isEllipsis

          return (
            <BreadcrumbItem
              isLastChild={hasModifier}
              isCurrentPage={hasModifier}
            >
              <BreadcrumbLink
                textStyle="caption-2"
                color={
                  hasModifier
                    ? "base.content.default"
                    : "interaction.links.default"
                }
                as={RouterLink}
                to={isEllipsis ? "#" : url}
              >
                {isEllipsis ? "..." : name}
              </BreadcrumbLink>
            </BreadcrumbItem>
          )
        })}
    </Breadcrumb>
  )
}
