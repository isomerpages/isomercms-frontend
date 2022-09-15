import {
  Input,
  Modal,
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
} from "@chakra-ui/react"
import { yupResolver } from "@hookform/resolvers/yup"
import {
  FormErrorMessage,
  FormLabel,
  ModalCloseButton,
} from "@opengovsg/design-system-react"
import { Breadcrumb } from "components/folders/Breadcrumb"
import {
  FormContext,
  FormError,
  FormTitle,
  FormDescription,
} from "components/Form"
import FormFieldMedia from "components/FormFieldMedia"
import { LoadingButton } from "components/LoadingButton"
import _ from "lodash"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

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
  const { fileName } = params

  const existingTitlesArray = pagesData
    .filter((page) => page.name !== fileName)
    .map((page) => pageFileNameToTitle(page.name))

  const defaultFrontMatter = getDefaultFrontMatter(params, existingTitlesArray)

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    setValue,
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
              <FormControl isRequired isInvalid={!!errors.title?.message}>
                <FormLabel>Page title</FormLabel>
                <Input
                  placeholder="Page title"
                  id="title"
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...register("title", { required: true })}
                />
                <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
              </FormControl>
              <br />
              {/* Permalink */}
              <FormControl isInvalid={!!errors.permalink?.message} isRequired>
                <Box mb="0.75rem">
                  <FormLabel mb={0}>Page URL</FormLabel>
                  <FormLabel.Description color="text.description">
                    {siteUrl}
                  </FormLabel.Description>
                </Box>
                <Input
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...register("permalink", { required: true })}
                  id="permalink"
                  placeholder="Page URL"
                />
                <FormErrorMessage>{errors.permalink?.message}</FormErrorMessage>
              </FormControl>
              <br />
              <br />
              <Text textStyle="h4">Page details</Text>
              <FormControl isInvalid={!!errors.description?.message}>
                <Box mb="0.75rem">
                  <FormLabel mb={0} textColor="text.label">
                    Meta Description
                  </FormLabel>
                  <FormLabel.Description useMarkdown color="text.description">
                    Description snippet shown in search results. [Learn
                    more](https://go.gov.sg/isomer-meta)
                  </FormLabel.Description>
                </Box>
                <Input
                  placeholder="Meta Description (Optional)"
                  id="description"
                  // eslint-disable-next-line react/jsx-props-no-spreading
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
              !fileName
                ? !_.isEmpty(errors)
                : !_.isEmpty(errors) || !pageData?.sha
            }
          >
            Save
          </LoadingButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
