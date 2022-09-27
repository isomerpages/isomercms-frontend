import { SimpleGrid, Box, Skeleton } from "@chakra-ui/react"
import { BiInfoCircle } from "react-icons/bi"
import { Link } from "react-router-dom"

import { PageData } from "types/directory"

import {
  Section,
  SectionHeader,
  SectionCaption,
  CreateButton,
} from "../../components"

import { PageCard } from "."

export interface UngroupedPagesProps {
  pagesData: PageData[]
  url: string
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
