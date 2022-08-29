import {
  Text,
  Box,
  VStack,
  Skeleton,
  StackDivider,
  useDisclosure,
} from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import { Footer } from "components/Footer"
import { WarningModal } from "components/WarningModal"
import _ from "lodash"
import { useEffect, useRef } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { useParams } from "react-router-dom"

import { useGetSettings, useUpdateSettings } from "hooks/settingsHooks"

import { useErrorToast, useSuccessToast } from "utils/toasts"

import { SiteSettings } from "types/settings"
import { DEFAULT_RETRY_MSG } from "utils"

import { Section } from "../components"
import { SiteViewLayout } from "../layouts"

import { AnalyticsSettings } from "./AnalyticsSettings"
import { ColourSettings } from "./ColourSettings"
import { FooterSettings } from "./FooterSettings"
import { GeneralSettings } from "./GeneralSettings"
import { LogoSettings } from "./LogoSettings"
import { SocialMediaSettings } from "./SocialMediaSettings"

export const Settings = (): JSX.Element => {
  const { siteName } = useParams<{ siteName: string }>()
  const {
    data: settingsData,
    isLoading: isGetSettingsLoading,
    isError: isGetSettingsError,
  } = useGetSettings(siteName)
  const errorToast = useErrorToast()

  // Trigger an error toast informing the user if settings data could not be fetched
  useEffect(() => {
    if (isGetSettingsError) {
      errorToast({
        title: "Error",
        description: `Site settings could not be retrieved. ${DEFAULT_RETRY_MSG}`,
      })
    }
  }, [errorToast, isGetSettingsError])

  return (
    <SiteViewLayout align="flex-start">
      <Section>
        <Box>
          <Text as="h2" textStyle="h2">
            Site settings
          </Text>
          <Text textColor="text.description" textStyle="body-2">
            Change site-wide settings such as SEO, and logos, and add
            integrations for analytics and footer
          </Text>
        </Box>
      </Section>
      {/* General fields */}
      <Skeleton
        isLoaded={!isGetSettingsLoading}
        w="100%"
        h={isGetSettingsLoading ? "full" : "fit-content"}
      >
        {settingsData && (
          <SettingsForm settings={settingsData} isError={isGetSettingsError} />
        )}
      </Skeleton>
    </SiteViewLayout>
  )
}

interface SettingsFormProps {
  settings: SiteSettings
  isError: boolean
}

const SettingsForm = ({ settings, isError }: SettingsFormProps) => {
  const { siteName } = useParams<{ siteName: string }>()
  // NOTE: Use a ref to persist the initial value between renders
  const initialSettings = useRef(settings)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const methods = useForm({
    mode: "onTouched",
    defaultValues: settings,
  })
  const { formState, reset, getValues } = methods
  const { dirtyFields } = formState
  const successToast = useSuccessToast()
  const {
    mutateAsync: updateSettings,
    error: updateSettingsError,
    isLoading,
    isSuccess,
  } = useUpdateSettings(siteName)
  const errorToast = useErrorToast()
  const onSubmit = methods.handleSubmit((data: SiteSettings) => {
    updateSettings(data)
  })

  const dirtyFieldKeys = _.keys(dirtyFields)
  const hasDiff = !_.isEqual(
    _.pick(settings, dirtyFieldKeys),
    _.pick(initialSettings.current, dirtyFieldKeys)
  )

  // NOTE: Because the default values are cached, we need to reset whenever they change
  useEffect(() => {
    reset(settings, { keepDirtyValues: true, keepDirty: true })
  }, [reset, dirtyFields, settings])

  // Warn on sync mutation on dirty (edited) field
  // this warning should only show for dirty fields
  useEffect(() => {
    if (hasDiff) {
      errorToast({
        title: "Error",
        description:
          "Your site settings have recently been changed by another user. You can choose to either override their changes, or go back to editing. We recommend you to make a copy of your changes elsewhere, and come back later to reconcile your changes.",
      })
    }
  }, [errorToast, hasDiff])

  // Reset cache on success
  useEffect(() => {
    if (isSuccess) {
      // Update to the new form state
      initialSettings.current = getValues()
      reset(settings)
    }
  }, [isSuccess, getValues, reset, settings])

  // Trigger an error toast informing the user if settings data could not be updated
  useEffect(() => {
    if (updateSettingsError) {
      const errorMessage =
        updateSettingsError?.response?.status === 409
          ? "Your site settings have recently been changed by another user. You can choose to either override their changes, or go back to editing. We recommend you to make a copy of your changes elsewhere, and come back later to reconcile your changes."
          : `Site settings could not be updated. ${DEFAULT_RETRY_MSG}`
      errorToast({
        title: "Error",
        description: errorMessage,
      })
    }
  }, [errorToast, updateSettingsError])

  // Trigger a success toast informing the user if settings data was updated successfully
  useEffect(() => {
    if (isSuccess) {
      successToast({
        title: "Success!",
        description: "Successfully updated settings!",
      })
    }
  }, [isSuccess, successToast])

  return (
    <Box w="100%">
      <FormProvider {...methods}>
        <form onSubmit={onSubmit}>
          <VStack
            align="flex-start"
            spacing="2rem"
            divider={<StackDivider borderColor="border.divider.alt" />}
            mb="7.125rem"
          >
            <GeneralSettings isError={isError} />
            <LogoSettings isError={isError} />
            <ColourSettings isError={isError} />
            <SocialMediaSettings isError={isError} />
            <FooterSettings isError={isError} />
            <AnalyticsSettings isError={isError} />
          </VStack>
          <Footer
            w="calc(100% + 4rem)"
            ml="-2rem"
            mb="-2rem"
            // NOTE: Borders at left/bottom are already provided by sidebar and layout.
            // Hence, omit the border at those areas to ensure correct border sizing.
            borderLeft={0}
            borderBottom={0}
          >
            <Button
              isLoading={isLoading}
              onClick={() => {
                hasDiff ? onOpen() : onSubmit()
              }}
            >
              Save
            </Button>
          </Footer>
          <WarningModal
            isCentered
            // NOTE: The second conditional is required as the wrapped method by react hook form
            // terminates earlier than the actual call to the BE API.
            // Hence, the model is open if it was triggered manually or if the warning in the modal was acknowledged
            // and the user still chose to proceed (this only occurs when there is a diff)
            isOpen={isOpen || (hasDiff && isLoading)}
            onClose={onClose}
            displayTitle="Override Changes"
            displayText={
              <Text>
                Your site settings have recently been changed by another user.
                You can choose to either override their changes, or go back to
                editing.
                {/*
                 * NOTE: We have 2 line breaks here because we want a line spacing between the 2 <paragraphs.
                 * Only have 1 br would cause the second paragraph to begin on a new line but without the line spacing.
                 */}
                <br />
                <br />
                We recommend you to make a copy of your changes elsewhere, and
                come back later to reconcile your changes.
              </Text>
            }
          >
            <Button variant="outline" onClick={onClose}>
              Back to editing
            </Button>
            <Button
              colorScheme="danger"
              type="submit"
              isLoading={isLoading}
              onClick={async () => {
                await onSubmit()
                onClose()
              }}
            >
              Override
            </Button>
          </WarningModal>
        </form>
      </FormProvider>
    </Box>
  )
}
