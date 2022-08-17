import { LinkOverlay, LinkBox, Divider, Text, Icon } from "@chakra-ui/react"
import { Card, CardBody } from "components/Card"
import { ContextMenu } from "components/ContextMenu"
import { BiEditAlt, BiFolder, BiTrash, BiWrench } from "react-icons/bi"
import { Link as RouterLink, useRouteMatch } from "react-router-dom"

import { prettifyPageFileName } from "utils"

interface MediaDirectoryCardProps {
  title: string
}

export const MediaDirectoryCard = ({
  title,
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

  return (
    <Card variant="single">
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
      <ContextMenu>
        <ContextMenu.Button pos="absolute" />
        <ContextMenu.List>
          <ContextMenu.Item
            icon={<BiEditAlt />}
            as={RouterLink}
            to={`/sites/${siteName}/media/${mediaType}/mediaDirectory/${encodedDirectoryPath}`}
          >
            <Text>Edit folder</Text>
          </ContextMenu.Item>
          <ContextMenu.Item
            icon={<BiWrench />}
            as={RouterLink}
            to={`${url}/editDirectorySettings/${encodedDirectoryPath}`}
          >
            Folder settings
          </ContextMenu.Item>
          <>
            <Divider />
            <ContextMenu.Item
              icon={<BiTrash />}
              as={RouterLink}
              to={`${url}/deleteDirectory/${encodedDirectoryPath}`}
            >
              Delete
            </ContextMenu.Item>
          </>
        </ContextMenu.List>
      </ContextMenu>
    </Card>
  )
}
