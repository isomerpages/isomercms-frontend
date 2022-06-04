import {
  chakra,
  LinkOverlay,
  LinkBox,
  Divider,
  HStack,
  Icon,
  Text,
} from "@chakra-ui/react"
import { ContextMenuButton, ContextMenuItem } from "components/ContextMenu"
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
    <LinkBox
      className={`${contentStyles.component} ${contentStyles.card}`}
      position="relative"
    >
      <LinkOverlay as={RouterLink} to={!isDisabled && generatedLink} w="100%">
        <chakra.button
          className={`${elementStyles.card} ${contentStyles.card} ${elementStyles.folderItem}`}
        >
          <div className={contentStyles.contentContainerFolderRow}>
            {type === "file" ? (
              <i
                className={`bx bxs-file-blank ${elementStyles.folderItemIcon}`}
              />
            ) : (
              <i className={`bx bxs-folder ${elementStyles.folderItemIcon}`} />
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
      {!isDisabled && (
        <ContextMenuButton
          buttonProps={{
            right: "1.875rem",
            bottom: "1.875rem",
          }}
        >
          <ContextMenuItem
            icon={<BiEditAlt />}
            as={RouterLink}
            to={generatedLink}
          >
            <Text>Edit</Text>
          </ContextMenuItem>
          <ContextMenuItem
            icon={<BiWrench />}
            as={RouterLink}
            to={
              type === "dir"
                ? `${url}/editDirectorySettings/${encodedName}`
                : `${url}/editPageSettings/${encodedName}`
            }
          >
            Settings
          </ContextMenuItem>
          {type !== "dir" && (
            <ContextMenuItem
              icon={<BiFolder />}
              as={RouterLink}
              to={`${url}/movePage/${encodedName}`}
            >
              <HStack spacing="4rem" alignItems="center">
                <Text>Move to</Text>
                <Icon as={BiChevronRight} fontSize="1.25rem" />
              </HStack>
            </ContextMenuItem>
          )}
          <>
            <Divider />
            <ContextMenuItem
              icon={<BiTrash />}
              as={RouterLink}
              to={
                type === "dir"
                  ? `${url}/deleteDirectory/${encodedName}`
                  : `${url}/deletePage/${encodedName}`
              }
            >
              Delete
            </ContextMenuItem>
          </>
        </ContextMenuButton>
      )}
    </LinkBox>
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
