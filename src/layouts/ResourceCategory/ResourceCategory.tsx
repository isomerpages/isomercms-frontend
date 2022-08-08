import {
  Box,
  Text,
  Skeleton,
  SimpleGrid,
  Button,
  Center,
  Icon,
  VStack,
} from "@chakra-ui/react"
import { BiBulb, BiPlus } from "react-icons/bi"
import {
  Switch,
  useRouteMatch,
  useHistory,
  Link as RouterLink,
} from "react-router-dom"

import { useGetResourceCategory } from "hooks/directoryHooks"

// Import screens
import {
  CreateButton,
  Section,
  SectionCaption,
  SectionHeader,
} from "layouts/components"
import { SiteViewLayout } from "layouts/layouts"
import {
  PageSettingsScreen,
  MoveScreen,
  DeleteWarningScreen,
} from "layouts/screens"

import { ProtectedRouteWithProps } from "routing/ProtectedRouteWithProps"

// Import utils
import { EmptyBoxImage } from "assets"
import { ResourceCategoryRouteParams } from "types/resources"
import { deslugifyDirectory } from "utils"

import { ResourceCard, ResourceCategoryBreadcrumb } from "./components"

export const ResourceCategory = (): JSX.Element => {
  const { params } = useRouteMatch<ResourceCategoryRouteParams>()
  const { resourceCategoryName } = params
  const { path, url } = useRouteMatch()
  const history = useHistory()

  const { data: pagesData, isLoading } = useGetResourceCategory(params)
  const isPagesEmpty = !pagesData?.length
  return (
    <>
      <SiteViewLayout>
        <Section>
          <Box>
            <Text as="h2" textStyle="h2">
              {deslugifyDirectory(resourceCategoryName)}
            </Text>
            <ResourceCategoryBreadcrumb />
          </Box>
        </Section>
        <Section>
          {!isPagesEmpty && (
            <Box w="full">
              <SectionHeader label="Resource Pages">
                <CreateButton as={RouterLink} to={`${url}/createPage`}>
                  Create page
                </CreateButton>
              </SectionHeader>
              <SectionCaption icon={BiBulb} label="NOTE: ">
                Pages are automatically ordered by latest date.
              </SectionCaption>
            </Box>
          )}
          <Skeleton
            isLoaded={!isLoading}
            w="100%"
            h={isLoading ? "10rem" : "fit-content"}
          >
            {isPagesEmpty && (
              <VStack spacing={5}>
                <EmptyBoxImage />
                <VStack spacing={0}>
                  <Center textStyle="subhead-1">
                    There&apos;s nothing here yet.
                  </Center>
                  <Center textStyle="body-2">
                    Create a resource page to get started.
                  </Center>
                </VStack>
                <Button
                  variant="solid"
                  as={RouterLink}
                  to={`${url}/createPage`}
                  leftIcon={<Icon as={BiPlus} fontSize="1.5rem" fill="white" />}
                >
                  Create Page
                </Button>
              </VStack>
            )}
            <SimpleGrid columns={3} spacing="1.5rem">
              {/* NOTE: need to use multiline cards */}
              {(pagesData || []).map(({ name, title, date, resourceType }) => (
                <ResourceCard
                  name={name}
                  title={title}
                  date={date}
                  resourceType={resourceType}
                />
              ))}
            </SimpleGrid>
          </Skeleton>
        </Section>
      </SiteViewLayout>
      {/* main section ends here */}
      <Switch>
        <ProtectedRouteWithProps
          path={[`${path}/createPage`, `${path}/editPageSettings/:fileName`]}
          component={PageSettingsScreen}
          onClose={() => history.goBack()}
        />
        <ProtectedRouteWithProps
          path={[`${path}/deletePage/:fileName`]}
          component={DeleteWarningScreen}
          onClose={() => history.goBack()}
        />
        <ProtectedRouteWithProps
          path={[`${path}/movePage/:fileName`]}
          component={MoveScreen}
          onClose={() => history.goBack()}
        />
      </Switch>
    </>
  )
}
