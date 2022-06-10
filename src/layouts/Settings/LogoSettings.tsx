import { VStack, FormControl } from "@chakra-ui/react"
import { FormTitle } from "components/Form"

import { Section, SectionHeader } from "layouts/components"

import { SettingsFormFieldMedia } from "./components/SettingsFormFieldMedia"

interface LogoSettingsProp {
  isError: boolean
}

export const LogoSettings = ({ isError }: LogoSettingsProp): JSX.Element => {
  return (
    <Section id="logo-fields">
      <SectionHeader label="Logos" />
      <VStack spacing="1.5rem" align="flex-start" w="50%">
        <FormControl isDisabled={isError} isRequired>
          <VStack spacing="0.75rem" align="flex-start" w="100%">
            <FormTitle>Agency logo</FormTitle>
            <SettingsFormFieldMedia name="agencyLogo" isDisabled={isError} />
          </VStack>
        </FormControl>
        <FormControl isDisabled={isError} isRequired>
          <VStack spacing="0.75rem" align="flex-start" w="100%">
            <FormTitle>Favicon</FormTitle>
            <SettingsFormFieldMedia name="favicon" isDisabled={isError} />
          </VStack>
        </FormControl>
      </VStack>
    </Section>
  )
}
