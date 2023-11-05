import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbLinkProps,
  BreadcrumbProps as ChakraBreadcrumbProps,
  Icon,
  Text,
} from "@chakra-ui/react"
import { BiChevronRight } from "react-icons/bi"
import { Link as RouterLink } from "react-router-dom"

export interface BreadcrumbItem {
  title: string
  url?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  maxBreadcrumbsLength?: number
  spacing?: ChakraBreadcrumbProps["spacing"]
  textStyle?: BreadcrumbLinkProps["textStyle"]
  isLinked?: boolean
  isLastChildUnderlined?: boolean
}

export const Breadcrumbs = ({
  items,
  maxBreadcrumbsLength = 3,
  spacing = "0.5rem",
  textStyle = "caption-2",
  isLinked = true,
  isLastChildUnderlined = false,
}: BreadcrumbProps): JSX.Element => {
  if (items.length === 0) {
    return <></>
  }

  return (
    <Breadcrumb
      spacing={spacing}
      separator={
        <Icon
          as={BiChevronRight}
          color="interaction.links.neutral-default"
          textStyle={textStyle}
        />
      }
      lineHeight="0.5rem"
    >
      {items.map(({ title, url }, idx) => {
        // Note: Intermediate albums/directories that are beyond the
        // maxBreadcrumbsLength are not shown in the breadcrumbs and will be
        // replaced with an ellipsis
        if (
          items.length > maxBreadcrumbsLength &&
          idx > 1 &&
          idx < items.length - (maxBreadcrumbsLength - 1)
        ) {
          return <></>
        }

        const isEllipsis = items.length > maxBreadcrumbsLength && idx === 1
        const isLastChild = idx === items.length - 1

        return (
          <BreadcrumbItem
            isLastChild={isLastChild}
            isCurrentPage={isLastChild}
            key={title}
          >
            {isLinked ? (
              <BreadcrumbLink
                textStyle={textStyle}
                color={
                  isLastChild
                    ? "base.content.default"
                    : "interaction.links.default"
                }
                textDecoration={
                  isLastChild && isLastChildUnderlined ? "underline" : "inherit"
                }
                as={RouterLink}
                to={isEllipsis ? "" : url}
              >
                {isEllipsis ? "..." : title}
              </BreadcrumbLink>
            ) : (
              <Text
                textStyle={textStyle}
                color="interaction.links.neutral-default"
                textDecoration={
                  isLastChild && isLastChildUnderlined ? "underline" : "inherit"
                }
              >
                {isEllipsis ? "..." : title}
              </Text>
            )}
          </BreadcrumbItem>
        )
      })}
    </Breadcrumb>
  )
}
