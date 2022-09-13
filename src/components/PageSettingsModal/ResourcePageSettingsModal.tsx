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
  useDisclosure,
} from "@chakra-ui/react"
import { yupResolver } from "@hookform/resolvers/yup"
import {
  FormErrorMessage,
  FormLabel,
  ModalCloseButton,
} from "@opengovsg/design-system-react"
import axios from "axios"
import { Breadcrumb } from "components/folders/Breadcrumb"
import {
  FormContext,
  FormError,
  FormTitle,
  FormDescription,
} from "components/Form"
import FormFieldMedia from "components/FormFieldMedia"
import { LoadingButton } from "components/LoadingButton"
import MediaModal from "components/media/MediaModal"
import ResourceFormFields from "components/ResourceFormFields"
import { format } from "date-fns-tz"
import _ from "lodash"
import PropTypes from "prop-types"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import slugify from "slugify"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

import { getDefaultFrontMatter, pageFileNameToTitle } from "utils"

import { PageSettingsSchema } from "./PageSettingsSchema"

// axios settings
axios.defaults.withCredentials = true

interface ResourceModalParams {
  siteName: string
  fileName: string
  resourceRoomName: string
  resourceCategoryName: string
}

interface ResourcePageFrontMatter {
  layout: string
  title: string
  permalink: string
  date: string
  // eslint-disable-next-line camelcase
  file_url?: string
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
  const examplePermalink = `/${resourceRoomPermalink}/${resourceCategoryPermalink}/permalink`
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
  const {
    isOpen: isMediaOpen,
    onClose: onMediaClose,
    onOpen: onMediaOpen,
  } = useDisclosure()

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
  // getDefaultFrontMatter(params, existingTitlesArray)

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm({
    mode: "onTouched",
    resolver: yupResolver(PageSettingsSchema(existingTitlesArray)),
    defaultValues: defaultFrontMatter,
    context: "resourcePage",
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
    }
  }, [fileName, pageData, setValue])

  /** ******************************** */
  /*     handler functions    */
  /** ******************************** */

  const onSubmit = (data: ResourcePageFrontMatter) => {
    return onProceed({
      pageData,
      data,
      resourceRoomName,
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
              {watch("layout") !== "file" && (
                <>
                  <FormControl
                    isInvalid={!!errors.permalink?.message}
                    isRequired
                    isDisabled={watch("layout") === "file"}
                  >
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
                    <FormErrorMessage>
                      {errors.permalink?.message}
                    </FormErrorMessage>
                  </FormControl>
                  <br />
                </>
              )}
              <Text textStyle="h4">Resources details</Text>
              <ResourceFormFields
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
                trigger={trigger}
              />
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
