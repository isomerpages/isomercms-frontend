import { SimpleGrid, Box, Skeleton } from "@chakra-ui/react"
import { BiBulb } from "react-icons/bi"
import { Link } from "react-router-dom"

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
  return (
    <Section>
      <Box w="100%">
        <SectionHeader label="Folders">
          <CreateButton as={Link} to={`${url}/createDirectory`}>
            Create folder
          </CreateButton>
        </SectionHeader>
        <SectionCaption label="PRO TIP: " icon={BiBulb}>
          Folders impact navigation on your site. Organise your workspace by
          moving pages into folders.
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
