import {
  VStack,
  StackDivider,
  StackProps,
  GridItem,
  Grid,
  GridProps,
} from "@chakra-ui/react"

import { SiteViewHeader } from "./SiteViewHeader"

const GRID_LAYOUT: Pick<
  GridProps,
  "gridTemplateAreas" | "gridTemplateRows" | "gridTemplateColumns"
> = {
  gridTemplateAreas: `"header"
                      "content"`,
  gridTemplateColumns: "1fr",
  gridTemplateRows: "4rem 1fr",
}

export const SiteViewLayout = ({
  siteName,
  children,
}: StackProps & { siteName: string }): JSX.Element => {
  return (
    <>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Grid {...GRID_LAYOUT}>
        <GridItem
          area="header"
          alignSelf="flex-start"
          position="sticky"
          top={0}
          zIndex="sticky"
        >
          <SiteViewHeader siteName={siteName} />
        </GridItem>
        {/* main bottom section */}
        <SiteViewContent p="2rem">{children}</SiteViewContent>
      </Grid>
    </>
  )
}

export const SiteViewContent = ({
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
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
    >
      {children}
    </GridItem>
  )
}
