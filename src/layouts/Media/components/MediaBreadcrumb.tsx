import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react"
import { BiChevronRight } from "react-icons/bi"
import { useRouteMatch, Link as RouterLink } from "react-router-dom"

import { MAX_MEDIA_BREADCRUMBS_LENGTH } from "constants/media"

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
          // Note: Intermediate albums/directories are not shown in the breadcrumbs
          // but it only affects users that are nesting more than
          // MAX_MEDIA_BREADCRUMBS_LENGTH levels deep
          if (
            directories.length > MAX_MEDIA_BREADCRUMBS_LENGTH &&
            idx > 1 &&
            idx < directories.length - (MAX_MEDIA_BREADCRUMBS_LENGTH - 1)
          ) {
            return <></>
          }

          const isEllipsis =
            directories.length > MAX_MEDIA_BREADCRUMBS_LENGTH && idx === 1
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
                noOfLines={1}
              >
                {isEllipsis ? "..." : name}
              </BreadcrumbLink>
            </BreadcrumbItem>
          )
        })}
    </Breadcrumb>
  )
}
