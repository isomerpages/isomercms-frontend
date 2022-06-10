import { VStack, FormControl } from "@chakra-ui/react"
import { FormLabel, Input } from "@opengovsg/design-system-react"
import { useFormContext } from "react-hook-form"

import { Section, SectionHeader } from "layouts/components"

interface AnalyticsSettingsProp {
  isError: boolean
}

export const AnalyticsSettings = ({
  isError,
}: AnalyticsSettingsProp): JSX.Element => {
  const { register } = useFormContext()
  return (
    <Section id="analytics-fields">
      <SectionHeader label="Analytics" />
      <VStack spacing="1.5rem" align="flex-start" w="50%">
        <FormControl isDisabled={isError}>
          <FormLabel>Facebook Pixel</FormLabel>
          <Input w="100%" {...register("pixel")} />
        </FormControl>

        <FormControl isDisabled={isError}>
          <FormLabel>Google Analytics</FormLabel>
          <Input w="100%" {...register("ga")} />
        </FormControl>

        <FormControl isDisabled={isError}>
          <FormLabel>LinkedIn Insights</FormLabel>
          <Input w="100%" {...register("insights")} />
        </FormControl>
      </VStack>
    </Section>
  )
}
