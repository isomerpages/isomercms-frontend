import {
  LinkOverlay,
  LinkBox,
  Divider,
  Text,
  Icon,
  Box,
  VStack,
  Image,
} from "@chakra-ui/react"
import { Card, CardBody, CardFooter } from "components/Card"
import { ContextMenu } from "components/ContextMenu"
import { BiEditAlt, BiFolder, BiTrash, BiWrench } from "react-icons/bi"
import { Link as RouterLink, useRouteMatch } from "react-router-dom"

import { prettifyPageFileName } from "utils"

interface MediaPreviewCardProps {
  name: string
  mediaUrl: string
}

export const MediaPreviewCard = ({
  name,
  mediaUrl,
}: MediaPreviewCardProps): JSX.Element => {
  const {
    params: { siteName },
    url,
  } = useRouteMatch<{
    siteName: string
    mediaRoom: "files" | "images"
    mediaDirectoryName: string
  }>()

  return (
    <Card variant="multi" flexDir="column">
      <Image
        p="1rem"
        h="168px"
        w="216px"
        src={mediaUrl || "/placeholder_no_image.png"}
      />
      <CardFooter>
        <Text textStyle="subhead-1">{name}</Text>
        <Text textColor="text.helper" textStyle="caption-1">
          elegl
        </Text>
      </CardFooter>
      <ContextMenu>
        <ContextMenu.Button pos="absolute" />
        <ContextMenu.List>
          <ContextMenu.Item
            icon={<BiEditAlt />}
            as={RouterLink}
            to={`/sites/${siteName}/folders/${name}`}
          >
            <Text>Edit folder</Text>
          </ContextMenu.Item>
          <ContextMenu.Item
            icon={<BiWrench />}
            as={RouterLink}
            to={`${url}/editDirectorySettings/${name}`}
          >
            Folder settings
          </ContextMenu.Item>
          <>
            <Divider />
            <ContextMenu.Item
              icon={<BiTrash />}
              as={RouterLink}
              to={`${url}/deleteDirectory/${name}`}
            >
              Delete
            </ContextMenu.Item>
          </>
        </ContextMenu.List>
      </ContextMenu>
    </Card>
  )
}
