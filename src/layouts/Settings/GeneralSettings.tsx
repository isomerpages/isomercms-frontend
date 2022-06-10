import { VStack, FormControl, Flex, Switch } from "@chakra-ui/react"
import { FormLabel, Input, Textarea } from "@opengovsg/design-system-react"
import { FormTitle } from "components/Form"
import { useFormContext } from "react-hook-form"

import { Section, SectionHeader } from "layouts/components"

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
        <FormControl isDisabled={isError}>
          <FormLabel description="This is the text displayed in search results">
            Site Title
          </FormLabel>
          <Input
            w="100%"
            id="title"
            placeholder="Title"
            {...register("title")}
          />
        </FormControl>
        <FormControl isDisabled={isError}>
          <FormLabel description="This description previews in search results">
            Site Description
          </FormLabel>
          <Textarea
            w="100%"
            minH="9rem"
            placeholder="Description"
            id="description"
            {...register("description")}
          />
        </FormControl>
        <FormControl isDisabled={isError}>
          <Flex justifyContent="space-between" w="100%">
            <FormLabel>Display government masthead</FormLabel>
            {/* NOTE: This should be toggle from design system but the component is broken and doesn't display a slider */}
            <Switch
              colorScheme="primary"
              id="is_government"
              {...register("displayGovMasthead")}
            />
          </Flex>
        </FormControl>
        <FormControl isDisabled={isError} isRequired>
          <FormTitle>Shareicon</FormTitle>
          <SettingsFormFieldMedia
            {...register("shareicon", { required: false, disabled: true })}
            name="shareicon"
            isDisabled={isError}
          />
        </FormControl>
      </VStack>
    </Section>
  )
}
