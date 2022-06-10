import {
  Text,
  Box,
  VStack,
  Skeleton,
  StackDivider,
  Flex,
} from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import _ from "lodash"
import { useEffect, useLayoutEffect, useRef } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { useParams } from "react-router-dom"

import { useGetSettings, useUpdateSettings } from "hooks/settingsHooks"

import { useErrorToast, useSuccessToast } from "utils/toasts"

import { SiteSettings } from "types/settings"
import { DEFAULT_RETRY_MSG } from "utils"

import { Section } from "../components"
import { SiteViewLayout } from "../layouts"

import { AnalyticsSettings } from "./AnalyticsSettings"
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

  // just handles the state and splits it for the children
  // will do skeleton when prior to load
  // on fail, present a toast and set disabled for all forms to lock editing
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
      <Skeleton isLoaded={!isGetSettingsLoading} w="100%">
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

// probably want a settings context to store state
// original data
// whether it's disabled

const SettingsForm = ({ settings, isError }: SettingsFormProps) => {
  const { siteName } = useParams<{ siteName: string }>()
  // NOTE: Use a ref to persist the initial value between renders
  const initialSettings = useRef(settings)

  const methods = useForm({
    mode: "onTouched",
    defaultValues: settings,
  })
  const successToast = useSuccessToast()
  const {
    mutateAsync: updateSettings,
    error: updateSettingsError,
    isLoading,
    isSuccess,
  } = useUpdateSettings(siteName)
  const errorToast = useErrorToast()

  const onSubmit = (data: SiteSettings) => {
    updateSettings(data)
  }
  const { formState, reset } = methods

  // NOTE: Because the default values are cached, we need to reset whenever they change
  useEffect(() => {
    reset(settings, { keepDirtyValues: true, keepDirty: true })
  }, [reset, formState.dirtyFields, settings])

  // Warn on sync mutation on dirty (edited) field
  useLayoutEffect(() => {
    const hasDiff = !_.isEqual(settings, initialSettings.current)
    if (hasDiff) {
      errorToast({
        title: "Error",
        description:
          "Your site settings have recently been changed by another user. You can choose to either override their changes, or go back to editing. We recommend you to make a copy of your changes elsewhere, and come back later to reconcile your changes.",
      })
    }
  }, [errorToast, settings])

  // Reset cache on success
  useEffect(() => {
    if (isSuccess) {
      reset()
    }
  }, [isSuccess, reset])

  // Trigger an error toast informing the user if settings data could not be updated
  useLayoutEffect(() => {
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
  useLayoutEffect(() => {
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
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <VStack
            align="flex-start"
            spacing="2rem"
            divider={<StackDivider borderColor="border.divider.alt" />}
          >
            <GeneralSettings isError={isError} />
            <LogoSettings isError={isError} />
            <SocialMediaSettings isError={isError} />
            <FooterSettings isError={isError} />
            <AnalyticsSettings isError={isError} />
            <Flex
              justify="flex-end"
              px="2rem"
              py="0.625rem"
              bg="white"
              w="calc(100% + 4rem)"
              left={0}
              position="sticky"
              bottom={0}
              borderTop="1px solid"
              borderColor="border.divider.alt"
              ml="-2rem"
              mb="-2rem"
            >
              <Button type="submit" isLoading={isLoading}>
                Save
              </Button>
            </Flex>
          </VStack>
        </form>
      </FormProvider>
    </Box>
  )
}
