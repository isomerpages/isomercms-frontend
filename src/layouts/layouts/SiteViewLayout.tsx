import {
  VStack,
  StackDivider,
  StackProps,
  GridItem,
  Grid,
  GridProps,
} from "@chakra-ui/react"
import Header from "components/Header"
import { Sidebar } from "components/Sidebar"

const GRID_LAYOUT: Pick<
  GridProps,
  "gridTemplateAreas" | "gridTemplateRows" | "gridTemplateColumns"
> = {
  gridTemplateAreas: `"header header" 
                      "sidebar content"`,
  gridTemplateColumns: "15rem 1fr",
  gridTemplateRows: "5rem 1fr",
}

/**
 * @precondition This component MUST only be used when there is a sitename. \
 * This means that this component has to be used within the main CMS section after clicking the site card
 */
export const SiteViewLayout = ({
  children,
  ...rest
}: StackProps): JSX.Element => {
  return (
    <>
      <Grid {...GRID_LAYOUT}>
        <GridItem area="header">
          <Header />
        </GridItem>
        {/* main bottom section */}
        <GridItem
          area="sidebar"
          alignSelf="flex-start"
          position="sticky"
          top={0}
        >
          <Sidebar />
        </GridItem>
        <GridItem
          area="content"
          as={VStack}
          p="2rem"
          spacing="2rem"
          bgColor="gray.50"
          w="100%"
          h="100%"
          divider={<StackDivider borderColor="border.divider.alt" />}
          {...rest}
        >
          {children}
        </GridItem>
      </Grid>
    </>
  )
}
