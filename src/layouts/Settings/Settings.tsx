import {
  Text,
  Box,
  VStack,
  Skeleton,
  StackDivider,
  useDisclosure,
} from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import _ from "lodash"
import { useEffect, useRef } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { useParams } from "react-router-dom"

import { Footer } from "components/Footer"

import { useDirtyFieldContext } from "contexts/DirtyFieldContext"
import { useLoginContext } from "contexts/LoginContext"

import { useGetSettings, useUpdateSettings } from "hooks/settingsHooks"

import { useErrorToast, useSuccessToast } from "utils/toasts"

import { SiteSettings } from "types/settings"
import { DEFAULT_RETRY_MSG } from "utils"

import { Section } from "../components"
import { SiteEditLayout } from "../layouts"

import { AnalyticsSettings } from "./AnalyticsSettings"
import { ColourSettings } from "./ColourSettings"
import { OverrideWarningModal } from "./components/OverrideWarningModal"
import { FooterSettings } from "./FooterSettings"
import { GeneralSettings } from "./GeneralSettings"
import { LogoSettings } from "./LogoSettings"
import { PrivacySettings } from "./PrivacySettings"
import { SocialMediaSettings } from "./SocialMediaSettings"

export const Settings = (): JSX.Element => {
  const { siteName } = useParams<{ siteName: string }>()
  const { userId } = useLoginContext()
  // Only github users have userId, and not logged in users have userId as "Unknown user"
  const isGithubUser = userId !== "Unknown user" && !!userId
  const {
    data: settingsData,
    isLoading: isGetSettingsLoading,
    isError: isGetSettingsError,
  } = useGetSettings(siteName, !isGithubUser)
  const errorToast = useErrorToast()

  // Trigger an error toast informing the user if settings data could not be fetched
  useEffect(() => {
    if (isGetSettingsError) {
      errorToast({
        id: "get-settings-error",
        title: "Error",
        description: `Site settings could not be retrieved. ${DEFAULT_RETRY_MSG}`,
      })
    }
  }, [errorToast, isGetSettingsError])

  return (
    <SiteEditLayout align="flex-start">
      <Section>
        <Box>
          <Text as="h4" textStyle="h4">
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
    </SiteEditLayout>
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
  const { isDirty, dirtyFields } = formState
  const successToast = useSuccessToast()
  const errorToast = useErrorToast()
  const { setIsDirty } = useDirtyFieldContext()
  const {
    mutateAsync: updateSettings,
    error: updateSettingsError,
    isLoading,
    isSuccess,
  } = useUpdateSettings(
    siteName,
    () => {
      successToast({
        id: "update-settings-success",
        title: "Success",
        description: "Site settings have been updated",
      })
    },
    () => {
      const errorMessage =
        updateSettingsError?.response?.status === 409
          ? "Your site settings have recently been changed by another user. You can choose to either override their changes, or go back to editing. We recommend you to make a copy of your changes elsewhere, and come back later to reconcile your changes."
          : `Site settings could not be updated. ${DEFAULT_RETRY_MSG}`
      return errorToast({
        id: "update-settings-error",
        title: "Error",
        description: errorMessage,
      })
    }
  )

  const onSubmit = methods.handleSubmit((data: SiteSettings) => {
    updateSettings(data)
  })

  setIsDirty(isDirty)

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
        id: "update-settings-diff-error",
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
            {getValues("isAmplifySite") && (
              <PrivacySettings isError={isError} />
            )}
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
                if (hasDiff) {
                  onOpen()
                } else {
                  onSubmit()
                }
              }}
            >
              Save
            </Button>
          </Footer>
          <OverrideWarningModal
            isOpen={isOpen || (hasDiff && isLoading)}
            onClose={onClose}
            isLoading={isLoading}
            onSubmit={onSubmit}
          />
        </form>
      </FormProvider>
    </Box>
  )
}
