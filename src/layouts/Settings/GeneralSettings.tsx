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
            {/* NOTE: This should be toggle from design system 
                but the component is broken and doesn't display a slider */}
            <Switch {...register("displayGovMasthead")} />
          </Flex>
        </FormControl>
        <FormControl isDisabled={isError} isRequired>
          <VStack spacing="0.75rem" align="flex-start" w="100%">
            <FormTitle>Shareicon</FormTitle>
            <SettingsFormFieldMedia name="shareicon" isDisabled={isError} />
          </VStack>
        </FormControl>
      </VStack>
    </Section>
  )
}
