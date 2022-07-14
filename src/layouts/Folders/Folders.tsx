import {
  Box,
  Text,
  ButtonGroup,
  Icon,
  Skeleton,
  VStack,
} from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import { FolderContent } from "components/folders/FolderContent"
import { BiBulb, BiSort } from "react-icons/bi"
import {
  Switch,
  useRouteMatch,
  useHistory,
  Link as RouterLink,
} from "react-router-dom"

// Import components

import { useGetFolders } from "hooks/directoryHooks"

import {
  PageSettingsScreen,
  MoveScreen,
  DirectoryCreationScreen,
  DirectorySettingsScreen,
  ReorderingScreen,
  DeleteWarningScreen,
} from "layouts/screens"

import { ProtectedRouteWithProps } from "routing/ProtectedRouteWithProps"

import { FolderUrlParams } from "types/folders"
import { deslugifyDirectory } from "utils"

import { Section, SectionHeader, SectionCaption } from "../components"
import { SiteViewLayout } from "../layouts"

import { FolderBreadcrumbs, MenuDropdownButton } from "./components"

interface FoldersProps {
  match: {
    params: FolderUrlParams
    decodedParams: FolderUrlParams
  }
}

export const Folders = ({ match }: FoldersProps): JSX.Element => {
  const { params, decodedParams } = match
  const { collectionName, subCollectionName } = decodedParams
  // NOTE: As isomer does not support recursively nested folders,
  // the depth of folder creation is 1 (parent -> child).
  // Hence, at the subfolder, folder creation is disabled.
  const canCreateFolder = !subCollectionName
  const { path, url } = useRouteMatch()
  const history = useHistory()

  const { data: dirData, isLoading: isLoadingDirectory } = useGetFolders(params)

  return (
    <>
      <SiteViewLayout overflow="hidden">
        <Section>
          <VStack align="left" spacing="0.375rem">
            <Text as="h2" textStyle="h2">
              {subCollectionName
                ? deslugifyDirectory(subCollectionName)
                : collectionName}
            </Text>
            <FolderBreadcrumbs />
          </VStack>
        </Section>
        {/* Info segment */}
        <Section>
          <Box w="100%">
            <SectionHeader label="Order of items">
              <ButtonGroup variant="outline" spacing="1rem">
                <Button
                  as={RouterLink}
                  to={`${url}/rearrange`}
                  iconSpacing="0.5rem"
                  leftIcon={
                    <Icon as={BiSort} fontSize="1.5rem" fill="icon.default" />
                  }
                >
                  Reorder items
                </Button>
                {canCreateFolder ? (
                  <MenuDropdownButton />
                ) : (
                  <Button
                    variant="outline"
                    as={RouterLink}
                    to={`${url}/createPage`}
                  >
                    Create page
                  </Button>
                )}
              </ButtonGroup>
            </SectionHeader>
            <SectionCaption label="PRO TIP: " icon={BiBulb}>
              Subfolders appear as side navigation in pages. Create a new
              section by creating a subfolder.
            </SectionCaption>
          </Box>
          <Skeleton isLoaded={!isLoadingDirectory} w="100%">
            <FolderContent dirData={dirData} />
          </Skeleton>
        </Section>
        {/* main section ends here */}
      </SiteViewLayout>
      <Switch>
        <ProtectedRouteWithProps
          path={[`${path}/createDirectory`]}
          component={DirectoryCreationScreen}
          onClose={() => history.goBack()}
        />
        <ProtectedRouteWithProps
          path={[`${path}/createPage`, `${path}/editPageSettings/:fileName`]}
          component={PageSettingsScreen}
          onClose={() => history.goBack()}
        />
        <ProtectedRouteWithProps
          path={[
            `${path}/deletePage/:fileName`,
            `${path}/deleteDirectory/:subCollectionName`,
          ]}
          component={DeleteWarningScreen}
          onClose={() => history.goBack()}
        />
        <ProtectedRouteWithProps
          path={[`${path}/rearrange`]}
          component={ReorderingScreen}
          onClose={() => history.goBack()}
        />
        <ProtectedRouteWithProps
          path={[`${path}/editDirectorySettings/:subCollectionName`]}
          component={DirectorySettingsScreen}
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
