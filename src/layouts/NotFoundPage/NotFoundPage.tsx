import {
  Button,
  Grid,
  GridItem,
  GridProps,
  Text,
  VStack,
} from "@chakra-ui/react"
import { Link as RouterLink, useLocation } from "react-router-dom"

import { NotFoundSubmarineImage } from "assets/images/NotFoundSubmarineImage"

const GRID_LAYOUT: Pick<
  GridProps,
  "gridTemplateAreas" | "gridTemplateRows" | "gridTemplateColumns"
> = {
  gridTemplateAreas: `"buffer"
                      "content"`,
  gridTemplateColumns: "1fr",
  gridTemplateRows: "4rem 1fr",
}

export const NotFoundPage = (): JSX.Element => {
  const { pathname } = useLocation()
  const pathTokens = pathname.split("/")
  const siteName =
    pathTokens.length > 3 && pathTokens[1] === "sites" ? pathTokens[2] : ""

  return (
    <Grid {...GRID_LAYOUT} bgColor="base.canvas.brand-subtle" minH="100vh">
      <GridItem area="buffer" />
      <GridItem area="content">
        <VStack spacing="1rem">
          <NotFoundSubmarineImage />
          <VStack spacing="0.5rem" mt="1rem">
            <Text
              textStyle="subhead-1"
              fontWeight="medium"
              color="base.content.strong"
            >
              The page you are looking for does not exist anymore.
            </Text>
            <Text textStyle="body-2" color="base.content.default">
              Try refreshing your page when you return.
            </Text>
          </VStack>
          <Button
            as={RouterLink}
            to={siteName ? `/sites/${siteName}/workspace` : "/sites"}
            mb="8rem"
          >
            Back to dashboard
          </Button>
        </VStack>
      </GridItem>
    </Grid>
  )
}
