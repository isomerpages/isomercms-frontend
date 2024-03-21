import {
  Input,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Box,
  Text,
  Center,
  Spinner,
  FormControl,
  Flex,
  Spacer,
} from "@chakra-ui/react"
import { useFeatureIsOn } from "@growthbook/growthbook-react"
import { yupResolver } from "@hookform/resolvers/yup"
import {
  FormErrorMessage,
  Link,
  FormLabel,
  ModalCloseButton,
  Toggle,
} from "@opengovsg/design-system-react"
import _ from "lodash"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"

import { Breadcrumb } from "components/folders/Breadcrumb"
import {
  FormContext,
  FormError,
  FormTitle,
  FormDescription,
} from "components/Form"
import FormFieldMedia from "components/FormFieldMedia"
import { LoadingButton } from "components/LoadingButton"
import { Modal } from "components/Modal"

import { getDefaultPermalink } from "utils/permalink"
import { isWriteActionsDisabled } from "utils/reviewRequests"

import { PageVariant } from "types/pages"
import { getDefaultFrontMatter, pageFileNameToTitle } from "utils"

import { PageSettingsSchema } from "./PageSettingsSchema"

interface PageModalParams {
  siteName: string
  fileName: string
  collectionName: string
  subCollectionName: string
}

interface PageFrontMatter {
  title: string
  permalink: string
  // eslint-disable-next-line camelcase
  third_nav_title?: string
  description?: string
  image?: string
  variant: PageVariant
}

interface PageParams {
  content: {
    frontMatter: PageFrontMatter
    pageBody?: string
  }
  sha: string
  name: string
}

interface PageSettingsModalParams {
  params: PageModalParams
  pageData?: PageParams
  onProceed: ({
    pageData,
    data,
  }: {
    pageData?: PageParams
    data: PageFrontMatter
  }) => void
  pagesData: PageParams[]
  siteUrl: string
  onClose: () => void
}

// eslint-disable-next-line import/prefer-default-export
export const PageSettingsModal = ({
  params,
  pageData,
  onProceed,
  pagesData,
  siteUrl,
  onClose,
}: PageSettingsModalParams) => {
  const { siteName, fileName } = params
  const isTiptapEnabled = useFeatureIsOn("is-tiptap-enabled")
  const isPageCreated = !fileName

  const existingTitlesArray = pagesData
    .filter((page) => page.name !== fileName)
    .map((page) => pageFileNameToTitle(page.name))

  const defaultFrontMatter = {
    ...getDefaultFrontMatter(params, existingTitlesArray),
    variant: "tiptap",
  } as const
  const isWriteDisabled = isWriteActionsDisabled(siteName)

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<PageFrontMatter>({
    mode: "onTouched",
    resolver: yupResolver(PageSettingsSchema(existingTitlesArray)),
    defaultValues: defaultFrontMatter,
  })

  /** ******************************** */
  /*     useEffects to load data     */
  /** ******************************** */

  useEffect(() => {
    if (fileName && pageData && pageData.content) {
      Object.entries(pageData.content.frontMatter).forEach(
        ([key, value]: any) =>
          setValue(key, value, {
            shouldValidate: true,
          })
      )
    }
  }, [fileName, pageData, setValue])

  /** ******************************** */
  /*     handler functions    */
  /** ******************************** */

  const onSubmit = (data: PageFrontMatter) => {
    return onProceed({
      pageData,
      data,
    })
  }

  const currTitle = watch("title")
  const currPermalink = watch("permalink")
  useEffect(() => {
    if (isPageCreated && currPermalink !== getDefaultPermalink(currTitle)) {
      setValue("permalink", getDefaultPermalink(currTitle))
    }
  }, [isPageCreated, setValue, currTitle, currPermalink])

  return (
    <Modal isOpen onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton id="settings-CLOSE" />
        <ModalHeader>
          <Text as="h1">{!fileName ? "Create new page" : "Page settings"}</Text>
        </ModalHeader>
        <ModalBody>
          {fileName && !pageData ? (
            <Center>
              <Spinner />
            </Center>
          ) : (
            <Box>
              {!fileName ? "You may edit page details anytime. " : ""}
              To edit page content, simply click on the page title. <br />
              <Breadcrumb
                params={params}
                title={watch("title")}
                isLink={false}
              />
              {/* Title */}
              <FormControl
                isRequired
                isInvalid={!!errors.title?.message}
                mb="1rem"
              >
                <Box mb="0.75rem">
                  <FormLabel mb={0}>Page title</FormLabel>
                  <FormLabel.Description color="text.description">
                    This appears on the top of the browser window or tab
                  </FormLabel.Description>
                </Box>
                <Input
                  placeholder="Page title"
                  id="title"
                  {...register("title", { required: true })}
                />
                <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
              </FormControl>
              {/* Permalink */}
              <FormControl
                isInvalid={!!errors.permalink?.message}
                isRequired
                mb="1rem"
              >
                <Box mb="0.75rem">
                  <FormLabel mb={0}>Page URL</FormLabel>
                  <FormLabel.Description color="text.description">
                    {isPageCreated
                      ? "You can change this later in Page Settings."
                      : `${siteUrl}${watch("permalink")}`}
                  </FormLabel.Description>
                </Box>
                <Input
                  {...register("permalink", { required: true })}
                  id="permalink"
                  placeholder="Insert /page-url or https://"
                  isDisabled={isPageCreated}
                />
                {isPageCreated && (
                  <Box my="0.5rem">
                    <Text textStyle="body-2">
                      {`${siteUrl}${watch("permalink")}`}
                    </Text>
                  </Box>
                )}

                <FormErrorMessage>{errors.permalink?.message}</FormErrorMessage>
              </FormControl>
              {isTiptapEnabled && (
                <FormControl isInvalid={!!errors.permalink?.message} isRequired>
                  <Flex mb="0.75rem" alignItems="center">
                    <FormLabel mb={0}>Enable new editor</FormLabel>
                    <Spacer />
                    <Controller
                      name="variant"
                      render={({ field: { onChange, value } }) => {
                        return (
                          <Toggle
                            defaultChecked
                            onChange={(event) => {
                              event.target.checked
                                ? onChange("tiptap")
                                : onChange("markdown")
                            }}
                            isChecked={value === "tiptap"}
                            label=""
                          />
                        )
                      }}
                      control={control}
                    />
                  </Flex>
                </FormControl>
              )}
              <br />
              <br />
              <Text textStyle="h4">Page details</Text>
              <FormControl isInvalid={!!errors.description?.message}>
                <Box mb="0.75rem">
                  <FormLabel mb={0} textColor="text.label">
                    Meta Description
                  </FormLabel>
                  <FormLabel.Description color="text.description">
                    {/* NOTE: See here: https://github.com/opengovsg/design-system/issues/440
                     * for why this is required
                     */}
                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                    {/* @ts-ignore */}
                    <Text>
                      Description snippet shown in search results.{" "}
                      <Link isExternal href="https://go.gov.sg/isomer-meta">
                        Learn more
                      </Link>
                    </Text>
                  </FormLabel.Description>
                </Box>
                <Input
                  placeholder="Meta Description (Optional)"
                  id="description"
                  {...register("description")}
                />
                <FormErrorMessage>
                  {errors.description?.message}
                </FormErrorMessage>
              </FormControl>
              <br />
              <FormContext
                hasError={!!errors.image?.message}
                onFieldChange={(e) => setValue("image", e.target.value)}
              >
                <FormTitle>Meta Image URL (Optional)</FormTitle>
                <FormDescription>
                  Image shown when link is shared on social media.{" "}
                  <a
                    href="https://go.gov.sg/isomer-meta"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Learn more
                  </a>
                </FormDescription>
                <FormFieldMedia
                  register={register}
                  placeholder="Meta Image URL (Optional)"
                  id="image"
                  inlineButtonText="Select Image"
                />
                <FormError>{errors.image?.message}</FormError>
              </FormContext>
            </Box>
          )}
        </ModalBody>
        <ModalFooter>
          <LoadingButton
            onClick={handleSubmit(onSubmit)}
            isDisabled={
              isWriteDisabled ||
              (!fileName
                ? !_.isEmpty(errors)
                : !_.isEmpty(errors) || !pageData?.sha)
            }
          >
            Save
          </LoadingButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
