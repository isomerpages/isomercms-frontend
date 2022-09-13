import { Box } from "@chakra-ui/react"

import elementStyles from "styles/isomer-cms/Elements.module.scss"
import contentStyles from "styles/isomer-cms/pages/Content.module.scss"

import { pageFileNameToTitle } from "utils"

const FolderItem = ({ item }) => {
  const { name, type } = item

  return (
    <Box
      w="100%"
      className={`${contentStyles.component} ${contentStyles.card}`}
      position="relative"
    >
      <Box className={`${elementStyles.card} ${elementStyles.folderItem}`}>
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
        </div>
      </Box>
    </Box>
  )
}

export { FolderItem }
