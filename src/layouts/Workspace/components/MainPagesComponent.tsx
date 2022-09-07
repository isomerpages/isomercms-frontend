import { SimpleGrid, Skeleton, Text } from "@chakra-ui/react"

import { useGetPageHook } from "hooks/pageHooks"

import { Section } from "../../components"

import { CONTACT_US_TEMPLATE_LAYOUT } from "./WorkspaceFolderComponent"

import { ContactCard, HomepageCard, NavigationCard } from "."

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

export interface MainPagesProps {
  siteName: string
  isLoading: boolean
}
