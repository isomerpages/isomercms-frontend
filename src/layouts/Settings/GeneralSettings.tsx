import { VStack, FormControl, Flex, Box } from "@chakra-ui/react"
import { FormLabel, Input, Textarea } from "@opengovsg/design-system-react"
import { FormTitle } from "components/Form"
import { useFormContext } from "react-hook-form"

import { Section, SectionHeader } from "layouts/components"

import { FormToggle } from "./components/FormToggle"
import { SettingsFormFieldMedia } from "./components/SettingsFormFieldMedia"

interface GeneralSettingsProp {
  isError: boolean
}

export const GeneralSettings = ({
  isError,
}: GeneralSettingsProp): JSX.Element => {
  const { register } = useFormContext()

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
        <FormControl isDisabled={isError} isRequired>
          <Box mb="0.75rem">
            <FormLabel mb={0}>Site URL</FormLabel>
            <FormLabel.Description color="text.description">
              This is the URL that the Isomer site will be published to.
            </FormLabel.Description>
          </Box>
          <Input
            w="100%"
            id="url"
            placeholder="https://"
            {...register("url", { required: true })}
          />
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
              <FormLabel.Description useMarkdown color="text.description">
                This is the preview image that shows when your site url is
                shared on social media or messaging channels. [Learn
                more](https://guide.isomer.gov.sg/guide/settings)
              </FormLabel.Description>
            </Box>
            <SettingsFormFieldMedia name="shareicon" isDisabled={isError} />
          </VStack>
        </FormControl>
      </VStack>
    </Section>
  )
}
