import {
  chakra,
  LinkOverlay,
  LinkBox,
  Divider,
  HStack,
  Icon,
  Text,
  Box,
} from "@chakra-ui/react"
import { ContextMenu } from "components/ContextMenu"
import { useMemo } from "react"
import {
  BiChevronRight,
  BiEditAlt,
  BiFolder,
  BiTrash,
  BiWrench,
} from "react-icons/bi"
import { Link as RouterLink, useRouteMatch } from "react-router-dom"

import elementStyles from "styles/isomer-cms/Elements.module.scss"
import contentStyles from "styles/isomer-cms/pages/Content.module.scss"

import { pageFileNameToTitle } from "utils"

// Import styles

const FolderItem = ({ item, isDisabled }) => {
  const { url } = useRouteMatch()

  const { name, type, children } = item
  const encodedName = encodeURIComponent(name)

  const generatedLink = useMemo(() => {
    return type === "dir"
      ? `${url}/subfolders/${encodedName}`
      : `${url}/editPage/${encodedName}`
  }, [encodedName, type, url])

  return (
    <Box
      w="100%"
      className={`${contentStyles.component} ${contentStyles.card}`}
      position="relative"
    >
      <LinkBox w="100%">
        <LinkOverlay as={RouterLink} to={!isDisabled && generatedLink}>
          <chakra.button
            className={`${elementStyles.card} ${contentStyles.card} ${elementStyles.folderItem}`}
          >
            <div className={contentStyles.contentContainerFolderRow}>
              {type === "file" ? (
                <i
                  className={`bx bxs-file-blank ${elementStyles.folderItemIcon}`}
                />
              ) : (
                <i
                  className={`bx bxs-folder ${elementStyles.folderItemIcon}`}
                />
              )}
              <span className={`${elementStyles.folderItemText} mr-auto`}>
                {pageFileNameToTitle(name)}
              </span>
              {children ? (
                <span className={`${elementStyles.folderItemText} mr-5`}>
                  {children.length} item{children.length === 1 ? "" : "s"}
                </span>
              ) : null}
            </div>
          </chakra.button>
        </LinkOverlay>
      </LinkBox>
      {!isDisabled && (
        <ContextMenu>
          <ContextMenu.Button right="1.875rem" bottom="1.875rem" />
          <ContextMenu.List>
            <ContextMenu.Item
              icon={<BiEditAlt />}
              as={RouterLink}
              to={generatedLink}
            >
              <Text>Edit</Text>
            </ContextMenu.Item>
            <ContextMenu.Item
              icon={<BiWrench />}
              as={RouterLink}
              to={
                type === "dir"
                  ? `${url}/editDirectorySettings/${encodedName}`
                  : `${url}/editPageSettings/${encodedName}`
              }
            >
              Settings
            </ContextMenu.Item>
            {type !== "dir" && (
              <ContextMenu.Item
                icon={<BiFolder />}
                as={RouterLink}
                to={`${url}/movePage/${encodedName}`}
              >
                <HStack spacing="4rem" alignItems="center">
                  <Text>Move to</Text>
                  <Icon as={BiChevronRight} fontSize="1.25rem" />
                </HStack>
              </ContextMenu.Item>
            )}
            <>
              <Divider />
              <ContextMenu.Item
                icon={<BiTrash />}
                as={RouterLink}
                to={
                  type === "dir"
                    ? `${url}/deleteDirectory/${encodedName}`
                    : `${url}/deletePage/${encodedName}`
                }
              >
                Delete
              </ContextMenu.Item>
            </>
          </ContextMenu.List>
        </ContextMenu>
      )}
    </Box>
  )
}

const FolderContent = ({ dirData }) => {
  const InnerContent = () => {
    if (dirData && dirData.length) {
      return dirData.map((item) => <FolderItem key={item.name} item={item} />)
    }

    if (dirData) {
      return (
        <span className="d-flex justify-content-center">
          No pages here yet.
        </span>
      )
    }

    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border text-primary" role="status" />
      </div>
    )
  }

  return (
    <div className={`${contentStyles.contentContainerFolderColumn} mb-5`}>
      <InnerContent />
    </div>
  )
}

export { FolderContent, FolderItem }
