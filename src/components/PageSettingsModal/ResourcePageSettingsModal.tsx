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
  InputLeftAddon,
  InputGroup,
  Select,
  Divider,
} from "@chakra-ui/react"
import { yupResolver } from "@hookform/resolvers/yup"
import {
  FormErrorMessage,
  FormLabel,
  ModalCloseButton,
  Link,
} from "@opengovsg/design-system-react"
import { format } from "date-fns-tz"
import _ from "lodash"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import slugify from "slugify"

import { Breadcrumb } from "components/folders/Breadcrumb"
import {
  FormContext,
  FormError,
  FormTitle,
  FormDescription,
} from "components/Form"
import FormFieldMedia from "components/FormFieldMedia"
import { LoadingButton } from "components/LoadingButton"

import { pageFileNameToTitle } from "utils"

import { PageSettingsSchema } from "./PageSettingsSchema"

interface ResourceModalParams {
  siteName: string
  fileName: string
  resourceRoomName: string
  resourceCategoryName: string
}

interface ResourcePageFrontMatter {
  layout: string
  title: string
  permalink?: string
  date: string
  // eslint-disable-next-line camelcase
  file_url?: string
  external?: string
  description?: string
  image?: string
}

interface ResourcePageParams {
  content: {
    frontMatter: ResourcePageFrontMatter
    pageBody?: string
  }
  sha: string
  name: string
}

interface ResourcePageSettingsModalParams {
  params: ResourceModalParams
  pageData?: ResourcePageParams
  onProceed: ({
    pageData,
    data,
    resourceRoomName,
  }: {
    pageData?: ResourcePageParams
    data: ResourcePageFrontMatter
    resourceRoomName: string
  }) => void
  pagesData: ResourcePageParams[]
  siteUrl: string
  onClose: () => void
}

const generateDefaultFrontMatter = (
  resourceRoomName: string,
  resourceCategoryName: string,
  existingTitles: string[]
) => {
  let exampleTitle = "Example Title"
  const exampleDate = format(Date.now(), "yyyy-MM-dd")
  const exampleLayout = "post"
  while (
    existingTitles.includes(
      `${exampleDate}-${exampleLayout}-${exampleTitle}.md`
    )
  ) {
    exampleTitle += " 1"
  }
  const resourceRoomPermalink = slugify(resourceRoomName)
    ? `${slugify(resourceRoomName)}`
    : "unrecognised/"
  const resourceCategoryPermalink = slugify(resourceCategoryName)
    ? `${slugify(resourceCategoryName)}`
    : "unrecognised/"
  const examplePermalink = `/${resourceRoomPermalink}/${resourceCategoryPermalink}/permalink`.toLowerCase()
  return {
    title: exampleTitle,
    permalink: examplePermalink,
    date: exampleDate,
    layout: exampleLayout,
    description: "",
    image: "",
  }
}

// eslint-disable-next-line import/prefer-default-export
export const ResourcePageSettingsModal = ({
  params,
  pageData,
  onProceed,
  pagesData,
  siteUrl,
  onClose,
}: ResourcePageSettingsModalParams): JSX.Element => {
  const { fileName, resourceRoomName, resourceCategoryName } = params

  const existingTitlesArray = pagesData
    .filter((page: ResourcePageParams) => page.name !== fileName)
    .map((page: ResourcePageParams) =>
      pageFileNameToTitle(page.name, !!params.resourceRoomName)
    )

  const defaultFrontMatter = generateDefaultFrontMatter(
    resourceRoomName,
    resourceCategoryName,
    existingTitlesArray
  )

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm<ResourcePageFrontMatter>({
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
      if (pageData.content.frontMatter.file_url) {
        // backwards compatible with previous resource files
        setValue("layout", "file", {
          shouldValidate: true,
        })
        setValue("permalink", "")
      }
      if (pageData.content.frontMatter.layout === "link") {
        if (pageData.content.frontMatter.permalink) {
          // backwards compatible with previous link files
          setValue(
            "external",
            pageData.content.frontMatter.permalink.replace("https://", "")
          )
        } else if (pageData.content.frontMatter.external) {
          setValue(
            "external",
            pageData.content.frontMatter.external.replace("https://", "")
          )
        }
        trigger("permalink")
        trigger("external")
        trigger("title")
      }
    }
  }, [fileName, pageData, setValue, trigger])

  /** ******************************** */
  /*     handler functions    */
  /** ******************************** */

  const onSubmit = (data: ResourcePageFrontMatter) => {
    const processedData = {
      ...data,
    }
    if (data.layout === "file") {
      delete processedData.permalink
    } else if (data.layout === "link") {
      delete processedData.permalink
      processedData.external = `https://${processedData.external}`
    }
    return onProceed({
      pageData,
      data: processedData,
      resourceRoomName,
    })
  }

  return (
    <Modal isOpen onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton id="settings-CLOSE" />
        <ModalHeader>
          <Text as="h1">
            {fileName ? "Resource page settings" : "Create new resource"}
          </Text>
        </ModalHeader>
        <ModalBody>
          {fileName && !pageData ? (
            <Center>
              <Spinner />
            </Center>
          ) : (
            <Box>
              <Breadcrumb
                params={params}
                title={watch("title")}
                isLink={false}
              />
              {/* Resource Type */}
              <FormControl
                isRequired
                isInvalid={!!errors.layout?.message}
                onChange={() => {
                  trigger("permalink")
                  trigger("external")
                  trigger("title")
                }}
              >
                <Box mb="0.75rem">
                  <FormLabel mb={0}>Resource Type</FormLabel>
                </Box>
                <Select
                  {...register("layout", { required: true })}
                  id="layout"
                  value={watch("layout")}
                >
                  <option value="post">Page</option>
                  <option value="file">Downloadable File</option>
                  <option value="link">External Link</option>
                </Select>
                <FormErrorMessage>{errors.layout?.message}</FormErrorMessage>
              </FormControl>
              <Divider mt="2rem" mb="1rem" />
              {/* Title */}
              <FormControl isRequired isInvalid={!!errors.title?.message}>
                <FormLabel>Page title</FormLabel>
                <Input
                  placeholder="Page title"
                  id="title"
                  {...register("title", { required: true })}
                />
                <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
              </FormControl>
              <br />
              {watch("layout") === "post" && (
                <>
                  {/* Permalink */}
                  <FormControl
                    isInvalid={!!errors.permalink?.message}
                    isRequired
                    isDisabled={watch("layout") === "file"}
                  >
                    <Box mb="0.75rem">
                      <FormLabel mb={0}>Page URL</FormLabel>
                      <FormLabel.Description color="text.description">
                        {`${siteUrl}${watch("permalink")}`}
                      </FormLabel.Description>
                    </Box>
                    <Input
                      {...register("permalink", { required: true })}
                      id="permalink"
                      placeholder="Insert /page-url or https://"
                    />
                    <FormErrorMessage>
                      {errors.permalink?.message}
                    </FormErrorMessage>
                  </FormControl>
                  <br />
                </>
              )}
              {/* Date */}
              <FormControl isRequired isInvalid={!!errors.date?.message}>
                <Box mb="0.75rem">
                  <FormLabel mb={0}>Date (YYYY-MM-DD)</FormLabel>
                  <FormLabel.Description color="text.description">
                    Resources are organised by latest date in your site.
                  </FormLabel.Description>
                </Box>
                <Input
                  {...register("date", { required: true })}
                  id="date"
                  placeholder="Date (YYYY-MM-DD)"
                />
                <FormErrorMessage>{errors.date?.message}</FormErrorMessage>
              </FormControl>
              <Divider mt="2rem" mb="1rem" />
              {/* File URL */}
              {watch("layout") === "file" && (
                <>
                  <FormContext
                    hasError={!!errors.file_url?.message}
                    onFieldChange={(e) => {
                      setValue("file_url", e.target.value)
                      trigger("file_url")
                    }}
                  >
                    <FormTitle>File</FormTitle>
                    <FormLabel.Description color="text.description">
                      The maximum file size allowed is 5MB.
                    </FormLabel.Description>
                    <FormFieldMedia
                      placeholder="Select File"
                      register={register}
                      id="file_url"
                      type="files"
                      inlineButtonText="Select File"
                    />
                    <FormError>{errors.file_url?.message}</FormError>
                  </FormContext>
                </>
              )}
              {watch("layout") === "post" && (
                <>
                  {/* SEO fields */}
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
                          Description snippet shown in search results.
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
                </>
              )}
              {watch("layout") === "link" && (
                <FormControl isRequired isInvalid={!!errors.external}>
                  <Box mb="0.75rem">
                    <FormLabel mb={0}>Link</FormLabel>
                    <FormLabel.Description color="text.description">
                      When users click on this resource tile, they will be
                      redirected to this link.
                    </FormLabel.Description>
                  </Box>
                  <InputGroup>
                    <InputLeftAddon>https://</InputLeftAddon>
                    <Input
                      w="100%"
                      id="link"
                      placeholder="www.open.gov.sg"
                      {...register("external", {
                        required: true,
                      })}
                    />
                  </InputGroup>
                  <FormErrorMessage>
                    {errors.permalink?.message}
                  </FormErrorMessage>
                </FormControl>
              )}
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
