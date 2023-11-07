import { Box } from "@chakra-ui/react"
import { PropsWithChildren } from "react"
import { useParams } from "react-router-dom"

import editorStyles from "styles/isomer-cms/pages/Editor.module.scss"

import { PageHeader, LeftNav } from "templates/pageComponentsV2"

import { getDecodedParams } from "utils"

interface PreviewProps {
  title: string
}

interface CollectionPageRouteParams {
  fileName: string
  collectionName: string
}

export const Preview = ({
  title,
  children,
}: PropsWithChildren<PreviewProps>) => {
  const params = useParams<CollectionPageRouteParams>()
  const pageParams = getDecodedParams(
    (params as unknown) as Record<string, string>
  )
  const { collectionName, fileName } = pageParams

  return (
    <Box
      w="100%"
      h="100vh"
      bg="white"
      overflowY="auto"
      className={editorStyles.pageEditorMain}
    >
      <Box>
        <section
          id="display-header"
          className="bp-section is-small bp-section-pagetitle"
        >
          <PageHeader pageParams={{ fileName, collectionName }} title={title} />
        </section>
        <section className="bp-section page-content-body">
          <Box className="bp-container padding--top--lg padding--bottom--xl">
            <Box className="row">
              <LeftNav collectionName={collectionName} fileName={fileName} />
              <Box
                className={`${"col is-8 is-offset-1-desktop is-12-touch print-content page-content-body"}`}
              >
                {children}
              </Box>
            </Box>
          </Box>
        </section>
      </Box>
    </Box>
  )
}
