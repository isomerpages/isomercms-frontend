import {
  VStack,
  FormControl,
  Flex,
  Box,
  InputLeftAddon,
  Text,
  InputGroup,
} from "@chakra-ui/react"
import {
  FormErrorMessage,
  FormLabel,
  Input,
  Link,
  Textarea,
} from "@opengovsg/design-system-react"
import { useFormContext, useFormState } from "react-hook-form"

import { FormTitle } from "components/Form"

import { Section, SectionHeader } from "layouts/components"

import { DOMAIN_NAME_REGEX } from "utils/validators"

import type { SiteInfo } from "types/settings"

import { FormToggle } from "./components/FormToggle"
import { SettingsFormFieldMedia } from "./components/SettingsFormFieldMedia"

interface GeneralSettingsProp {
  isError: boolean
}

export const GeneralSettings = ({
  isError,
}: GeneralSettingsProp): JSX.Element => {
  const { register } = useFormContext()
  const { errors } = useFormState<SiteInfo>()

  return (
    <Section id="general-fields">
      <SectionHeader label="General" />
      <VStack spacing="1.5rem" align="flex-start" w="50%">
        <FormControl isDisabled={isError} isRequired>
          <Box mb="0.75rem">
            <FormLabel mb={0}>Site Title</FormLabel>
            <FormLabel.Description color="text.description">
              This is the title that displays on Google during a search, your
              site footer, browser tab and when sharing on social media or
              messaging channels.
            </FormLabel.Description>
          </Box>
          <Input
            w="100%"
            id="title"
            placeholder="Title"
            {...register("title", { required: true })}
          />
        </FormControl>
        <FormControl isDisabled={isError}>
          <Box mb="0.75rem">
            <FormLabel mb={0}>Site Description</FormLabel>
            <FormLabel.Description color="text.description">
              This description will be displayed when sharing on social media or
              messaging channels.
            </FormLabel.Description>
          </Box>
          <Textarea
            w="100%"
            minH="9rem"
            placeholder="A Singapore Government site built with Isomer"
            id="description"
            {...register("description")}
          />
        </FormControl>
        <FormControl isDisabled={isError} isRequired isInvalid={!!errors.url}>
          <Box mb="0.75rem">
            <FormLabel mb={0}>Search Engine Optimisation (SEO)</FormLabel>
            <FormLabel.Description color="text.description">
              Enter the web domain of your site, to improve its position on
              search result pages.
            </FormLabel.Description>
          </Box>
          <InputGroup>
            <InputLeftAddon>https://</InputLeftAddon>
            <Input
              w="100%"
              id="url"
              placeholder="www.open.gov.sg"
              {...register("url", {
                required: true,
                pattern: RegExp(DOMAIN_NAME_REGEX),
              })}
            />
          </InputGroup>
          <FormErrorMessage>
            {errors.url?.type === "required" &&
              "This field cannot be left blank"}
            {errors.url?.type === "pattern" &&
              "The web domain you have entered is not valid"}
          </FormErrorMessage>
        </FormControl>
        <FormControl isDisabled={isError}>
          <Flex justifyContent="space-between" w="100%">
            <FormLabel>Display government masthead</FormLabel>
            {/* NOTE: This should be toggle from design system
                but the component is broken and doesn't display a slider */}
            <FormToggle name="displayGovMasthead" />
          </Flex>
        </FormControl>
        <FormControl isDisabled={isError} isRequired>
          <VStack spacing="0.75rem" align="flex-start" w="100%">
            <Box>
              <FormTitle>Shareicon</FormTitle>
              <FormLabel.Description color="text.description">
                {/* NOTE: See here: https://github.com/opengovsg/design-system/issues/440
                 * for why this is required
                 */}
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/* @ts-ignore */}
                <Text>
                  This is the preview image that shows when your site url is
                  shared on social media or messaging channels.{" "}
                  <Link
                    isExternal
                    href="https://guide.isomer.gov.sg/guide/settings"
                  >
                    Learn more
                  </Link>
                </Text>
              </FormLabel.Description>
            </Box>
            <SettingsFormFieldMedia name="shareicon" isDisabled={isError} />
          </VStack>
        </FormControl>
      </VStack>
    </Section>
  )
}
