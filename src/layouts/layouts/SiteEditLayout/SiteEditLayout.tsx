import {
  VStack,
  StackDivider,
  StackProps,
  GridItem,
  Grid,
  GridProps,
} from "@chakra-ui/react"
import { Sidebar } from "components/Sidebar"

import { DirtyFieldContextProvider } from "contexts/DirtyFieldContext"

import { SiteEditHeader } from "./SiteEditHeader"

const GRID_LAYOUT: Pick<
  GridProps,
  "gridTemplateAreas" | "gridTemplateRows" | "gridTemplateColumns"
> = {
  gridTemplateAreas: `"header header"
                      "sidebar content"`,
  gridTemplateColumns: "15rem 1fr",
  gridTemplateRows: "4rem 1fr",
}

/**
 * @precondition This component MUST only be used when there is a sitename. \
 * This means that this component has to be used within the main CMS section after clicking the site card
 */
export const SiteEditLayout = ({ children }: StackProps): JSX.Element => {
  return (
    <DirtyFieldContextProvider>
      <Grid {...GRID_LAYOUT}>
        <GridItem
          area="header"
          alignSelf="flex-start"
          position="sticky"
          top={0}
          zIndex="sticky"
        >
          <SiteEditHeader />
        </GridItem>
        {/* main bottom section */}
        <GridItem
          area="sidebar"
          alignSelf="flex-start"
          position="sticky"
          // NOTE: Offset for header height
          top="4rem"
        >
          <Sidebar />
        </GridItem>
        <SiteEditContent p="2rem">{children}</SiteEditContent>
      </Grid>
    </DirtyFieldContextProvider>
  )
}

export const SiteEditContent = ({
  children,
  ...rest
}: StackProps): JSX.Element => {
  return (
    <GridItem
      area="content"
      as={VStack}
      spacing="2rem"
      bgColor="gray.50"
      w="100%"
      h="100%"
      divider={<StackDivider borderColor="border.divider.alt" />}
      {...rest}
    >
      {children}
    </GridItem>
  )
}
