import { SimpleGrid, Box, Skeleton } from "@chakra-ui/react"
import { BiBulb } from "react-icons/bi"
import { Link } from "react-router-dom"

import { Greyscale } from "components/Greyscale"

import { isWriteActionsDisabled } from "utils/reviewRequests"

import { DirectoryData, PageData } from "types/directory"

import {
  Section,
  SectionHeader,
  SectionCaption,
  CreateButton,
} from "../../components"

import { FolderCard } from "."

export const CONTACT_US_TEMPLATE_LAYOUT = "contact_us"

export interface WorkspaceFoldersProps {
  siteName: string
  pagesData: PageData[]
  url: string
  dirsData: DirectoryData[]
}

export const WorkspaceFolders = ({
  siteName,
  pagesData,
  url,
  dirsData,
}: WorkspaceFoldersProps): JSX.Element => {
  const isWriteDisabled = isWriteActionsDisabled(siteName)

  return (
    <Section>
      <Box w="100%">
        <SectionHeader label="Folders">
          <Greyscale isActive={isWriteDisabled}>
            <CreateButton as={Link} to={`${url}/createDirectory`}>
              Create folder
            </CreateButton>
          </Greyscale>
        </SectionHeader>
        <SectionCaption label="PRO TIP: " icon={BiBulb}>
          You can link folders to your navigation bar.
        </SectionCaption>
      </Box>
      <Skeleton isLoaded={!!pagesData} w="full">
        <SimpleGrid columns={3} spacing="1.5rem">
          {dirsData &&
            dirsData.length > 0 &&
            dirsData.map(({ name }) => (
              <FolderCard title={name} siteName={siteName} />
            ))}
        </SimpleGrid>
      </Skeleton>
    </Section>
  )
}
