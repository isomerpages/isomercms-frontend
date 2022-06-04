import { LinkOverlay, LinkBox, Divider, Text, Icon } from "@chakra-ui/react"
import { Card, CardBody } from "components/Card"
import { ContextMenuButton, ContextMenuItem } from "components/ContextMenu"
import { BiEditAlt, BiFolder, BiTrash, BiWrench } from "react-icons/bi"
import { Link as RouterLink, useRouteMatch } from "react-router-dom"

interface FolderCardProps {
  title: string
  siteName: string
}

export const FolderCard = ({
  title,
  siteName,
}: FolderCardProps): JSX.Element => {
  const { url } = useRouteMatch()

  return (
    <LinkBox>
      <LinkOverlay as={RouterLink} to={`/sites/${siteName}/folders/${title}`}>
        <Card variant="single">
          <CardBody>
            <Icon as={BiFolder} fontSize="1.5rem" fill="icon.alt" />
            <Text textStyle="subhead-1" color="text.label">
              {title}
            </Text>
          </CardBody>
        </Card>
      </LinkOverlay>
      <ContextMenuButton>
        <ContextMenuItem
          icon={<BiEditAlt />}
          as={RouterLink}
          to={`/sites/${siteName}/folders/${title}`}
        >
          <Text>Edit folder</Text>
        </ContextMenuItem>
        <ContextMenuItem
          icon={<BiWrench />}
          as={RouterLink}
          to={`${url}/editDirectorySettings/${title}`}
        >
          Folder Settings
        </ContextMenuItem>
        <>
          <Divider />
          <ContextMenuItem
            icon={<BiTrash />}
            as={RouterLink}
            to={`${url}/deleteDirectory/${title}`}
          >
            Delete
          </ContextMenuItem>
        </>
      </ContextMenuButton>
    </LinkBox>
  )
}
