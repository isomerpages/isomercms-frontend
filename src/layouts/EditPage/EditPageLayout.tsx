import { Flex, Spacer, Button } from "@chakra-ui/react"
import { PropsWithChildren, useEffect } from "react"
import { useParams } from "react-router-dom"

import { Footer } from "components/Footer"
import { Greyscale } from "components/Greyscale"
import Header from "components/Header"

import { useGetPageHook, useUpdatePageHook } from "hooks/pageHooks"
import { useGetSiteColorsHook } from "hooks/settingsHooks"
import useRedirectHook from "hooks/useRedirectHook"

import { isWriteActionsDisabled } from "utils/reviewRequests"

import { createPageStyleSheet, getDecodedParams } from "utils"

interface EditPageLayoutProps {
  getPageBody: () => string
  variant: "markdown" | "tiptap"
}

export const EditPageLayout = ({
  getPageBody,
  variant,
  children,
}: PropsWithChildren<EditPageLayoutProps>) => {
  const params = useParams<{ siteName: string }>()
  const decodedParams = getDecodedParams(params)
  const {
    mutateAsync: updatePageHandler,
    isLoading: isSavingPage,
  } = useUpdatePageHook(params, {
    // NOTE: Not deleting this as this is important enough
    // to leave here so that we avoid regression.
    // onError: (err) => {
    //   if (err.response.status === 409) onOverwriteOpen()
    // },
  })

  const { siteName } = decodedParams

  const { setRedirectToNotFound } = useRedirectHook()
  const { data: pageData, isLoading: isLoadingPage } = useGetPageHook(params, {
    onError: () => setRedirectToNotFound(siteName),
  })
  const { data: siteColorsData } = useGetSiteColorsHook(params)

  const isWriteDisabled = isWriteActionsDisabled(siteName)

  useEffect(() => {
    if (siteColorsData)
      createPageStyleSheet(
        siteName,
        siteColorsData.primaryColor,
        siteColorsData.secondaryColor
      )
  }, [siteColorsData, siteName])

  return (
    <Greyscale isActive={isWriteDisabled}>
      <Flex flexDir="column" h="full">
        <Header
          title={pageData?.content?.frontMatter?.title || ""}
          // TODO: Add this check back in dynamically
          shouldAllowEditPageBackNav
          isEditPage
          params={decodedParams}
        />
        <Flex flexDir="row" w="100%" h="100%">
          {/* Editor */}
          {children}
        </Flex>
        <Spacer />
        <Footer>
          <Button
            onClick={() => {
              updatePageHandler(({
                pageData: {
                  frontMatter: pageData?.content?.frontMatter,
                  pageBody: getPageBody(),
                  sha: pageData.sha,
                  variant,
                },
              } as unknown) as void)
            }}
            isLoading={isSavingPage}
          >
            Save
          </Button>
        </Footer>
      </Flex>
    </Greyscale>
  )
}
