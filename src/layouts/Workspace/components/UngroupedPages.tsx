import { SimpleGrid, Box, Skeleton } from "@chakra-ui/react"
import { BiInfoCircle } from "react-icons/bi"
import { Link } from "react-router-dom"

import { Greyscale } from "components/Greyscale"

import { isWriteActionsDisabled } from "utils/reviewRequests"

import { PageData } from "types/directory"

import {
  Section,
  SectionHeader,
  SectionCaption,
  CreateButton,
} from "../../components"

import { PageCard } from "."

export interface UngroupedPagesProps {
  siteName: string
  pagesData: PageData[]
  url: string
}

export const UngroupedPages = ({
  siteName,
  pagesData,
  url,
}: UngroupedPagesProps): JSX.Element => {
  const isWriteDisabled = isWriteActionsDisabled(siteName)

  return (
    <Section>
      <Box w="100%">
        <SectionHeader label="Ungrouped Pages">
          <Greyscale isActive={isWriteDisabled}>
            <CreateButton as={Link} to={`${url}/createPage`}>
              Create page
            </CreateButton>
          </Greyscale>
        </SectionHeader>
        <SectionCaption label="NOTE: " icon={BiInfoCircle}>
          These pages aren&apos;t in folders, but can be added as items to your
          navigation bar.
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
