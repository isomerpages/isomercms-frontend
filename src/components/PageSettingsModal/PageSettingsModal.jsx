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
import ResourceFormFields from "components/ResourceFormFields"
import _ from "lodash"
import PropTypes from "prop-types"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

import { getDefaultFrontMatter, pageFileNameToTitle } from "utils"

import { PageSettingsSchema } from "./PageSettingsSchema"

// axios settings
axios.defaults.withCredentials = true

// eslint-disable-next-line import/prefer-default-export
export const PageSettingsModal = ({
  params,
  pageData,
  onProceed,
  pagesData,
  siteUrl,
  onClose,
}) => {
  const { fileName, resourceRoomName } = params

  const existingTitlesArray = pagesData
    .filter((page) => page.name !== fileName)
    .map((page) => pageFileNameToTitle(page.name, !!params.resourceRoomName))

  const defaultFrontMatter = getDefaultFrontMatter(params, existingTitlesArray)

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
    context: { type: resourceRoomName ? "resourcePage" : "" },
  })

  /** ******************************** */
  /*     useEffects to load data     */
  /** ******************************** */

  useEffect(() => {
    if (fileName && pageData && pageData.content) {
      Object.entries(pageData.content.frontMatter).forEach(([key, value]) =>
        setValue(key, value, {
          shouldValidate: true,
        })
      )
      if (pageData.content.frontMatter.file_url) {
        // backwards compatible with previous resource files
        setValue("layout", "file", {
          shouldValidate: true,
        })
        setValue("permalink", undefined)
      }
    }
  }, [pageData, setValue])

  /** ******************************** */
  /*     handler functions    */
  /** ******************************** */

  const onSubmit = (data) => {
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
              <Breadcrumb params={params} title={watch("title")} />
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
                      {resourceRoomName && (
                        <FormLabel.Description color="text.description">
                          Enter what you want to link to (e.g. /page-url for
                          pages on your site, or https://www.url.com for
                          external websites).
                        </FormLabel.Description>
                      )}
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
              {resourceRoomName && (
                <>
                  <p className={elementStyles.formLabel}>Resources details</p>
                  <ResourceFormFields
                    register={register}
                    errors={errors}
                    watch={watch}
                    setValue={setValue}
                    trigger={trigger}
                  />
                </>
              )}
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

PageSettingsModal.propTypes = {
  onClose: PropTypes.func.isRequired,
}
