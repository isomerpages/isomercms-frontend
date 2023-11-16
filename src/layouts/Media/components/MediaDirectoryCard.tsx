import { LinkOverlay, LinkBox, Text, Icon } from "@chakra-ui/react"
import { BiEdit, BiFolder, BiTrash } from "react-icons/bi"
import { Link as RouterLink, useRouteMatch } from "react-router-dom"

import { Card, CardBody } from "components/Card"
import { ContextMenu } from "components/ContextMenu"

import { getMediaLabels } from "utils/media"

import { prettifyPageFileName } from "utils"

interface MediaDirectoryCardProps {
  title: string
  onClick?: () => void
  isMenuNeeded?: boolean
}

export const MediaDirectoryCard = ({
  title,
  onClick,
  isMenuNeeded = true,
}: MediaDirectoryCardProps): JSX.Element => {
  const {
    params: { siteName, mediaRoom: mediaType, mediaDirectoryName },
    url,
  } = useRouteMatch<{
    siteName: string
    mediaRoom: "files" | "images"
    mediaDirectoryName: string
  }>()
  const encodedDirectoryPath = `${mediaDirectoryName}%2F${encodeURIComponent(
    title
  )}`
  const { singularDirectoryLabel } = getMediaLabels(mediaType)

  return (
    <Card
      variant="single"
      onClick={(e) => {
        if (onClick) {
          e.preventDefault()
          onClick()
        }
      }}
    >
      {onClick ? (
        <CardBody>
          <Icon as={BiFolder} fontSize="1.5rem" fill="icon.alt" />
          <Text textStyle="subhead-1" color="text.label" noOfLines={1}>
            {prettifyPageFileName(title)}
          </Text>
        </CardBody>
      ) : (
        <LinkBox position="relative">
          <LinkOverlay
            as={RouterLink}
            to={`/sites/${siteName}/media/${mediaType}/mediaDirectory/${encodedDirectoryPath}`}
          >
            <CardBody>
              <Icon as={BiFolder} fontSize="1.5rem" fill="icon.alt" />
              <Text textStyle="subhead-1" color="text.label" noOfLines={1}>
                {prettifyPageFileName(title)}
              </Text>
            </CardBody>
          </LinkOverlay>
        </LinkBox>
      )}
      {isMenuNeeded && (
        <ContextMenu>
          <ContextMenu.Button pos="absolute" />
          <ContextMenu.List>
            <ContextMenu.Item
              icon={<BiEdit />}
              as={RouterLink}
              to={`${url}/editDirectorySettings/${encodedDirectoryPath}`}
            >
              Rename {singularDirectoryLabel}
            </ContextMenu.Item>
            <>
              <ContextMenu.Item
                icon={<BiTrash />}
                as={RouterLink}
                to={`${url}/deleteDirectory/${encodedDirectoryPath}`}
                color="text.danger"
              >
                Delete {singularDirectoryLabel}
              </ContextMenu.Item>
            </>
          </ContextMenu.List>
        </ContextMenu>
      )}
    </Card>
  )
}
