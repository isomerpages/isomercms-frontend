import { SimpleGrid, Box, Skeleton, Text } from "@chakra-ui/react"
import { BiBulb, BiInfoCircle } from "react-icons/bi"
import { Link } from "react-router-dom"

import { useGetPageHook } from "hooks/pageHooks"

import { DirectoryData, PageData } from "types/directory"

import {
  Section,
  SectionHeader,
  SectionCaption,
  CreateButton,
} from "../../components"

import {
  PageCard,
  FolderCard,
  ContactCard,
  HomepageCard,
  NavigationCard,
} from "."

const CONTACT_US_TEMPLATE_LAYOUT = "contact_us"

export interface MainPagesProps {
  siteName: string
  isLoading: boolean
}

export interface WorkspaceFoldersProps {
  siteName: string
  pagesData: PageData[]
  url: string
  dirsData: DirectoryData[]
}

export interface UngroupedPagesProps {
  pagesData: PageData[]
  url: string
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

export const UngroupedPages = ({
  pagesData,
  url,
}: UngroupedPagesProps): JSX.Element => {
  return (
    <Section>
      <Box w="100%">
        <SectionHeader label="Ungrouped Pages">
          <CreateButton as={Link} to={`${url}/createPage`}>
            Create page
          </CreateButton>
        </SectionHeader>
        <SectionCaption label="NOTE: " icon={BiInfoCircle}>
          Pages here do not belong to any folders.
        </SectionCaption>
      </Box>
      <Skeleton isLoaded={!!pagesData} w="full">
        <SimpleGrid columns={3} spacing="1.5rem">
          {pagesData &&
            pagesData.length > 0 &&
            pagesData
              .filter((page) => page.name !== "contact-us.md")
              .map(({ name }) => <PageCard title={name} />)}
        </SimpleGrid>
      </Skeleton>
    </Section>
  )
}

/**
 * Represents homepage, navigation bar and contact us pages.
 * @param MainPagesProps pagesData : list of all pages for a site
 * @returns JSX element that contains the 3 cards to represent the 3 pages
 */
export const MainPages = ({
  siteName,
  isLoading,
}: MainPagesProps): JSX.Element => {
  const { data: contactUsPage } = useGetPageHook({
    siteName,
    fileName: "contact-us.md",
  })
  const hasContactUsCard =
    contactUsPage?.content?.frontMatter?.layout === CONTACT_US_TEMPLATE_LAYOUT
  return (
    <Section>
      <Text as="h2" textStyle="h2">
        My Workspace
      </Text>
      <Skeleton isLoaded={!!isLoading} w="full">
        <SimpleGrid columns={3} spacing="1.5rem">
          <HomepageCard siteName={siteName} />
          <NavigationCard siteName={siteName} />
          {hasContactUsCard && <ContactCard siteName={siteName} />}
        </SimpleGrid>
      </Skeleton>
    </Section>
  )
}
