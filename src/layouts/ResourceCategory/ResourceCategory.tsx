import { Box, Text, Skeleton, SimpleGrid } from "@chakra-ui/react"
import { BiBulb } from "react-icons/bi"
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

import { ProtectedRouteWithProps } from "routing/RouteSelector"

// Import utils
import { ResourceCategoryRouteParams } from "types/resources"
import { deslugifyDirectory } from "utils"

import { ResourceCard, ResourceCategoryBreadcrumb } from "./components"

export const ResourceCategory = (): JSX.Element => {
  const { params } = useRouteMatch<ResourceCategoryRouteParams>()
  const { siteName, resourceRoomName, resourceCategoryName } = params
  const { path, url } = useRouteMatch()
  const history = useHistory()

  const { data: pagesData, isLoading } = useGetResourceCategory(
    siteName,
    resourceRoomName,
    resourceCategoryName
  )

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
          <Box w="full">
            <SectionHeader label="Pages">
              <CreateButton as={RouterLink} to={`${url}/createPage`}>
                Create page
              </CreateButton>
            </SectionHeader>
            <SectionCaption icon={BiBulb} label="PRO TIP: ">
              Organise your workspace by moving pages into folders
            </SectionCaption>
          </Box>
          <Skeleton isLoaded={!isLoading} w="100%">
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
        {/* NOTE: This is needed for the divider to show */}
        <Box display="none" />
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
