import { VStack, FormControl, Flex, Switch } from "@chakra-ui/react"
import { FormLabel, Input, Textarea } from "@opengovsg/design-system-react"
import { FormTitle } from "components/Form"
import { useFormContext } from "react-hook-form"

import { Section, SectionHeader } from "layouts/components"

import { SettingsFormFieldMedia } from "./components/SettingsFormFieldMedia"

interface LogoSettingsProp {
  isError: boolean
}

export const LogoSettings = ({ isError }: LogoSettingsProp): JSX.Element => {
  const { register } = useFormContext()
  return (
    <Section id="general-fields">
      <SectionHeader label="Logos" />
      <VStack spacing="1.5rem" align="flex-start" w="50%">
        <FormControl isDisabled={isError} isRequired>
          <VStack spacing="0.75rem" align="flex-start" w="100%">
            <FormTitle>Agency logo</FormTitle>
            <SettingsFormFieldMedia
              {...register("agencyLogo", { required: false, disabled: true })}
              name="agencyLogo"
              isDisabled={isError}
            />
          </VStack>
        </FormControl>
        <FormControl isDisabled={isError} isRequired>
          <VStack spacing="0.75rem" align="flex-start" w="100%">
            <FormTitle>Favicon</FormTitle>
            <SettingsFormFieldMedia
              {...register("favicon", { required: false, disabled: true })}
              name="favicon"
              isDisabled={isError}
            />
          </VStack>
        </FormControl>
      </VStack>
    </Section>
  )
}
