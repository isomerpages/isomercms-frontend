import {
  SimpleGrid,
  Box,
  Skeleton,
  Text,
  Center,
  VStack,
} from "@chakra-ui/react"
import { BiBulb, BiInfoCircle } from "react-icons/bi"
import { Link } from "react-router-dom"

import { MenuDropdownButton } from "layouts/Folders/components"

import { EmptyBoxImage } from "assets/images/EmptyBoxImage"
import { DirectoryData, PageData } from "types/directory"

import {
  Section,
  SectionHeader,
  SectionCaption,
  CreateButton,
} from "../../components"

import { PageCard, FolderCard } from "."

export const WorkspaceFolders = (props: {
  siteName: string
  pagesData: PageData[]
  url: string
  dirsData: DirectoryData[]
}): JSX.Element => {
  const { siteName, pagesData, url, dirsData } = props

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

export const UngroupedPages = (props: {
  pagesData: PageData[]
  url: string
}): JSX.Element => {
  const { pagesData, url } = props
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

export const EmptyFolder = (props: { url: string }): JSX.Element => {
  const { url } = props
  return (
    <Box as="form" w="full">
      {/* Resource Room does not exist */}
      <VStack spacing={5}>
        <EmptyBoxImage />
        <Center>
          <VStack spacing={0}>
            <Text textStyle="subhead-1">{" There's nothing here yet. "}</Text>
            <Text textStyle="body-2">Create a new item to get started.</Text>
          </VStack>
        </Center>

        <CreateButton as={Link} to={`${url}/createDirectory`}>
          Create folder
        </CreateButton>
      </VStack>
    </Box>
  )
}

export const EmptyPage = (props: { url: string }): JSX.Element => {
  const { url } = props

  return (
    <Box as="form" w="full">
      <VStack spacing={5}>
        <EmptyBoxImage />
        <Center>
          <VStack spacing={0}>
            <Text textStyle="subhead-1">There&apos;s nothing here yet.</Text>
            <Text textStyle="body-2">Create a new item to get started.</Text>
          </VStack>
        </Center>
        <CreateButton as={Link} to={`${url}/createPage`}>
          Create page
        </CreateButton>
      </VStack>
    </Box>
  )
}

export const EmptyPageAndFolder = (): JSX.Element => {
  return (
    <Box as="form" w="full">
      {/* Resource Room does not exist */}
      <VStack spacing={5}>
        <EmptyBoxImage />
        <Center>
          <VStack spacing={0}>
            <Text textStyle="subhead-1">There&apos;s nothing here yet.</Text>
            <Text textStyle="body-2">Create a new item to get started.</Text>
          </VStack>
        </Center>
        <MenuDropdownButton />
      </VStack>
    </Box>
  )
}
